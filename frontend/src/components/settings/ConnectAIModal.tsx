import React, { useState, useEffect } from "react";
import {
  Key,
  ShieldCheck,
  X,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Zap,
  Globe,
  Server,
  Layers,
  ExternalLink
} from "lucide-react";
import { api } from "../../services/api";

interface ConnectAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess: () => void;
  initialProvider?: string;
  initialModel?: string;
}

export const ConnectAIModal: React.FC<ConnectAIModalProps> = ({
  isOpen,
  onClose,
  onConnectionSuccess,
  initialProvider = "groq",
  initialModel = "llama-3.1-8b-instant",
}) => {
  const [provider, setProvider] = useState<string>(initialProvider);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(initialModel);
  const [baseUrl, setBaseUrl] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; latency_ms?: number } | null>(null);
  const [presets, setPresets] = useState<Record<string, { base_url: string; default_model: string; models: string[] }>>({});

  useEffect(() => {
    if (isOpen) {
      api.getProviderPresets().then((data) => {
        setPresets(data.presets || {});
        if (data.active_provider) {
          setProvider(data.active_provider);
          setModel(data.active_model);
          setBaseUrl(data.active_base_url || "");
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  const handleProviderSelect = (selectedProvider: string) => {
    setProvider(selectedProvider);
    setResult(null);
    const preset = presets[selectedProvider];
    if (preset) {
      setModel(preset.default_model);
      setBaseUrl(preset.base_url);
    }
  };

  if (!isOpen) return null;

  const handleConnectAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (provider !== "custom" && !apiKey.trim()) {
      setResult({ success: false, message: `Please enter your ${provider.toUpperCase()} API key.` });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. Update AI configuration
      await api.updateAIKey({
        provider,
        api_key: apiKey.trim(),
        model: model.trim(),
        base_url: baseUrl.trim()
      });

      // 2. Perform test connection request
      const testRes = await api.testAIConnection({
        provider,
        api_key: apiKey.trim(),
        model: model.trim(),
        base_url: baseUrl.trim()
      });

      if (testRes.status === "connected") {
        setResult({
          success: true,
          message: testRes.message || "Connected Successfully",
          latency_ms: testRes.latency_ms
        });
        setApiKey("");
        onConnectionSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setResult({
          success: false,
          message: testRes.message || "Connection Failed — Please check key/model"
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Connection request failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProviderInfo = () => {
    switch (provider) {
      case "gemini":
        return {
          title: "Google Gemini (Free API)",
          desc: "Ultra-fast inference via Google AI Studio. 100% Free tier available.",
          keyUrl: "https://aistudio.google.com/app/apikey",
          keyPlaceholder: "AIzaSy••••••••••••••••••••••••••••"
        };
      case "openrouter":
        return {
          title: "OpenRouter (Free Models)",
          desc: "Access Meta Llama 3.2, DeepSeek R1, Gemini Flash Free models via universal gateway.",
          keyUrl: "https://openrouter.ai/keys",
          keyPlaceholder: "sk-or-v1-••••••••••••••••••••••••••••"
        };
      case "groq":
        return {
          title: "Groq Cloud (Fast Free Tier)",
          desc: "Sub-second Llama 3.1 & 3.3 inference with generous free rate limits.",
          keyUrl: "https://console.groq.com/keys",
          keyPlaceholder: "gsk_••••••••••••••••••••••••••••••••"
        };
      case "mistral":
        return {
          title: "Mistral AI",
          desc: "State-of-the-art European open models (Mistral Small, Codestral).",
          keyUrl: "https://console.mistral.ai/api-keys/",
          keyPlaceholder: "••••••••••••••••••••••••••••••••"
        };
      case "openai":
        return {
          title: "OpenAI",
          desc: "GPT-4o and GPT-4o-mini official API endpoints.",
          keyUrl: "https://platform.openai.com/api-keys",
          keyPlaceholder: "sk-proj-••••••••••••••••••••••••••••"
        };
      default:
        return {
          title: "Custom / Local AI (Ollama / vLLM)",
          desc: "Run completely free and offline with Ollama, LM Studio, or any OpenAI-compatible server.",
          keyUrl: "https://ollama.com",
          keyPlaceholder: "Optional key (e.g. ollama)"
        };
    }
  };

  const info = getProviderInfo();
  const currentPresetModels = presets[provider]?.models || [];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="glass-card-3d bg-slate-900/90 rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-white/10 shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 text-white flex items-center justify-center shadow-lg glow-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
              Universal AI Engine Setup
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Any Key
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Plug in ANY free or premium model API key. Works with all providers.
            </p>
          </div>
        </div>

        {/* Provider Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Select AI Provider
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "groq", name: "Groq", badge: "Fast Free" },
              { id: "gemini", name: "Gemini", badge: "Free Key" },
              { id: "openrouter", name: "OpenRouter", badge: "Free Models" },
              { id: "mistral", name: "Mistral", badge: "Free Tier" },
              { id: "openai", name: "OpenAI", badge: "Standard" },
              { id: "custom", name: "Local / Ollama", badge: "100% Offline" },
            ].map((p) => {
              const isSelected = provider === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? "bg-indigo-600/25 border-indigo-400/80 text-white shadow-lg glow-primary ring-1 ring-indigo-400/50"
                      : "bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <p className="text-xs font-bold leading-tight truncate">{p.name}</p>
                  <span className={`text-[9px] font-medium block mt-0.5 ${isSelected ? "text-indigo-300" : "text-slate-500"}`}>
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Provider Info Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-slate-300">
          <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-white">{info.title}</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              {info.desc}
            </p>
            {info.keyUrl && (
              <a
                href={info.keyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline mt-1.5"
              >
                <span>Get your free key here</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleConnectAndTest} className="space-y-4">
          
          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{provider.toUpperCase()} API Key</span>
              <span className="text-[10px] text-slate-500 font-normal">Encrypted on FastAPI backend</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={info.keyPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono text-white pr-10 transition-all placeholder:text-slate-600"
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
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Model Name
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Free Models Recommended</span>
            </label>
            {currentPresetModels.length > 0 ? (
              <div className="space-y-1.5">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono text-slate-200"
                >
                  {currentPresetModels.map((m) => (
                    <option key={m} value={m} className="bg-slate-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Or type custom model name..."
                  className="w-full px-3.5 py-1.5 rounded-lg border border-white/5 bg-slate-950/40 text-[11px] font-mono text-slate-300 placeholder:text-slate-600"
                />
              </div>
            ) : (
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. llama3.2, mistral, deepseek-r1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono text-white"
              />
            )}
          </div>

          {/* Custom Base URL (if custom or desired) */}
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

          {/* Feedback Status */}
          {result && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                result.success
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                  : "bg-rose-950/60 text-rose-300 border-rose-500/40"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{result.message}</span>
              </div>
              {result.latency_ms && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {result.latency_ms}ms
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-lg glow-primary transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? "Testing Universal Key..." : "Connect & Verify"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
