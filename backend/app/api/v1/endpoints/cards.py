from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.card import CreditCardDetailRead, CreditCardListRead
from app.services.card_service import get_card_by_slug, list_cards

router = APIRouter()


@router.get("", response_model=CreditCardListRead)
def list_credit_cards(
    db: Session = Depends(get_db),
    q: str | None = Query(default=None, description="Search card name, slug, or issuer"),
    issuer_slug: str | None = Query(default=None),
    category_slug: str | None = Query(default=None),
    fee_type: str | None = Query(default=None, pattern="^(FEE|NO_FEE)$"),
    is_active: bool = Query(default=True),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> CreditCardListRead:
    return list_cards(
        session=db,
        q=q,
        issuer_slug=issuer_slug,
        category_slug=category_slug,
        fee_type=fee_type,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )


@router.get("/{slug}", response_model=CreditCardDetailRead)
def get_credit_card(slug: str, db: Session = Depends(get_db)) -> CreditCardDetailRead:
    card = get_card_by_slug(db, slug)
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card '{slug}' was not found.",
        )
    return card
