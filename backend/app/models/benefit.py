from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Benefit(TimestampMixin, Base):
    __tablename__ = "benefits"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    benefit_type: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    cards = relationship("CardBenefit", back_populates="benefit", cascade="all, delete-orphan")


class CardBenefit(TimestampMixin, Base):
    __tablename__ = "card_benefits"
    __table_args__ = (
        UniqueConstraint("card_id", "benefit_id", "title", name="uq_card_benefits"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(ForeignKey("credit_cards.id", ondelete="CASCADE"), index=True)
    benefit_id: Mapped[int] = mapped_column(ForeignKey("benefits.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    official_text: Mapped[str] = mapped_column(Text, nullable=False)
    simple_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(default=0, nullable=False)
    is_highlight: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    card = relationship("CreditCard", back_populates="benefits")
    benefit = relationship("Benefit", back_populates="cards")
