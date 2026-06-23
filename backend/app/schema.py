from typing import Optional
from pydantic import BaseModel, field_validator
from .models import Severity, Category


# ---------- Request schemas ----------

class IncidentCreate(BaseModel):
    title: str
    description: str
    severity: Severity = Severity.MEDIUM
    category: Optional[Category] = None
    reporter_name: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be blank.")
        return v.strip()

    @field_validator("description")
    @classmethod
    def description_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Description cannot be blank.")
        return v.strip()