from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class RewardCategory(TimestampMixin, Base):
    __tablename__ = "reward_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    cards = relationship("CardRewardCategory", back_populates="reward_category", cascade="all, delete-orphan")
    reward_rates = relationship("RewardRate", back_populates="reward_category", cascade="all, delete-orphan")
