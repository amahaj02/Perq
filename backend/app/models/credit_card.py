from __future__ import annotations

from sqlalchemy import Boolean, CheckConstraint, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class CreditCard(TimestampMixin, Base):
    __tablename__ = "credit_cards"
    __table_args__ = (
        CheckConstraint("annual_fee_cents >= 0", name="ck_credit_cards_annual_fee_non_negative"),
        CheckConstraint("fee_type in ('FEE', 'NO_FEE')", name="ck_credit_cards_fee_type"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    issuer_id: Mapped[int] = mapped_column(ForeignKey("issuers.id", ondelete="RESTRICT"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    network: Mapped[str] = mapped_column(String(50), default="Unknown", nullable=False)
    annual_fee_cents: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    fee_type: Mapped[str] = mapped_column(String(20), nullable=False)
    foreign_transaction_fee_bps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    apply_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    rewards_currency: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    issuer = relationship("Issuer", back_populates="cards")
    reward_categories = relationship("CardRewardCategory", back_populates="card", cascade="all, delete-orphan")
    benefits = relationship("CardBenefit", back_populates="card", cascade="all, delete-orphan")
    signup_offers = relationship("SignupOffer", back_populates="card", cascade="all, delete-orphan")


class CardRewardCategory(Base):
    __tablename__ = "card_reward_categories"
    __table_args__ = (
        UniqueConstraint("card_id", "reward_category_id", name="uq_card_reward_categories"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(ForeignKey("credit_cards.id", ondelete="CASCADE"), index=True)
    reward_category_id: Mapped[int] = mapped_column(ForeignKey("reward_categories.id", ondelete="CASCADE"), index=True)

    card = relationship("CreditCard", back_populates="reward_categories")
    reward_category = relationship("RewardCategory", back_populates="cards")
