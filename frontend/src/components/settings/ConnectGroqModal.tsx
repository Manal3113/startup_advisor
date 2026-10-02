import React, { useState } from "react";
import { Key, ShieldCheck, X, AlertCircle, CheckCircle2, Cpu, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "../../services/api";

interface ConnectGroqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess: () => void;
  initialModel?: string;
}

export const ConnectGroqModal: React.FC<ConnectGroqModalProps> = ({
  isOpen,
  onClose,
  onConnectionSuccess,
  initialModel = "llama-3.1-8b-instant",
}) => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(initialModel);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleConnectAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setResult({ success: false, message: "Please enter your Groq API key." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. Send key to backend securely
      await api.updateGroqKey(apiKey.trim(), model);
      
      // 2. Perform test connection request
      const testRes = await api.testGroqConnection(apiKey.trim(), model);

      if (testRes.status === "connected") {
        setResult({
          success: true,
          message: testRes.message || "Groq Connected Successfully",
        });
        setApiKey("");
        onConnectionSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setResult({
          success: false,
          message: testRes.message || "Connection Failed — Check your API key",
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Connection Failed — Check your API key",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#EBE6DF] shadow-warm-lg space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-charcoal-400 hover:text-charcoal-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-terracotta-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-charcoal-900">
              Connect Groq AI
            </h3>
            <p className="text-xs text-charcoal-500">
              Enter your Groq API key to enable AI-powered startup analysis.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] flex items-start gap-2.5 text-xs text-charcoal-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-charcoal-800">Zero Client-Side Exposure:</span>
            <p className="text-[11px] text-charcoal-500 mt-0.5 leading-relaxed">
              Your key is transmitted directly to the secure FastAPI backend and never stored in browser storage or logs.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleConnectAndTest} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-700">
              Groq API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_••••••••••••••••••••••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE6DF] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm font-mono text-charcoal-900 pr-10 transition-all placeholder:text-charcoal-400"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-charcoal-400">
              Get your free key at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-terracotta-600 underline font-medium">console.groq.com/keys</a>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-700 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-terracotta-500" />
              Groq Model Selection
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE6DF] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-xs font-medium text-charcoal-900"
            >
              <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (Ultra Fast — Recommended for Free Tier)</option>
              <option value="qwen/qwen3.8-27b">qwen/qwen3.8-27b (High-Quality Reasoning)</option>
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Deep Analysis)</option>
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
            </select>
            <p className="text-[10px] text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
              💡 <b>Auto Model Discovery:</b> Groq models available specifically on your account are automatically detected and verified during connection test.
            </p>
          </div>

          {/* Feedback status banner */}
          {result && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                result.success
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-charcoal-600 hover:bg-charcoal-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-xs hover:shadow-warm-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? "Testing Key..." : "Connect & Test"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
