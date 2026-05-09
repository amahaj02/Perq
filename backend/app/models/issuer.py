from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Issuer(TimestampMixin, Base):
    __tablename__ = "issuers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    country_code: Mapped[str] = mapped_column(String(2), default="CA", nullable=False)

    cards = relationship("CreditCard", back_populates="issuer")
