import sys
import os
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.models.startup import Startup, Analysis
from app.rag.engine import rag_engine
from app.services.advisor_service import AdvisorCoordinatorService
from app.reports.pdf_generator import generate_startup_pdf

def test_full_pipeline():
    print("1. Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Tables created successfully.")

    print(f"2. Testing RAG engine: loaded {len(rag_engine.documents)} documents...")
    assert len(rag_engine.documents) > 0, "No documents loaded in RAG"
    rag_results = rag_engine.search("farmer crop disease mobile camera ai", top_k=3)
    print(f"[OK] RAG Search returned {len(rag_results)} results:")
    for r in rag_results:
        print(f"   - {r['title']} (Score: {r['relevance_score']}%)")

    print("3. Testing AdvisorCoordinatorService.analyze_startup...")
    db = SessionLocal()
    try:
        sample_idea = "I want to build an affordable AI application that helps small farmers identify crop diseases using their phone camera."
        analysis = AdvisorCoordinatorService.analyze_startup(
            db=db,
            raw_idea=sample_idea,
            stage="MVP",
            user_title="AgriCure AI"
        )
        print(f"[OK] Analysis created! ID: {analysis.id}")
        print(f"   - Viability Score: {analysis.viability_score}/100")
        print(f"   - Risk Level: {analysis.risk_level}")
        print(f"   - Agent results count: {len(analysis.agent_results)}")
        print(f"   - Debate turns: {bool(analysis.debate)}")

        print("4. Testing ReportLab PDF Generation...")
        pdf_buf = generate_startup_pdf(analysis.startup, analysis, analysis.agent_results, analysis.debate)
        pdf_bytes = pdf_buf.read()
        print(f"[OK] PDF generated successfully! Size: {len(pdf_bytes)} bytes")
        assert len(pdf_bytes) > 5000, "PDF size unexpectedly small"

        print("\nALL BACKEND SYSTEM CHECKS PASSED PERFECTLY! [SUCCESS]\n")
    finally:
        db.close()

if __name__ == "__main__":
    test_full_pipeline()
