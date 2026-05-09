# Perq Backend

Perq uses a single FastAPI application backed by Supabase Postgres.

The backend is intentionally simple:

- one monolithic API
- SQLAlchemy ORM models
- Pydantic schemas
- Alembic migrations
- CSV seed workflow for the current card dataset

## Structure

```text
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
├── alembic/
├── data/
├── tests/
├── alembic.ini
├── requirements.txt
└── README.md
```

## Local Setup

From the `backend/` directory:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Set `DATABASE_URL` in `.env` to your Supabase Postgres connection string.

## Run Migrations

```bash
alembic upgrade head
```

To create a new migration later:

```bash
alembic revision --autogenerate -m "describe change"
```

## Seed Data

The current seed files live in `data/`.

```bash
python -m app.db.seed
```

This loads:

- issuers
- reward categories
- credit cards
- card/category relationships
- benefit catalog + card benefits
- signup offers

## Run the API

```bash
uvicorn app.main:app --reload
```

## Important Endpoints

- `GET /api/v1/health`
- `GET /api/v1/cards`
- `GET /api/v1/cards/{slug}`
- `GET /api/v1/issuers`
- `GET /api/v1/benefits`

## Notes on Supabase

The API talks to Supabase through its Postgres connection string. That keeps the backend simple and lets FastAPI, SQLAlchemy, and Alembic work normally.

The Supabase SDK is not required yet because:

- auth is out of scope for now
- the initial API only needs normal database access
- direct Postgres access is the cleanest path for migrations and local development
