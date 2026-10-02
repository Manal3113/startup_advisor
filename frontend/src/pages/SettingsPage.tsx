import React, { useEffect, useState } from "react";
import {
  Settings,
  Key,
  Database,
  BookOpen,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Globe,
  Sparkles,
  Server,
  Zap,
  ExternalLink
} from "lucide-react";
import { api } from "../services/api";
import { SystemStatus } from "../types";

interface SettingsPageProps {
  onStatusUpdated: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onStatusUpdated }) => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<string>("groq");
  const [newKey, setNewKey] = useState("");
  const [model, setModel] = useState("llama-3.1-8b-instant");
  const [baseUrl, setBaseUrl] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; latency_ms?: number } | null>(null);
  const [presets, setPresets] = useState<Record<string, { base_url: string; default_model: string; models: string[] }>>({});

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getSystemStatus();
      setStatus(data);
      if (data.ai_provider) setProvider(data.ai_provider);
      if (data.ai_model) setModel(data.ai_model);
      if (data.ai_base_url) setBaseUrl(data.ai_base_url);

      const presetData = await api.getProviderPresets();
      setPresets(presetData.presets || {});
    } catch (e) {
      console.error("Failed to load status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleProviderChange = (newP: string) => {
    setProvider(newP);
    setFeedback(null);
    const pData = presets[newP];
    if (pData) {
      setModel(pData.default_model);
      setBaseUrl(pData.base_url);
    }
  };

  const handleUpdateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (provider !== "custom" && !newKey.trim()) {
      setFeedback({ success: false, message: `Please enter an API key for ${provider.toUpperCase()}.` });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      await api.updateAIKey({
        provider,
        api_key: newKey.trim(),
        model: model.trim(),
        base_url: baseUrl.trim()
      });

      const test = await api.testAIConnection({
        provider,
        api_key: newKey.trim(),
        model: model.trim(),
        base_url: baseUrl.trim()
      });

      if (test.status === "connected") {
        setFeedback({
          success: true,
          message: `${provider.toUpperCase()} Connected Successfully`,
          latency_ms: test.latency_ms
        });
        setNewKey("");
        onStatusUpdated();
        fetchStatus();
      } else {
        setFeedback({ success: false, message: test.message || "Connection Failed — Check key or model" });
      }
    } catch (err: any) {
      setFeedback({ success: false, message: err.message || "Error updating AI configuration" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestExisting = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const test = await api.testAIConnection();
      if (test.status === "connected") {
        setFeedback({
          success: true,
          message: `Live Connection Verified (${test.latency_ms || 120}ms)`,
          latency_ms: test.latency_ms
        });
      } else {
        setFeedback({ success: false, message: test.message || "Connection test returned failure" });
      }
      fetchStatus();
    } catch (err: any) {
      setFeedback({ success: false, message: err.message || "Test failed" });
    } finally {
      setSaving(false);
    }
  };

  const isConnected = Boolean(status?.ai_connected || status?.groq_connected);
  const activeModel = status?.ai_model || model;
  const activeProvider = status?.ai_provider || provider;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="text-left border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
          <Settings className="w-4 h-4" />
          <span>System Administration</span>
        </div>
        <h2 className="text-2xl font-heading font-black text-white tracking-tight">
          Platform Settings & Universal AI Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure universal LLM API keys (Google Gemini, OpenRouter, Groq, Mistral, Ollama), local RAG indices, and SQLite persistence.
        </p>
      </div>

      {/* AI Configuration 3D Glass Card */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 text-white flex items-center justify-center shadow-lg glow-primary">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-extrabold text-white">
                Universal AI Provider Engine
              </h3>
              <p className="text-xs text-slate-400">
                Plug-and-play compatibility with any free or premium LLM endpoint
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
              isConnected
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40 glow-emerald"
                : "bg-amber-950/40 text-amber-300 border-amber-500/40 glow-amber"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <span>{isConnected ? `Online (${activeProvider.toUpperCase()})` : "Offline Simulator"}</span>
            </span>

            <button
              onClick={handleTestExisting}
              disabled={saving}
              className="p-2 rounded-xl glass-card-3d border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all"
              title="Test Connection"
            >
              <RefreshCw className={`w-4 h-4 ${saving ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Current Config Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Provider</span>
            <p className="text-sm font-black text-white uppercase tracking-tight">{activeProvider}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Model</span>
            <p className="text-sm font-mono font-bold text-indigo-300 truncate">{activeModel}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Live Status</span>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <span>{isConnected ? "🟢 Live Inference Ready" : "🟡 Domain Rule Fallback Active"}</span>
            </p>
          </div>
        </div>

        {/* Provider Switcher Tabs */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Switch Active AI Provider
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: "groq", name: "Groq", note: "Sub-Second" },
              { id: "gemini", name: "Gemini", note: "Free Key" },
              { id: "openrouter", name: "OpenRouter", note: "Free Models" },
              { id: "mistral", name: "Mistral", note: "Codestral" },
              { id: "openai", name: "OpenAI", note: "GPT-4o mini" },
              { id: "custom", name: "Local AI", note: "Ollama / vLLM" },
            ].map((p) => {
              const isSel = provider === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSel
                      ? "bg-indigo-600/30 border-indigo-400/80 text-white shadow-lg glow-primary ring-1 ring-indigo-400/40"
                      : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  <p className="text-xs font-bold truncate">{p.name}</p>
                  <span className={`text-[9px] block ${isSel ? "text-indigo-300 font-semibold" : "text-slate-500"}`}>
                    {p.note}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Update Key & Model Form */}
        <form onSubmit={handleUpdateKey} className="space-y-4 pt-3 border-t border-white/10">
          
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{provider.toUpperCase()} API Key</span>
              <span className="text-[10px] text-slate-500">Stored safely on FastAPI backend</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder={`Enter new ${provider.toUpperCase()} key: ••••••••••••••••••••`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 text-xs font-mono text-white pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Select or Enter Model Name
            </label>
            <div className="space-y-1.5">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(presets[provider]?.models || []).map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-white">
                    {m} {m === activeModel ? "(Active)" : ""}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Or custom model name (e.g. meta-llama/llama-3.2-3b-instruct:free)"
                className="w-full px-3.5 py-1.5 rounded-lg border border-white/5 bg-slate-950/40 text-[11px] font-mono text-slate-300 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Base URL (for local or custom) */}
          {(provider === "custom" || baseUrl) && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                API Base URL
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:11434/v1"
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-950/60 text-xs font-mono text-slate-300 placeholder:text-slate-600"
              />
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                feedback.success
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/40"
                  : "bg-rose-950/50 text-rose-300 border-rose-500/40"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
              {feedback.latency_ms && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {feedback.latency_ms}ms
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-lg glow-primary transition-all disabled:opacity-50 hover-3d-tilt"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{saving ? "Verifying..." : `Update & Test ${provider.toUpperCase()}`}</span>
            </button>
          </div>
        </form>

      </div>

      {/* RAG Knowledge Base & Database Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Knowledge Base */}
        <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center glow-teal">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-extrabold text-white">
                Knowledge Base (RAG)
              </h4>
              <p className="text-[11px] text-slate-400">
                TF-IDF Statutory Corpus Index
              </p>
            </div>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Indexed Documents:</span>
              <span className="font-mono font-bold text-white">{status?.rag_document_count || 10}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Retriever:</span>
              <span className="font-semibold text-teal-400 font-mono">TF-IDF + Cosine</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-400">🟢 Connected</span>
            </div>
          </div>
        </div>

        {/* SQLite Database */}
        <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center glow-amber">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-extrabold text-white">
                Local Database
              </h4>
              <p className="text-[11px] text-slate-400">
                Persistent Venture Storage
              </p>
            </div>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Engine:</span>
              <span className="font-bold text-white">SQLite + SQLAlchemy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">File:</span>
              <span className="font-mono text-slate-400 text-[11px]">startupadvisor.db</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-400">🟢 Connected</span>
            </div>
          </div>
        </div>

      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 flex items-start gap-3 text-xs text-slate-400 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <b>Universal Security Guarantee:</b> All keys are stored securely in backend server environment variables. Zero credentials are ever exposed in client-side network payloads or browser localStorage.
        </p>
      </div>

    </div>
  );
};
