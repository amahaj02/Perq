from __future__ import annotations

import os

import uvicorn
from alembic import command
from alembic.config import Config


def run_migrations() -> None:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))
    command.upgrade(alembic_cfg, "head")


def main() -> None:
    run_migrations()
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
