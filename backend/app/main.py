from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.config import settings
from app.database.session import engine
from app.database.base import Base
from app.models import startup  # Ensures all models are registered
from app.api.router import api_router

from sqlalchemy import text

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Ensure finances column exists for existing SQLite tables
try:
    with engine.connect() as conn:
        res = conn.execute(text("PRAGMA table_info(analyses)")).fetchall()
        cols = [col[1] for col in res]
        if "finances" not in cols:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN finances TEXT DEFAULT '{}'"))
            conn.commit()
except Exception as e:
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="StartupAdvisor AI — Complete Multi-Agent GenAI Platform & Decision Support System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and local IP access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global safe error handler - no leaking secrets or raw stack traces to users
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Server Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred while processing your startup advisory request. Please try again."
        }
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to StartupAdvisor AI API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
