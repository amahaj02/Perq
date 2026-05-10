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
├── pyproject.toml
├── uv.lock
└── README.md
```

## Local Setup

From the `backend/` directory:

```bash
uv sync --group dev
copy .env.example .env
```

Set `DATABASE_URL` in `.env` to your Supabase Postgres connection string.

## Run Migrations

```bash
uv run alembic upgrade head
```

To create a new migration later:

```bash
uv run alembic revision --autogenerate -m "describe change"
```

## Seed Data

The current seed files live in `data/`.

```bash
uv run python -m app.db.seed
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
uv run python -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```

If Windows reload permissions get in the way in your terminal, run without reload:

```bash
uv run python -m uvicorn app.main:app --host 127.0.0.1 --port 8080
```

## Production Startup

To avoid schema drift between deployed code and Supabase, run Alembic before starting the app:

```bash
uv run python start.py
```

That startup path upgrades the database to `head` and then launches Uvicorn.

For Render, the start command should be:

```bash
cd backend && .venv/bin/python start.py
```

## Tests

```bash
uv run python -m pytest tests
```

## Deploy Notes

The backend now uses `uv` as the single dependency manager. That gives you:

- one source of truth in `pyproject.toml`
- a lockfile for reproducible installs
- faster cold installs in CI and deploy environments with `uv sync`

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
