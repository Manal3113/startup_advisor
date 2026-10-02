from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Startup Input & Context
class StartupCreate(BaseModel):
    raw_idea: str = Field(..., min_length=10, description="Natural language description of the startup idea")
    stage: Optional[str] = Field("Just an Idea", description="Startup stage (e.g. Just an Idea, Prototype, MVP, Early Revenue, Growth)")
    title: Optional[str] = Field(None, description="Optional custom title for the startup")

class ExtractedContext(BaseModel):
    title: str
    industry: str
    problem: str
    solution: str
    target_customers: str
    business_model: str
    revenue_model: str
    location: str
    startup_stage: str
    key_technologies: List[str] = []

class StartupResponse(BaseModel):
    id: int
    title: str
    raw_idea: str
    extracted_context: Optional[Dict[str, Any]] = None
    stage: str
    created_at: datetime

    class Config:
        from_attributes = True

# Advisor Result
class AgentFinding(BaseModel):
    summary: str
    key_findings: List[str]
    strengths: List[str]
    concerns: List[str]
    recommendations: List[str]
    score: Optional[int] = 75

class AgentResultResponse(BaseModel):
    id: int
    agent_name: str
    role_title: str
    result: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Debate
class DebateTurn(BaseModel):
    agent_name: str
    role_title: str
    avatar_color: str
    round_number: int
    message: str
    targeted_agent: Optional[str] = None
    sentiment: Optional[str] = "neutral"  # agreement, challenge, defense, synthesis

class DebateSynthesis(BaseModel):
    consensus: List[str]
    disagreements: List[str]
    critical_assumptions: List[str]
    key_risks: List[str]
    strategic_mandate: str

class DebateResponse(BaseModel):
    id: int
    analysis_id: int
    debate_content: List[DebateTurn]
    synthesis: DebateSynthesis
    created_at: datetime

    class Config:
        from_attributes = True

# Risk Matrix Item
class RiskItem(BaseModel):
    id: str
    category: str  # Market, Financial, Competition, Legal, Customer, Operational, Technology
    title: str
    impact: int = Field(..., ge=1, le=5)  # 1 (Low) to 5 (Critical)
    likelihood: int = Field(..., ge=1, le=5)  # 1 (Rare) to 5 (Almost Certain)
    description: str
    why_it_matters: str
    suggested_mitigation: str
    severity_label: Optional[str] = "Moderate"

# Action Plan
class ActionPlan(BaseModel):
    seven_days: List[Dict[str, Any]]  # title, task, priority, owner_role
    thirty_days: List[Dict[str, Any]]
    ninety_days: List[Dict[str, Any]]

# RAG Source Excerpt
class RAGSource(BaseModel):
    title: str
    category: str
    excerpt: str
    relevance_score: float
    scheme_code: Optional[str] = None

# Financial Estimates & Valuation Breakdown
class FinancialBreakdownItem(BaseModel):
    item: str
    cost: str
    explanation: Optional[str] = ""

class StartupFinances(BaseModel):
    launch_budget: str
    launch_budget_items: List[FinancialBreakdownItem] = []
    monthly_running_cost: str
    monthly_cost_items: List[FinancialBreakdownItem] = []
    pricing_recommendation: str
    cost_per_user: str
    estimated_valuation: str
    three_year_potential_worth: str
    break_even_timeline: str
    fundraising_goal: str
    plain_english_advice: Optional[str] = ""

# Analysis Response
class AnalysisResponse(BaseModel):
    id: int
    startup_id: int
    startup_title: str
    raw_idea: str
    extracted_context: Dict[str, Any]
    viability_score: int
    market_potential_score: int
    business_model_score: int
    financial_feasibility_score: int
    risk_level: str
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    risks: List[str]
    risk_matrix: List[RiskItem]
    action_plan: ActionPlan
    synthesis: str
    rag_sources: List[RAGSource]
    finances: Optional[StartupFinances] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisHistoryItem(BaseModel):
    id: int
    startup_id: int
    startup_title: str
    raw_idea: str
    stage: str
    viability_score: int
    risk_level: str
    created_at: datetime

# Settings & Universal AI Configuration
class AIKeyUpdate(BaseModel):
    provider: Optional[str] = "groq" # "groq", "gemini", "openrouter", "mistral", "openai", "custom"
    api_key: str
    model: Optional[str] = None
    base_url: Optional[str] = None

class GroqKeyUpdate(BaseModel):
    api_key: str
    model: Optional[str] = None
    provider: Optional[str] = "groq"
    base_url: Optional[str] = None

class AITestResponse(BaseModel):
    status: str
    message: str
    provider: str
    model: str
    available_models: List[str] = []
    latency_ms: Optional[int] = None

class GroqTestResponse(BaseModel):
    status: str
    message: str
    model: str
    provider: str = "Groq"
    available_models: List[str] = []
    latency_ms: Optional[int] = None

class SystemStatusResponse(BaseModel):
    groq_connected: bool
    groq_model: str
    ai_provider: Optional[str] = "groq"
    ai_connected: Optional[bool] = False
    ai_model: Optional[str] = "llama-3.1-8b-instant"
    ai_base_url: Optional[str] = ""
    database_status: str
    rag_document_count: int
    version: str
    available_models: List[str] = []

