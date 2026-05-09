from __future__ import annotations

from collections.abc import Generator
from contextlib import contextmanager
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings


def _database_url() -> str:
    database_url = get_settings().database_url
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured. Set it in backend/.env before using the database.")
    return database_url


def _database_connect_args() -> dict[str, object]:
    url = make_url(_database_url())
    host = url.host or ""

    # Supabase pooled connections should not use prepared statements. This
    # matters on IPv4-only hosts such as Render when connecting through the
    # Supavisor or PgBouncer endpoints.
    if host.endswith(".pooler.supabase.com") or (host.endswith(".supabase.co") and url.port == 6543):
        return {"prepare_threshold": None}

    return {}


@lru_cache
def get_engine():
    return create_engine(_database_url(), pool_pre_ping=True, connect_args=_database_connect_args())


@lru_cache
def get_session_factory() -> sessionmaker[Session]:
    return sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, expire_on_commit=False)


def db_session() -> Generator[Session, None, None]:
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    session = get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
