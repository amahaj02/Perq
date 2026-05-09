from __future__ import annotations

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class RewardRate(TimestampMixin, Base):
    __tablename__ = "reward_rates"
    __table_args__ = (
        CheckConstraint("earn_rate >= 0", name="ck_reward_rates_earn_rate_non_negative"),
        CheckConstraint("monthly_cap_cents >= 0", name="ck_reward_rates_monthly_cap_non_negative"),
        CheckConstraint("annual_cap_cents >= 0", name="ck_reward_rates_annual_cap_non_negative"),
        UniqueConstraint("card_id", "reward_category_id", name="uq_reward_rates_card_category"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(ForeignKey("credit_cards.id", ondelete="CASCADE"), index=True)
    reward_category_id: Mapped[int] = mapped_column(ForeignKey("reward_categories.id", ondelete="CASCADE"), index=True)
    earn_rate: Mapped[float] = mapped_column(nullable=False)
    earn_type: Mapped[str] = mapped_column(String(50), nullable=False)
    reward_currency: Mapped[str | None] = mapped_column(String(80), nullable=True)
    monthly_cap_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    annual_cap_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cap_reset_frequency: Mapped[str | None] = mapped_column(String(50), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    card = relationship("CreditCard", back_populates="reward_rates")
    reward_category = relationship("RewardCategory", back_populates="reward_rates")
