import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.base import Base

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    raw_idea = Column(Text, nullable=False)
    extracted_context = Column(Text, nullable=True)  # JSON string
    stage = Column(String(100), default="Just an Idea")
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("Analysis", back_populates="startup", cascade="all, delete-orphan")

    def get_context_dict(self):
        if self.extracted_context:
            try:
                return json.loads(self.extracted_context)
            except Exception:
                return {}
        return {}


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    viability_score = Column(Integer, default=70)
    market_potential_score = Column(Integer, default=70)
    business_model_score = Column(Integer, default=70)
    financial_feasibility_score = Column(Integer, default=70)
    risk_level = Column(String(50), default="Moderate")
    
    # SWOT stored as JSON text
    strengths = Column(Text, default="[]")
    weaknesses = Column(Text, default="[]")
    opportunities = Column(Text, default="[]")
    risks = Column(Text, default="[]")
    
    # 5x5 Risk Matrix items as JSON text
    risk_matrix = Column(Text, default="[]")
    
    # Action plan (7/30/90 days) as JSON text
    action_plan = Column(Text, default="{}")
    
    # Synthesis overview
    synthesis = Column(Text, default="")
    rag_sources = Column(Text, default="[]")
    
    # Financial estimates, costs, and valuation breakdown as JSON text
    finances = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)

    startup = relationship("Startup", back_populates="analyses")
    agent_results = relationship("AgentResult", back_populates="analysis", cascade="all, delete-orphan")
    debate = relationship("Debate", back_populates="analysis", uselist=False, cascade="all, delete-orphan")


class AgentResult(Base):
    __tablename__ = "agent_results"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    role_title = Column(String(150), nullable=False)
    result = Column(Text, nullable=False)  # JSON string with summary, key_findings, strengths, concerns, recommendations
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("Analysis", back_populates="agent_results")


class Debate(Base):
    __tablename__ = "debates"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False, unique=True)
    debate_content = Column(Text, nullable=False)  # JSON array of dialogue turns
    synthesis = Column(Text, nullable=False)  # JSON summary: consensus, disagreements, critical assumptions, key risks
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("Analysis", back_populates="debate")
