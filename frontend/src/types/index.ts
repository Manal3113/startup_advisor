export interface ExtractedContext {
  title: string;
  industry: string;
  problem: string;
  solution: string;
  target_customers: string;
  business_model: string;
  revenue_model: string;
  location: string;
  startup_stage: string;
  key_technologies: string[];
}

export interface AgentFinding {
  verdict?: string;
  summary: string;
  key_findings: string[];
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  score: number;
}

export interface AgentResultItem {
  id: number;
  agent_name: string;
  role_title: string;
  result: AgentFinding;
  created_at: string;
}

export interface DebateTurn {
  agent_name: string;
  role_title: string;
  avatar_color: string;
  round_number: number;
  message: string;
  targeted_agent?: string;
  sentiment?: "agreement" | "challenge" | "defense" | "neutral" | string;
}

export interface DebateSynthesis {
  consensus: string[];
  disagreements: string[];
  critical_assumptions: string[];
  key_risks: string[];
  strategic_mandate: string;
}

export interface DebateData {
  id: number;
  analysis_id: number;
  debate_content: DebateTurn[];
  synthesis: DebateSynthesis;
  created_at: string;
}

export interface RiskItem {
  id: string;
  category: "Market" | "Financial" | "Competition" | "Legal" | "Customer" | "Operational" | "Technology" | string;
  title: string;
  impact: number; // 1 to 5
  likelihood: number; // 1 to 5
  description: string;
  why_it_matters: string;
  suggested_mitigation: string;
  severity_label?: string;
}

export interface ActionPlanItem {
  title: string;
  task: string;
  priority: "High" | "Medium" | "Low";
  owner_role: string;
}

export interface ActionPlan {
  seven_days: ActionPlanItem[];
  thirty_days: ActionPlanItem[];
  ninety_days: ActionPlanItem[];
}

export interface RAGSource {
  title: string;
  category: string;
  excerpt: string;
  relevance_score: number;
  scheme_code?: string;
}

export interface FinancialBreakdownItem {
  item: string;
  cost: string;
  explanation?: string;
}

export interface StartupFinances {
  launch_budget: string;
  launch_budget_items?: FinancialBreakdownItem[];
  monthly_running_cost: string;
  monthly_cost_items?: FinancialBreakdownItem[];
  pricing_recommendation: string;
  cost_per_user: string;
  estimated_valuation: string;
  three_year_potential_worth: string;
  break_even_timeline: string;
  fundraising_goal: string;
  plain_english_advice?: string;
}

export interface AnalysisData {
  id: number;
  startup_id: number;
  startup_title: string;
  raw_idea: string;
  extracted_context: ExtractedContext;
  viability_score: number;
  market_potential_score: number;
  business_model_score: number;
  financial_feasibility_score: number;
  risk_level: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  risk_matrix: RiskItem[];
  action_plan: ActionPlan;
  synthesis: string;
  rag_sources: RAGSource[];
  finances?: StartupFinances;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  startup_id: number;
  startup_title: string;
  raw_idea: string;
  stage: string;
  viability_score: number;
  risk_level: string;
  created_at: string;
}

export interface SystemStatus {
  groq_connected: boolean;
  groq_model: string;
  ai_provider?: string;
  ai_connected?: boolean;
  ai_model?: string;
  ai_base_url?: string;
  database_status: string;
  rag_document_count: number;
  version: string;
  available_models?: string[];
}

export interface AIProviderPreset {
  base_url: string;
  default_model: string;
  models: string[];
}

export interface AIConnectionTestResult {
  status: "connected" | "failed";
  message: string;
  provider: string;
  model: string;
  available_models?: string[];
  latency_ms?: number;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  content: string;
  char_count: number;
}
