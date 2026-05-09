from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.api.deps import get_db
from app.db.seed import read_csv_rows, seed_session
from app.main import app
from app.models import Base, CardRewardCategory, CreditCard, RewardRate


def build_seeded_session() -> Session:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session = Session(engine)
    data_dir = Path(__file__).resolve().parents[1] / "data"
    seed_session(session, data_dir)
    session.commit()
    return session


def test_reward_rates_and_card_categories_seed_cleanly() -> None:
    session = build_seeded_session()
    try:
        card_category_rows = read_csv_rows(Path(__file__).resolve().parents[1] / "data" / "card_categories.csv")
        assert all("," not in row["category_slug"] for row in card_category_rows)

        category_links = session.scalars(select(CardRewardCategory)).all()
        reward_rates = session.scalars(select(RewardRate)).all()

        assert len(category_links) == len(card_category_rows)
        assert len(reward_rates) > 0
    finally:
        session.close()


def test_card_detail_includes_reward_rates() -> None:
    session = build_seeded_session()

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    try:
        sample_card = session.scalar(select(CreditCard).where(CreditCard.slug == "rbc-ion-plus-visa"))
        assert sample_card is not None

        client = TestClient(app)
        response = client.get(f"/api/v1/cards/{sample_card.slug}")

        assert response.status_code == 200
        payload = response.json()

        assert payload["slug"] == sample_card.slug
        assert len(payload["reward_categories"]) == 4
        assert len(payload["reward_rates"]) == 4
        assert payload["reward_rates"][0]["reward_category"]["slug"] in {"dining", "gas", "groceries", "streaming"}
        assert payload["reward_rates"][0]["earn_rate"] == 3.0
    finally:
        app.dependency_overrides.clear()
        session.close()
