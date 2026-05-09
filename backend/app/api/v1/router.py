from fastapi import APIRouter

from app.api.v1.endpoints import benefits, cards, health, issuers

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(cards.router, prefix="/cards", tags=["cards"])
router.include_router(issuers.router, prefix="/issuers", tags=["issuers"])
router.include_router(benefits.router, prefix="/benefits", tags=["benefits"])
