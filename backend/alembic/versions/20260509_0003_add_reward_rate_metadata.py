"""add reward rate metadata

Revision ID: 20260509_0003
Revises: 20260509_0002
Create Date: 2026-05-09 20:45:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260509_0003"
down_revision = "20260509_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("reward_rates", sa.Column("source_url", sa.String(length=1000), nullable=True))
    op.add_column("reward_rates", sa.Column("last_verified_at", sa.Date(), nullable=True))
    op.add_column(
        "reward_rates",
        sa.Column("confidence_level", sa.String(length=20), nullable=False, server_default="placeholder"),
    )
    op.create_check_constraint(
        "ck_reward_rates_confidence_level",
        "reward_rates",
        "confidence_level in ('verified', 'estimated', 'placeholder')",
    )


def downgrade() -> None:
    op.drop_constraint("ck_reward_rates_confidence_level", "reward_rates", type_="check")
    op.drop_column("reward_rates", "confidence_level")
    op.drop_column("reward_rates", "last_verified_at")
    op.drop_column("reward_rates", "source_url")
