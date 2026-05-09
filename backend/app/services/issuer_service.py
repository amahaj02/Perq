from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Issuer
from app.schemas.issuer import IssuerRead


def list_issuers(session: Session) -> list[IssuerRead]:
    issuers = session.scalars(select(Issuer).order_by(Issuer.name.asc())).all()
    return [IssuerRead.model_validate(issuer) for issuer in issuers]
