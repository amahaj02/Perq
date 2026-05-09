"""add reward rates

Revision ID: 20260509_0002
Revises: 20260509_0001
Create Date: 2026-05-09 20:05:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260509_0002"
down_revision = "20260509_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "reward_rates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("card_id", sa.Integer(), nullable=False),
        sa.Column("reward_category_id", sa.Integer(), nullable=False),
        sa.Column("earn_rate", sa.Float(), nullable=False),
        sa.Column("earn_type", sa.String(length=50), nullable=False),
        sa.Column("reward_currency", sa.String(length=80), nullable=True),
        sa.Column("monthly_cap_cents", sa.Integer(), nullable=True),
        sa.Column("annual_cap_cents", sa.Integer(), nullable=True),
        sa.Column("cap_reset_frequency", sa.String(length=50), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("source_url", sa.String(length=1000), nullable=True),
        sa.Column("last_verified_at", sa.Date(), nullable=True),
        sa.Column("confidence_level", sa.String(length=20), nullable=False, server_default="placeholder"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("annual_cap_cents >= 0", name="ck_reward_rates_annual_cap_non_negative"),
        sa.CheckConstraint(
            "confidence_level in ('verified', 'estimated', 'placeholder')",
            name="ck_reward_rates_confidence_level",
        ),
        sa.CheckConstraint("earn_rate >= 0", name="ck_reward_rates_earn_rate_non_negative"),
        sa.CheckConstraint("monthly_cap_cents >= 0", name="ck_reward_rates_monthly_cap_non_negative"),
        sa.ForeignKeyConstraint(["card_id"], ["credit_cards.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reward_category_id"], ["reward_categories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("card_id", "reward_category_id", name="uq_reward_rates_card_category"),
    )
    op.create_index("ix_reward_rates_card_id", "reward_rates", ["card_id"], unique=False)
    op.create_index("ix_reward_rates_reward_category_id", "reward_rates", ["reward_category_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_reward_rates_reward_category_id", table_name="reward_rates")
    op.drop_index("ix_reward_rates_card_id", table_name="reward_rates")
    op.drop_table("reward_rates")
