from __future__ import annotations

from pydantic import BaseModel

from app.schemas.benefit import CardBenefitRead
from app.schemas.issuer import IssuerRead
from app.schemas.reward_category import RewardCategoryRead
from app.schemas.signup_offer import SignupOfferRead


class CreditCardListItemRead(BaseModel):
    id: int
    name: str
    slug: str
    network: str
    annual_fee_cents: int
    fee_type: str
    image_url: str | None = None
    is_active: bool
    issuer: IssuerRead
    reward_categories: list[RewardCategoryRead]
    active_signup_offer: SignupOfferRead | None = None


class CreditCardListRead(BaseModel):
    total: int
    items: list[CreditCardListItemRead]


class CreditCardDetailRead(CreditCardListItemRead):
    foreign_transaction_fee_bps: int | None = None
    apply_url: str | None = None
    rewards_currency: str | None = None
    benefits: list[CardBenefitRead]
    signup_offers: list[SignupOfferRead]
