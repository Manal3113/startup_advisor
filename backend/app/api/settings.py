from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException
from app.config import settings, PROVIDER_DEFAULTS
from app.schemas.startup import (
    AIKeyUpdate, AITestResponse, GroqKeyUpdate, GroqTestResponse, SystemStatusResponse
)
from app.agents.core import universal_ai_client
from app.rag.engine import rag_engine

router = APIRouter(prefix="", tags=["settings"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@router.get("/settings/status", response_model=SystemStatusResponse)
def get_system_status():
    return {
        "groq_connected": settings.is_ai_configured,
        "groq_model": settings.ai_model,
        "ai_provider": settings.ai_provider,
        "ai_connected": settings.is_ai_configured,
        "ai_model": settings.ai_model,
        "ai_base_url": settings.ai_base_url,
        "database_status": "Connected (SQLite)",
        "rag_document_count": len(rag_engine.documents),
        "version": settings.VERSION,
        "available_models": universal_ai_client.list_available_models()
    }

@router.get("/settings/providers")
def get_provider_presets():
    return {
        "active_provider": settings.ai_provider,
        "active_model": settings.ai_model,
        "active_base_url": settings.ai_base_url,
        "presets": PROVIDER_DEFAULTS
    }

@router.post("/settings/ai")
def update_universal_ai_key(payload: AIKeyUpdate):
    provider = (payload.provider or "groq").lower().strip()
    api_key = payload.api_key.strip()
    
    # Custom/local may allow empty keys or 'ollama'
    if provider != "custom" and len(api_key) < 5:
        raise HTTPException(status_code=400, detail="Invalid API key format.")

    settings.set_ai_config(
        provider=provider,
        key=api_key,
        model=payload.model or "",
        base_url=payload.base_url or ""
    )

    test_result = universal_ai_client.test_connection()
    return {
        "status": "success" if test_result.get("success") else "warning",
        "message": test_result.get("message", "Key saved successfully"),
        "provider": settings.ai_provider,
        "model": settings.ai_model,
        "latency_ms": test_result.get("latency_ms"),
        "available_models": test_result.get("available_models", [])
    }

@router.post("/settings/ai/test", response_model=AITestResponse)
def test_universal_ai_connection(payload: Optional[AIKeyUpdate] = None):
    if payload and (payload.api_key or payload.provider == "custom"):
        settings.set_ai_config(
            provider=payload.provider or settings.ai_provider,
            key=payload.api_key,
            model=payload.model or "",
            base_url=payload.base_url or ""
        )

    test_res = universal_ai_client.test_connection()
    return {
        "status": "connected" if test_res.get("success") else "failed",
        "message": test_res.get("message", "Test completed"),
        "model": test_res.get("model", settings.ai_model),
        "provider": test_res.get("provider", settings.ai_provider),
        "available_models": test_res.get("available_models", []),
        "latency_ms": test_res.get("latency_ms")
    }

# Backward compatible routes for /settings/groq
@router.post("/settings/groq")
def update_groq_key(payload: GroqKeyUpdate):
    return update_universal_ai_key(AIKeyUpdate(
        provider=payload.provider or "groq",
        api_key=payload.api_key,
        model=payload.model,
        base_url=payload.base_url
    ))

@router.post("/settings/groq/test", response_model=GroqTestResponse)
def test_groq_connection(payload: Optional[GroqKeyUpdate] = None):
    test_res = test_universal_ai_connection(
        AIKeyUpdate(
            provider=payload.provider or "groq",
            api_key=payload.api_key if payload else "",
            model=payload.model if payload else None,
            base_url=payload.base_url if payload else None
        ) if payload else None
    )
    return {
        "status": test_res.status,
        "message": test_res.message,
        "model": test_res.model,
        "provider": test_res.provider,
        "available_models": test_res.available_models,
        "latency_ms": test_res.latency_ms
    }

@router.get("/rag/knowledge")
def get_rag_corpus():
    return {
        "total_documents": len(rag_engine.documents),
        "documents": rag_engine.get_all_documents()
    }
