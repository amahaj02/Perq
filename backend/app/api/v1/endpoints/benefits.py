from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.benefit import BenefitRead
from app.services.benefit_service import list_benefits

router = APIRouter()


@router.get("", response_model=list[BenefitRead])
def get_benefits(
    db: Session = Depends(get_db),
    benefit_type: str | None = Query(default=None),
    card_slug: str | None = Query(default=None),
) -> list[BenefitRead]:
    return list_benefits(db, benefit_type=benefit_type, card_slug=card_slug)
