from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.startup import Startup, Analysis, AgentResult, Debate
from app.reports.pdf_generator import generate_startup_pdf

router = APIRouter(prefix="", tags=["reports"])

@router.post("/reports/{analysis_id}/pdf")
@router.get("/reports/{analysis_id}/pdf")
def download_startup_pdf(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    startup = analysis.startup
    agent_results = db.query(AgentResult).filter(AgentResult.analysis_id == analysis_id).all()
    debate = db.query(Debate).filter(Debate.analysis_id == analysis_id).first()

    try:
        pdf_buffer = generate_startup_pdf(startup, analysis, agent_results, debate)
        filename = f"StartupAdvisor_{startup.title.replace(' ', '_')}_{analysis.id}.pdf"
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
