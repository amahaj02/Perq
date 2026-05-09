from __future__ import annotations

from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import get_settings
from app.db.session import get_engine

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, object]:
    settings = get_settings()

    if not settings.database_url:
        return {
            "status": "ok",
            "database": "not_configured",
            "environment": settings.app_env,
        }

    try:
        with get_engine().connect() as connection:
            connection.execute(text("select 1"))
        database_status = "ok"
    except Exception as exc:  # pragma: no cover - defensive endpoint fallback
        return {
            "status": "degraded",
            "database": "unreachable",
            "environment": settings.app_env,
            "detail": str(exc),
        }

    return {
        "status": "ok",
        "database": database_status,
        "environment": settings.app_env,
    }
