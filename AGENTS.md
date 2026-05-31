# AGENTS.md

Repository guidance for AI coding agents working on Perq.

## Project overview

Perq is a Canada-first credit card discovery and management platform. The current product is a deployed full-stack web app with:

- `frontend/`: Next.js, React, TypeScript, Tailwind CSS, Radix UI components, and Vitest.
- `backend/`: FastAPI, SQLAlchemy, Pydantic, Alembic, uv, and Supabase Postgres.
- `backend/data/`: CSV seed data for issuers, credit cards, categories, benefits, signup offers, and reward rates.

The project should stay simple, maintainable, and product-focused. Do not introduce unnecessary infrastructure, auth, AI features, queues, microservices, or complex state management unless explicitly requested.

## Non-negotiable product principles

- Perq should feel like a trustworthy credit card research tool, not a generic AI-generated startup site.
- Do not silently show mock card data in production.
- Backend data should be treated as the source of truth for card catalog surfaces.
- Credit card data must be source-aware where possible. Prefer verified data with `source_url`, `last_verified_at`, and `confidence_level` fields when working with reward rates or offers.
- Avoid misleading certainty. If a rate, offer, or benefit is estimated, placeholder, or unverified, preserve that state clearly.
- Keep user-facing copy restrained, specific, and analyst-like. Avoid hype, exaggerated claims, and salesy copy.

## Architecture rules

### Frontend

- Keep the frontend in `frontend/`.
- Use the existing Next.js App Router structure.
- Prefer server-side data fetching for catalog data unless a client interaction truly requires client-side fetching.
- Use `PERQ_API_BASE_URL` for server-side backend API calls. Public `NEXT_PUBLIC_*` variables should only be used when the browser genuinely needs them.
- Do not hardcode production backend URLs in components.
- Do not let production fall back to static mock catalog data. Mock catalog fallback is only acceptable for local development behind an explicit local-only flag.
- Preserve the current component structure when possible. Make focused changes instead of rewriting the frontend.
- Keep UI state local unless shared state is clearly needed. Do not add Redux, Zustand, React Query, or SWR without a clear reason.
- Use accessible UI primitives and maintain keyboard/focus behavior when changing interactions.

### Backend

- Keep the backend as one FastAPI application. Do not split into microservices.
- Use SQLAlchemy ORM models, Pydantic schemas, service functions, and Alembic migrations consistently.
- Use Supabase through its Postgres connection string. Do not add the Supabase SDK unless there is a specific need.
- Do not expose database credentials or service-role keys to the frontend.
- Migrations are append-only once they may have been applied. Never edit an already-merged/applied Alembic migration to change live schema behavior. Create a new migration instead.
- Keep seed behavior predictable and idempotent where the existing seed workflow supports it.
- Be careful with blanket deletes in seed scripts. They are acceptable for catalog seed data now, but do not apply that pattern to future user-owned data.

### Data model

- Prefer normalized relationships over comma-separated lists.
- Preserve slug-based references in CSV seed files unless a migration explicitly changes the relationship model.
- Reward rates are central to Perq. Treat `reward_rates` as structured data, not display text.
- Keep fields such as caps, reward currency, earn type, source URL, verification date, and confidence level intact.
- Signup offers change frequently. Do not bake active offers into permanent card attributes.
- Do not scrape or mass-import new bank data unless explicitly asked. Manual, verified data is preferred for the current MVP.

## Commands to run

Run commands from the relevant subdirectory.

### Frontend

```bash
cd frontend
npm run lint
npm run test
npm run build
```

Use `npm run test` when frontend transforms, data mapping, UI logic, or API client behavior changes. If a local Windows shell cannot run Vitest because of an environment-specific spawn error, state that clearly in the PR summary.

### Backend

```bash
cd backend
uv sync --group dev
uv run alembic upgrade head
uv run python -m pytest tests
```

When changing models, schemas, migrations, seed loading, or API behavior, run the backend test suite.

## Pull request expectations

Every PR should include:

- A concise summary of what changed.
- Validation commands that were actually run.
- Any commands that could not be run and why.
- Any migration, deployment, seed-data, or environment-variable implications.
- Screenshots or preview links for meaningful UI changes.

Keep PRs narrow. Avoid bundling unrelated backend schema changes, frontend redesigns, deployment changes, and data fixes in the same PR.

## Code style and implementation preferences

- Prefer small, explicit functions over clever abstractions.
- Keep types close to the API or component boundary they describe.
- Avoid broad rewrites unless the user explicitly asks for one.
- Use clear names that reflect product concepts: issuer, card, reward rate, signup offer, benefit, confidence level, source URL.
- Do not add dependencies unless they are clearly justified by the task.
- Do not introduce formatting-only churn across unrelated files.
- Do not remove tests or weaken validation to make a change pass.

## UI and design guidance

- Avoid the generic all-black, glassy, gradient-heavy vibe-coded SaaS look.
- Prefer a distinctive editorial-finance direction: clear hierarchy, strong information density, restrained accents, trustworthy provenance indicators, and readable surfaces.
- Use dark mode carefully. Dense financial data needs contrast and calm surfaces, not pure black everywhere.
- Motion should explain state changes. Do not add decorative animation that harms clarity.
- Verification metadata should become visible in UI where relevant: source, freshness, and confidence.
- For card surfaces, prioritize fee profile, reward rates, benefit stack, issuer, network, and verification state over decorative card mockups.

## Security and secrets

- Never commit `.env` files, API keys, database passwords, Supabase service-role keys, Render tokens, Vercel tokens, or other secrets.
- Use environment variables for secrets and deployment-specific URLs.
- Do not paste secrets into code comments, tests, fixtures, docs, or screenshots.
- Frontend code must never receive database credentials.
- Treat public repo history as permanent.

## Agent workflow

Before making changes:

1. Inspect the relevant files and current data flow.
2. Identify whether the task is frontend, backend, data, deployment, or documentation.
3. Make the smallest coherent change that solves the problem.
4. Preserve existing conventions unless there is a strong reason to change them.
5. Add or update tests when behavior changes.
6. Summarize tradeoffs and follow-up work in the PR.

When uncertain, ask for clarification instead of inventing product behavior, data values, or architecture.