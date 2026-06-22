from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel

class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Status(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Category(str, Enum):
    DATABASE = "database"
    NETWORK = "network"
    AUTHENTICATION = "authentication"
    THIRD_PARTY_API = "third_party_api"
    INFRASTRUCTURE = "infrastructure"
    OTHER = "other"


class Incident(SQLModel, table=True):
    """SQLModel table — acts as both the ORM model and base Pydantic schema."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200, index=True)
    description: str

    severity: Severity = Field(default=Severity.MEDIUM)
    status: Status = Field(default=Status.OPEN)
    category: Optional[Category] = Field(default=None, nullable=True)
    reporter_name: Optional[str] = Field(default=None, max_length=120)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))