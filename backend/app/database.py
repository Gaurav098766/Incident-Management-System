from sqlmodel import SQLModel, create_engine, Session
from .config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # needed for SQLite
    echo=settings.debug,
)

def create_db_and_tables():
    """Create all tables on startup."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """FastAPI dependency that yields a DB session per request."""
    with Session(engine) as session:
        yield session
