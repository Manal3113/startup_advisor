from fastapi import APIRouter
from app.api.startups import router as startups_router
from app.api.reports import router as reports_router
from app.api.settings import router as settings_router

api_router = APIRouter()
api_router.include_router(startups_router)
api_router.include_router(reports_router)
api_router.include_router(settings_router)
