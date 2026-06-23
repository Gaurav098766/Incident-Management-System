from typing import Optional
from pydantic import BaseModel, field_validator
from .models import Severity, Category
from .models import Severity, Status, Category
from datetime import datetime


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



# ---------- Response schemas ----------

class IncidentListItem(BaseModel):
    id: int
    title: str
    severity: Severity
    status: Status
    category: Optional[Category]
    reporter_name: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IncidentDetail(BaseModel):
    id: int
    title: str
    description: str
    severity: Severity
    status: Status
    category: Optional[Category]
    reporter_name: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}