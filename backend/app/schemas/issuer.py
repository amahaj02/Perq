from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class IssuerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    website_url: str | None = None
    country_code: str
