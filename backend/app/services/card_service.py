from __future__ import annotations

from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models import CardBenefit, CardRewardCategory, CreditCard, Issuer, RewardCategory
from app.schemas.benefit import CardBenefitRead
from app.schemas.card import CreditCardDetailRead, CreditCardListItemRead, CreditCardListRead
from app.schemas.issuer import IssuerRead
from app.schemas.reward_category import RewardCategoryRead
from app.schemas.signup_offer import SignupOfferRead


def _card_base_query() -> Select[tuple[CreditCard]]:
    return select(CreditCard).options(
        joinedload(CreditCard.issuer),
        selectinload(CreditCard.reward_categories).joinedload(CardRewardCategory.reward_category),
        selectinload(CreditCard.benefits).joinedload(CardBenefit.benefit),
        selectinload(CreditCard.signup_offers),
    )


def _apply_card_filters(
    statement: Select[tuple[CreditCard]],
    *,
    q: str | None,
    issuer_slug: str | None,
    category_slug: str | None,
    fee_type: str | None,
    is_active: bool | None,
) -> Select[tuple[CreditCard]]:
    if q:
        pattern = f"%{q.strip()}%"
        statement = statement.where(
            or_(
                CreditCard.name.ilike(pattern),
                CreditCard.slug.ilike(pattern),
                CreditCard.network.ilike(pattern),
                CreditCard.issuer.has(
                    or_(
                        Issuer.name.ilike(pattern),
                        Issuer.slug.ilike(pattern),
                    )
                ),
            )
        )

    if issuer_slug:
        statement = statement.where(CreditCard.issuer.has(Issuer.slug == issuer_slug))

    if category_slug:
        statement = (
            statement.join(CardRewardCategory, CardRewardCategory.card_id == CreditCard.id)
            .join(RewardCategory, RewardCategory.id == CardRewardCategory.reward_category_id)
            .where(RewardCategory.slug == category_slug)
        )

    if fee_type:
        statement = statement.where(CreditCard.fee_type == fee_type)

    if is_active is not None:
        statement = statement.where(CreditCard.is_active.is_(is_active))

    return statement.distinct()


def _build_card_item(card: CreditCard) -> CreditCardListItemRead:
    reward_categories = [
        RewardCategoryRead.model_validate(link.reward_category)
        for link in sorted(card.reward_categories, key=lambda item: item.reward_category.name.lower())
    ]

    active_offer = next((offer for offer in card.signup_offers if offer.is_active), None)

    return CreditCardListItemRead(
        id=card.id,
        name=card.name,
        slug=card.slug,
        network=card.network,
        annual_fee_cents=card.annual_fee_cents,
        fee_type=card.fee_type,
        image_url=card.image_url,
        is_active=card.is_active,
        issuer=IssuerRead.model_validate(card.issuer),
        reward_categories=reward_categories,
        active_signup_offer=SignupOfferRead.model_validate(active_offer) if active_offer else None,
    )


def list_cards(
    session: Session,
    *,
    q: str | None,
    issuer_slug: str | None,
    category_slug: str | None,
    fee_type: str | None,
    is_active: bool | None,
    limit: int,
    offset: int,
) -> CreditCardListRead:
    statement = _apply_card_filters(
        _card_base_query(),
        q=q,
        issuer_slug=issuer_slug,
        category_slug=category_slug,
        fee_type=fee_type,
        is_active=is_active,
    ).order_by(CreditCard.name.asc())

    total_statement = _apply_card_filters(
        select(func.count(func.distinct(CreditCard.id))),
        q=q,
        issuer_slug=issuer_slug,
        category_slug=category_slug,
        fee_type=fee_type,
        is_active=is_active,
    )

    total = session.scalar(total_statement) or 0
    cards = session.scalars(statement.offset(offset).limit(limit)).unique().all()
    return CreditCardListRead(total=total, items=[_build_card_item(card) for card in cards])


def get_card_by_slug(session: Session, slug: str) -> CreditCardDetailRead | None:
    card = session.scalar(_card_base_query().where(CreditCard.slug == slug))
    if card is None:
        return None

    base_item = _build_card_item(card)
    benefits = [
        CardBenefitRead.model_validate(benefit)
        for benefit in sorted(card.benefits, key=lambda item: (item.sort_order, item.title.lower()))
    ]
    signup_offers = [
        SignupOfferRead.model_validate(offer)
        for offer in sorted(card.signup_offers, key=lambda item: (not item.is_active, item.title.lower()))
    ]

    return CreditCardDetailRead(
        **base_item.model_dump(),
        foreign_transaction_fee_bps=card.foreign_transaction_fee_bps,
        apply_url=card.apply_url,
        rewards_currency=card.rewards_currency,
        benefits=benefits,
        signup_offers=signup_offers,
    )
