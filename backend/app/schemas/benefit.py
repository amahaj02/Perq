from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class BenefitRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    benefit_type: str
    description: str | None = None


class CardBenefitRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    official_text: str
    simple_text: str | None = None
    sort_order: int
    is_highlight: bool
    benefit: BenefitRead
