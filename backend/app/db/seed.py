from __future__ import annotations

from collections.abc import Iterable
from csv import DictReader
from datetime import date
from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import session_scope
from app.models import Benefit, CardBenefit, CardRewardCategory, CreditCard, Issuer, RewardCategory, RewardRate, SignupOffer
from app.utils.slug import slugify


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [{key.strip(): (value.strip() if value is not None else "") for key, value in row.items()} for row in DictReader(handle)]


def infer_network(card_name: str) -> str:
    lowered = card_name.lower()
    if "mastercard" in lowered:
        return "Mastercard"
    if "american express" in lowered or "amex" in lowered:
        return "American Express"
    if "visa" in lowered:
        return "Visa"
    return "Unknown"


def upsert_issuers(session: Session, rows: Iterable[dict[str, str]]) -> dict[str, Issuer]:
    issuers_by_slug: dict[str, Issuer] = {
        issuer.slug: issuer for issuer in session.scalars(select(Issuer)).all()
    }
    for row in rows:
        slug = row["slug"]
        issuer = issuers_by_slug.get(slug)
        if issuer is None:
            issuer = Issuer(name=row["name"], slug=slug)
            session.add(issuer)
            issuers_by_slug[slug] = issuer
        else:
            issuer.name = row["name"]
    session.flush()
    return issuers_by_slug


def upsert_reward_categories(session: Session, rows: Iterable[dict[str, str]]) -> dict[str, RewardCategory]:
    categories_by_slug: dict[str, RewardCategory] = {
        category.slug: category for category in session.scalars(select(RewardCategory)).all()
    }
    for row in rows:
        slug = row["slug"]
        category = categories_by_slug.get(slug)
        if category is None:
            category = RewardCategory(name=row["name"], slug=slug)
            session.add(category)
            categories_by_slug[slug] = category
        else:
            category.name = row["name"]
    session.flush()
    return categories_by_slug


def upsert_credit_cards(
    session: Session,
    rows: Iterable[dict[str, str]],
    issuers_by_slug: dict[str, Issuer],
) -> dict[str, CreditCard]:
    cards_by_slug: dict[str, CreditCard] = {
        card.slug: card for card in session.scalars(select(CreditCard)).all()
    }
    for row in rows:
        slug = row["slug"]
        issuer = issuers_by_slug[row["bank_slug"]]
        card = cards_by_slug.get(slug)
        annual_fee_cents = int(row["annual_fee_cents"] or 0)
        is_active = row["is_active"].upper() in {"TRUE", "T", "1", "YES", "Y"}

        if card is None:
            card = CreditCard(
                issuer_id=issuer.id,
                name=row["name"],
                slug=slug,
                network=infer_network(row["name"]),
                annual_fee_cents=annual_fee_cents,
                fee_type=row["fee_type"],
                image_url=row["image_url"] or None,
                is_active=is_active,
            )
            session.add(card)
            cards_by_slug[slug] = card
        else:
            card.issuer_id = issuer.id
            card.name = row["name"]
            card.network = infer_network(row["name"])
            card.annual_fee_cents = annual_fee_cents
            card.fee_type = row["fee_type"]
            card.image_url = row["image_url"] or None
            card.is_active = is_active
    session.flush()
    return cards_by_slug


def sync_card_reward_categories(
    session: Session,
    rows: Iterable[dict[str, str]],
    cards_by_slug: dict[str, CreditCard],
    categories_by_slug: dict[str, RewardCategory],
) -> None:
    session.execute(delete(CardRewardCategory))
    for row in rows:
        card_slug = row["card_slug"]
        category_slug = row["category_slug"]
        if not card_slug or not category_slug:
            continue
        if "," in category_slug:
            raise ValueError(
                f"card_categories.csv contains a comma-separated category list for '{card_slug}'. "
                "Each row must contain exactly one category_slug."
            )

        card = cards_by_slug[card_slug]
        category = categories_by_slug[category_slug]
        session.add(CardRewardCategory(card_id=card.id, reward_category_id=category.id))
    session.flush()


def sync_benefits(session: Session, rows: Iterable[dict[str, str]], cards_by_slug: dict[str, CreditCard]) -> None:
    session.execute(delete(CardBenefit))

    benefits_by_slug: dict[str, Benefit] = {benefit.slug: benefit for benefit in session.scalars(select(Benefit)).all()}

    for row in rows:
        if not row["card_slug"]:
            continue
        card = cards_by_slug[row["card_slug"]]
        benefit_type = row["benefit_type"] or "general"
        title = row["title"]
        if not title or not row["official_text"]:
            continue

        benefit_slug = slugify(f"{benefit_type}-{title}")
        benefit = benefits_by_slug.get(benefit_slug)
        if benefit is None:
            benefit = Benefit(
                name=title,
                slug=benefit_slug,
                benefit_type=benefit_type,
                description=row["simple_text"] or row["official_text"],
            )
            session.add(benefit)
            session.flush()
            benefits_by_slug[benefit_slug] = benefit
        else:
            benefit.name = title
            benefit.benefit_type = benefit_type
            benefit.description = row["simple_text"] or row["official_text"]

        session.add(
            CardBenefit(
                card_id=card.id,
                benefit_id=benefit.id,
                title=title,
                official_text=row["official_text"],
                simple_text=row["simple_text"] or None,
                sort_order=int(row["sort_order"] or 0),
            )
        )
    session.flush()


def parse_optional_date(value: str) -> date | None:
    if not value:
        return None
    return date.fromisoformat(value)


def parse_optional_int(value: str) -> int | None:
    if not value:
        return None
    return int(value)


def parse_optional_float(value: str) -> float | None:
    if not value:
        return None
    return float(value)


def sync_reward_rates(
    session: Session,
    rows: Iterable[dict[str, str]],
    cards_by_slug: dict[str, CreditCard],
    categories_by_slug: dict[str, RewardCategory],
) -> None:
    allowed_confidence_levels = {"verified", "estimated", "placeholder"}
    session.execute(delete(RewardRate))
    for row in rows:
        card_slug = row["card_slug"]
        category_slug = row["category_slug"]
        earn_rate = parse_optional_float(row["earn_rate"])

        if not card_slug or not category_slug or earn_rate is None:
            continue

        card = cards_by_slug[card_slug]
        category = categories_by_slug[category_slug]
        confidence_level = (row["confidence_level"] or "placeholder").strip().lower()
        if confidence_level not in allowed_confidence_levels:
            raise ValueError(
                f"reward_rates.csv contains unsupported confidence_level '{row['confidence_level']}' "
                f"for card '{card_slug}' and category '{category_slug}'."
            )
        session.add(
            RewardRate(
                card_id=card.id,
                reward_category_id=category.id,
                earn_rate=earn_rate,
                earn_type=row["earn_type"] or "points_per_dollar",
                reward_currency=row["reward_currency"] or None,
                monthly_cap_cents=parse_optional_int(row["monthly_cap_cents"]),
                annual_cap_cents=parse_optional_int(row["annual_cap_cents"]),
                cap_reset_frequency=row["cap_reset_frequency"] or None,
                notes=row["notes"] or None,
                source_url=row["source_url"] or None,
                last_verified_at=parse_optional_date(row["last_verified_at"]),
                confidence_level=confidence_level,
            )
        )
    session.flush()


def sync_signup_offers(session: Session, rows: Iterable[dict[str, str]], cards_by_slug: dict[str, CreditCard]) -> None:
    session.execute(delete(SignupOffer))
    for row in rows:
        card = cards_by_slug.get(row["card_slug"])
        if card is None:
            continue
        session.add(
            SignupOffer(
                card_id=card.id,
                title=row["title"],
                summary=row["summary"] or None,
                bonus_value=int(row["bonus_value"] or 0) or None,
                bonus_currency=row["bonus_currency"] or None,
                spend_requirement_cents=int(row["spend_requirement_cents"] or 0) or None,
                spend_requirement_days=int(row["spend_requirement_days"] or 0) or None,
                annual_fee_waived=row["annual_fee_waived"].upper() in {"TRUE", "T", "1", "YES", "Y"},
                start_date=parse_optional_date(row["start_date"]),
                end_date=parse_optional_date(row["end_date"]),
                is_active=row["is_active"].upper() in {"TRUE", "T", "1", "YES", "Y"},
            )
        )
    session.flush()


def seed_session(session: Session, data_dir: Path) -> None:
    issuer_rows = read_csv_rows(data_dir / "banks.csv")
    category_rows = read_csv_rows(data_dir / "categories.csv")
    card_rows = read_csv_rows(data_dir / "credit_cards.csv")
    card_category_rows = read_csv_rows(data_dir / "card_categories.csv")
    reward_rate_rows = read_csv_rows(data_dir / "reward_rates.csv")
    benefit_rows = read_csv_rows(data_dir / "benefits.csv")
    signup_offer_rows = read_csv_rows(data_dir / "signup_offers.csv")

    issuers_by_slug = upsert_issuers(session, issuer_rows)
    categories_by_slug = upsert_reward_categories(session, category_rows)
    cards_by_slug = upsert_credit_cards(session, card_rows, issuers_by_slug)
    sync_card_reward_categories(session, card_category_rows, cards_by_slug, categories_by_slug)
    sync_reward_rates(session, reward_rate_rows, cards_by_slug, categories_by_slug)
    sync_benefits(session, benefit_rows, cards_by_slug)
    sync_signup_offers(session, signup_offer_rows, cards_by_slug)


def seed_database() -> None:
    settings = get_settings()
    data_dir = settings.data_dir

    with session_scope() as session:
        seed_session(session, data_dir)


if __name__ == "__main__":
    seed_database()
