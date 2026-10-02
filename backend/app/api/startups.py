import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.startup import Startup, Analysis, AgentResult, Debate
from app.schemas.startup import (
    StartupCreate, AnalysisResponse, AnalysisHistoryItem,
    AgentResultResponse, DebateResponse, RiskItem
)
from app.services.advisor_service import AdvisorCoordinatorService
from app.agents.extractor import extract_startup_context

router = APIRouter(prefix="", tags=["startups"])

@router.post("/startups", status_code=status.HTTP_201_CREATED)
def extract_context_preview(payload: StartupCreate):
    """Extract context without running full 6-agent analysis"""
    try:
        context = extract_startup_context(payload.raw_idea, payload.stage, payload.title)
        return {"extracted_context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context extraction failed: {str(e)}")

@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
def run_full_analysis(payload: StartupCreate, db: Session = Depends(get_db)):
    """Run full 6-agent advisory board analysis, debate, and synthesis"""
    try:
        analysis = AdvisorCoordinatorService.analyze_startup(
            db=db,
            raw_idea=payload.raw_idea,
            stage=payload.stage or "Just an Idea",
            user_title=payload.title
        )
        return AdvisorCoordinatorService.format_analysis_response(analysis)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")

@router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return AdvisorCoordinatorService.format_analysis_response(analysis)

@router.get("/analysis/{analysis_id}/agents", response_model=List[AgentResultResponse])
def get_analysis_agents(analysis_id: int, db: Session = Depends(get_db)):
    results = db.query(AgentResult).filter(AgentResult.analysis_id == analysis_id).all()
    if not results:
        raise HTTPException(status_code=404, detail="Agent results not found")
    
    formatted = []
    for r in results:
        res_data = json.loads(r.result) if isinstance(r.result, str) else r.result
        formatted.append({
            "id": r.id,
            "agent_name": r.agent_name,
            "role_title": r.role_title,
            "result": res_data,
            "created_at": r.created_at
        })
    return formatted

@router.get("/analysis/{analysis_id}/debate", response_model=DebateResponse)
def get_analysis_debate(analysis_id: int, db: Session = Depends(get_db)):
    debate = db.query(Debate).filter(Debate.analysis_id == analysis_id).first()
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found")
    
    turns = json.loads(debate.debate_content) if isinstance(debate.debate_content, str) else debate.debate_content
    synthesis = json.loads(debate.synthesis) if isinstance(debate.synthesis, str) else debate.synthesis
    return {
        "id": debate.id,
        "analysis_id": debate.analysis_id,
        "debate_content": turns,
        "synthesis": synthesis,
        "created_at": debate.created_at
    }

@router.get("/analysis/{analysis_id}/risks", response_model=List[RiskItem])
def get_analysis_risks(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    matrix = json.loads(analysis.risk_matrix) if analysis.risk_matrix else []
    return matrix

@router.get("/history", response_model=List[AnalysisHistoryItem])
def get_analysis_history(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).limit(30).all()
    history = []
    for a in analyses:
        startup = a.startup
        history.append({
            "id": a.id,
            "startup_id": startup.id,
            "startup_title": startup.title,
            "raw_idea": startup.raw_idea,
            "stage": startup.stage,
            "viability_score": a.viability_score,
            "risk_level": a.risk_level,
            "created_at": a.created_at
        })
    return history
