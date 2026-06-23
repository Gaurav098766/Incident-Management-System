from fastapi import APIRouter, Depends, Body, HTTPException, Query, logger
from sqlmodel import Session, select, col
from ..database import get_session
from typing import Optional
from ..models import Incident, Severity, Category, Status
from datetime import datetime, timezone
from ..schema import IncidentCreate, IncidentListItem, IncidentDetail

router = APIRouter(prefix="/incidents", tags=["incidents"])


# ── 1. Create ─────────────────────────────────────────────────────────────────

@router.post("/",status_code=201, summary="Create a new incident", response_model=IncidentDetail)
def create_incident(
    payload: IncidentCreate,
    session: Session = Depends(get_session),
):
    """Create a new incident. Returns the full incident object including id/timestamps."""
    try:
        incident = Incident(**payload.model_dump())
        session.add(incident)
        session.commit()
        session.refresh(incident)
        return IncidentDetail.model_validate(incident)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Failed to create incident.")


# ── 2. List + filter ──────────────────────────────────────────────────────────

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
        "page_rows": [IncidentListItem.model_validate(incident) for incident in page_rows],
        "total": total,
        "page": page,
        "page_size": page_size
    }


# ── 3. Detail ─────────────────────────────────────────────────────────────────

@router.get("/{incident_id}/", summary="Get particular incident detail", response_model=IncidentDetail)
def get_incident(incident_id: int, session: Session = Depends(get_session)):
    """Retrieve full incident detail. 404 if not found."""
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found.")
    return IncidentDetail.model_validate(incident)


# ── 4. Status update ──────────────────────────────────────────────────────────

@router.patch("/{incident_id}/status/", summary="Update incident status", response_model=IncidentDetail)
def update_status(
    incident_id: int,
    status: Status = Body(..., embed=True),
    session: Session = Depends(get_session),
):
    """Update incident status only. Validates the transition is allowed."""
    incident = session.get(Incident, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found.")

    try:
        incident.status = status
        incident.updated_at = datetime.now(timezone.utc)
        session.add(incident)
        session.commit()
        session.refresh(incident)
        return IncidentDetail.model_validate(incident)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Failed to update incident.")