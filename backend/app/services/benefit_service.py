from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Benefit, CardBenefit, CreditCard
from app.schemas.benefit import BenefitRead


def list_benefits(
    session: Session,
    benefit_type: str | None = None,
    card_slug: str | None = None,
) -> list[BenefitRead]:
    statement = select(Benefit).order_by(Benefit.benefit_type.asc(), Benefit.name.asc())

    if benefit_type:
        statement = statement.where(Benefit.benefit_type == benefit_type)

    if card_slug:
        statement = (
            statement.join(CardBenefit, CardBenefit.benefit_id == Benefit.id)
            .join(CreditCard, CreditCard.id == CardBenefit.card_id)
            .where(CreditCard.slug == card_slug)
            .distinct()
        )

    benefits = session.scalars(statement).all()
    return [BenefitRead.model_validate(benefit) for benefit in benefits]
