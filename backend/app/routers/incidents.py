
from fastapi import APIRouter, Depends, Body, HTTPException
from sqlmodel import Session
from ..database import get_session
from typing import Optional
from ..models import Incident, Severity, Category

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/",status_code=201)
def create_incident(
    title: str = Body(...),
    description: str = Body(...),
    severity: Severity = Body(Severity.MEDIUM),
    category: Optional[Category] = Body(None),
    reporter_name: Optional[str] = Body(None),
    session: Session = Depends(get_session),
):
    """Create a new incident. Returns the full incident object including id/timestamps."""
    title = title.strip()
    description = description.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Title cannot be blank."
        )

    if not description:
        raise HTTPException(
            status_code=400,
            detail="Description cannot be blank."
        )
    
    incident = Incident(
        title=title,
        description=description,
        severity=severity,
        category=category,
        reporter_name=reporter_name,
    )

    session.add(incident)
    session.commit()
    session.refresh(incident)
    return incident