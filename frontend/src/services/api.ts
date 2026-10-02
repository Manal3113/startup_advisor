import {
  AnalysisData,
  HistoryItem,
  SystemStatus,
  KnowledgeDocument,
  AgentResultItem,
  DebateData,
  RiskItem,
  AIConnectionTestResult
} from "../types";

const API_BASE = "http://localhost:8000/api";

export const api = {
  async analyzeStartup(payload: { raw_idea: string; stage?: string; title?: string }): Promise<AnalysisData> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
      throw new Error(err.detail || "Failed to analyze startup");
    }
    return res.json();
  },

  async getAnalysis(id: number): Promise<AnalysisData> {
    const res = await fetch(`${API_BASE}/analysis/${id}`);
    if (!res.ok) throw new Error("Failed to load analysis");
    return res.json();
  },

  async getAnalysisAgents(id: number): Promise<AgentResultItem[]> {
    const res = await fetch(`${API_BASE}/analysis/${id}/agents`);
    if (!res.ok) throw new Error("Failed to load agent findings");
    return res.json();
  },

  async getAnalysisDebate(id: number): Promise<DebateData> {
    const res = await fetch(`${API_BASE}/analysis/${id}/debate`);
    if (!res.ok) throw new Error("Failed to load debate data");
    return res.json();
  },

  async getAnalysisRisks(id: number): Promise<RiskItem[]> {
    const res = await fetch(`${API_BASE}/analysis/${id}/risks`);
    if (!res.ok) throw new Error("Failed to load risk items");
    return res.json();
  },

  async getHistory(): Promise<HistoryItem[]> {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
  },

  getPdfDownloadUrl(id: number): string {
    return `${API_BASE}/reports/${id}/pdf`;
  },

  // Universal AI Key API
  async updateAIKey(payload: {
    provider: string;
    api_key: string;
    model?: string;
    base_url?: string;
  }): Promise<{ status: string; message: string; provider: string; model: string; latency_ms?: number }> {
    const res = await fetch(`${API_BASE}/settings/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to update AI key" }));
      throw new Error(err.detail || "Failed to update AI configuration");
    }
    return res.json();
  },

  async testAIConnection(payload?: {
    provider?: string;
    api_key?: string;
    model?: string;
    base_url?: string;
  }): Promise<AIConnectionTestResult> {
    const res = await fetch(`${API_BASE}/settings/ai/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });
    if (!res.ok) throw new Error("AI Connection test request failed");
    return res.json();
  },

  async getProviderPresets(): Promise<{
    active_provider: string;
    active_model: string;
    active_base_url: string;
    presets: Record<string, { base_url: string; default_model: string; models: string[] }>;
  }> {
    const res = await fetch(`${API_BASE}/settings/providers`);
    if (!res.ok) throw new Error("Failed to load provider presets");
    return res.json();
  },

  // Backward compatibility
  async updateGroqKey(apiKey: string, model?: string): Promise<{ status: string; message: string; model: string }> {
    return this.updateAIKey({ provider: "groq", api_key: apiKey, model });
  },

  async testGroqConnection(apiKey?: string, model?: string): Promise<{ status: string; message: string; model: string; provider: string; latency_ms?: number }> {
    return this.testAIConnection({ provider: "groq", api_key: apiKey, model });
  },

  async getSystemStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/settings/status`);
    if (!res.ok) throw new Error("Failed to get system status");
    return res.json();
  },

  async getKnowledgeCorpus(): Promise<{ total_documents: number; documents: KnowledgeDocument[] }> {
    const res = await fetch(`${API_BASE}/rag/knowledge`);
    if (!res.ok) throw new Error("Failed to get knowledge base");
    return res.json();
  },
};
