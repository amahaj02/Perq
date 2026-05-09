from __future__ import annotations

from datetime import date

from pydantic import BaseModel, ConfigDict


class SignupOfferRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    summary: str | None = None
    bonus_value: int | None = None
    bonus_currency: str | None = None
    spend_requirement_cents: int | None = None
    spend_requirement_days: int | None = None
    annual_fee_waived: bool
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool
