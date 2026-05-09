from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.issuer import IssuerRead
from app.services.issuer_service import list_issuers

router = APIRouter()


@router.get("", response_model=list[IssuerRead])
def get_issuers(db: Session = Depends(get_db)) -> list[IssuerRead]:
    return list_issuers(db)
