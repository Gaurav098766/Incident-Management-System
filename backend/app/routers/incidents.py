from fastapi import APIRouter, Depends, Body, HTTPException, Query
from sqlmodel import Session, select, col
from ..database import get_session
from typing import Optional
from ..models import Incident, Severity, Category, Status

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/",status_code=201, summary="Create a new incident")
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


@router.get("/", summary="List incidents")
def list_incidents(
    severity: Optional[Severity] = Query(default=None),
    status: Optional[Status]   = Query(default=None),
    search: Optional[str]      = Query(default=None, min_length=1),
    page: int                  = Query(default=1, ge=1),
    page_size: int             = Query(default=10, ge=1, le=100),
    session: Session           = Depends(get_session),
):
    """List incidents. Filterable by ?severity=&status=&search="""
    query = select(Incident)

    if severity:
        query = query.where(Incident.severity == severity)
    if status:
        query = query.where(Incident.status == status)
    if search:
        term = f"%{search.lower()}%"
        query = query.where(
            col(Incident.title).ilike(term) | col(Incident.description).ilike(term)
        )

    query = query.order_by(Incident.created_at.desc())

    all_rows = session.exec(query).all()
    total = len(all_rows)
    offset = (page - 1) * page_size
    page_rows = all_rows[offset: offset + page_size]

    return {
        "page_rows": page_rows,
        "total": total,
        "page": page,
        "page_size": page_size
    }