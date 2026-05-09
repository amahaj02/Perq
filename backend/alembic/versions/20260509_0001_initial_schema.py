"""initial schema

Revision ID: 20260509_0001
Revises: None
Create Date: 2026-05-09 00:00:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260509_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "issuers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("website_url", sa.String(length=500), nullable=True),
        sa.Column("country_code", sa.String(length=2), nullable=False, server_default="CA"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_issuers_slug", "issuers", ["slug"], unique=False)

    op.create_table(
        "reward_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_reward_categories_slug", "reward_categories", ["slug"], unique=False)

    op.create_table(
        "benefits",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("benefit_type", sa.String(length=80), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_benefits_slug", "benefits", ["slug"], unique=False)
    op.create_index("ix_benefits_benefit_type", "benefits", ["benefit_type"], unique=False)

    op.create_table(
        "credit_cards",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("issuer_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("network", sa.String(length=50), nullable=False, server_default="Unknown"),
        sa.Column("annual_fee_cents", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("fee_type", sa.String(length=20), nullable=False),
        sa.Column("foreign_transaction_fee_bps", sa.Integer(), nullable=True),
        sa.Column("image_url", sa.String(length=1000), nullable=True),
        sa.Column("apply_url", sa.String(length=1000), nullable=True),
        sa.Column("rewards_currency", sa.String(length=80), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("annual_fee_cents >= 0", name="ck_credit_cards_annual_fee_non_negative"),
        sa.CheckConstraint("fee_type in ('FEE', 'NO_FEE')", name="ck_credit_cards_fee_type"),
        sa.ForeignKeyConstraint(["issuer_id"], ["issuers.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_credit_cards_slug", "credit_cards", ["slug"], unique=False)
    op.create_index("ix_credit_cards_issuer_id", "credit_cards", ["issuer_id"], unique=False)
    op.create_index("ix_credit_cards_is_active", "credit_cards", ["is_active"], unique=False)

    op.create_table(
        "card_reward_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("card_id", sa.Integer(), nullable=False),
        sa.Column("reward_category_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["card_id"], ["credit_cards.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reward_category_id"], ["reward_categories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("card_id", "reward_category_id", name="uq_card_reward_categories"),
    )
    op.create_index("ix_card_reward_categories_card_id", "card_reward_categories", ["card_id"], unique=False)
    op.create_index(
        "ix_card_reward_categories_reward_category_id",
        "card_reward_categories",
        ["reward_category_id"],
        unique=False,
    )

    op.create_table(
        "card_benefits",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("card_id", sa.Integer(), nullable=False),
        sa.Column("benefit_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("official_text", sa.Text(), nullable=False),
        sa.Column("simple_text", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_highlight", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["benefit_id"], ["benefits.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["card_id"], ["credit_cards.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("card_id", "benefit_id", "title", name="uq_card_benefits"),
    )
    op.create_index("ix_card_benefits_card_id", "card_benefits", ["card_id"], unique=False)
    op.create_index("ix_card_benefits_benefit_id", "card_benefits", ["benefit_id"], unique=False)

    op.create_table(
        "signup_offers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("card_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("bonus_value", sa.Integer(), nullable=True),
        sa.Column("bonus_currency", sa.String(length=50), nullable=True),
        sa.Column("spend_requirement_cents", sa.Integer(), nullable=True),
        sa.Column("spend_requirement_days", sa.Integer(), nullable=True),
        sa.Column("annual_fee_waived", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["card_id"], ["credit_cards.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("card_id", "title", name="uq_signup_offers_card_title"),
    )
    op.create_index("ix_signup_offers_card_id", "signup_offers", ["card_id"], unique=False)
    op.create_index("ix_signup_offers_is_active", "signup_offers", ["is_active"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_signup_offers_is_active", table_name="signup_offers")
    op.drop_index("ix_signup_offers_card_id", table_name="signup_offers")
    op.drop_table("signup_offers")
    op.drop_index("ix_card_benefits_benefit_id", table_name="card_benefits")
    op.drop_index("ix_card_benefits_card_id", table_name="card_benefits")
    op.drop_table("card_benefits")
    op.drop_index("ix_card_reward_categories_reward_category_id", table_name="card_reward_categories")
    op.drop_index("ix_card_reward_categories_card_id", table_name="card_reward_categories")
    op.drop_table("card_reward_categories")
    op.drop_index("ix_credit_cards_is_active", table_name="credit_cards")
    op.drop_index("ix_credit_cards_issuer_id", table_name="credit_cards")
    op.drop_index("ix_credit_cards_slug", table_name="credit_cards")
    op.drop_table("credit_cards")
    op.drop_index("ix_benefits_benefit_type", table_name="benefits")
    op.drop_index("ix_benefits_slug", table_name="benefits")
    op.drop_table("benefits")
    op.drop_index("ix_reward_categories_slug", table_name="reward_categories")
    op.drop_table("reward_categories")
    op.drop_index("ix_issuers_slug", table_name="issuers")
    op.drop_table("issuers")
