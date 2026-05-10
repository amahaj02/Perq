from __future__ import annotations

from datetime import date

from pydantic import BaseModel, ConfigDict

from app.schemas.reward_category import RewardCategoryRead


class RewardRateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    earn_rate: float
    earn_type: str
    reward_currency: str | None = None
    monthly_cap_cents: int | None = None
    annual_cap_cents: int | None = None
    cap_reset_frequency: str | None = None
    notes: str | None = None
    source_url: str | None = None
    last_verified_at: date | None = None
    confidence_level: str
    reward_category: RewardCategoryRead
