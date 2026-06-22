from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.settings import settings

app = FastAPI(
    title=settings.app_name,
    description="Lightweight incident tracking API.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)