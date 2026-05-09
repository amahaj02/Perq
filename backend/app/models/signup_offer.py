from __future__ import annotations

from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class SignupOffer(TimestampMixin, Base):
    __tablename__ = "signup_offers"
    __table_args__ = (
        UniqueConstraint("card_id", "title", name="uq_signup_offers_card_title"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(ForeignKey("credit_cards.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    bonus_value: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bonus_currency: Mapped[str | None] = mapped_column(String(50), nullable=True)
    spend_requirement_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    spend_requirement_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    annual_fee_waived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    card = relationship("CreditCard", back_populates="signup_offers")
