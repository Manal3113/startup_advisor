import React from "react";
import { PlusCircle, FileDown, Key, Sparkles, Cpu, Zap } from "lucide-react";
import { AnalysisData } from "../../types";

interface TopNavProps {
  currentTab: string;
  onNewIdea: () => void;
  onOpenSettings: () => void;
  currentAnalysis: AnalysisData | null;
  onDownloadPdf: () => void;
  aiConnected: boolean;
  aiProvider?: string;
  aiModel?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onNewIdea,
  onOpenSettings,
  currentAnalysis,
  onDownloadPdf,
  aiConnected,
  aiProvider = "groq",
  aiModel = "llama-3.1-8b-instant"
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "home": return "Platform Overview";
      case "analyze": return "Analyze Startup Idea";
      case "dashboard": return "Viability & Strategic Dashboard";
      case "advisors": return "6 Specialized AI Advisors";
      case "debate": return "Multi-Agent Debate Room";
      case "knowledge": return "RAG Context & Policy Corpus";
      case "risks": return "5×5 Interactive Risk Matrix";
      case "action_plan": return "Strategic Action Roadmap";
      case "reports": return "Executive PDF Report";
      case "history": return "Analysis History";
      case "settings": return "Platform Settings & Universal AI";
      default: return "StartupAdvisor AI";
    }
  };

  const getProviderName = (p: string) => {
    switch (p.toLowerCase()) {
      case "gemini": return "Gemini AI";
      case "openrouter": return "OpenRouter";
      case "groq": return "Groq Cloud";
      case "mistral": return "Mistral AI";
      case "openai": return "OpenAI";
      case "custom": return "Local / Ollama";
      default: return "AI Provider";
    }
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Page Title & Context */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-heading font-extrabold text-white tracking-tight">
          {getTabTitle(currentTab)}
        </h2>
        {currentAnalysis && currentTab !== "home" && currentTab !== "analyze" && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 glow-primary">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{currentAnalysis.startup_title}</span>
            <span className="text-[10px] text-indigo-400/80">({currentAnalysis.extracted_context?.industry || "Tech"})</span>
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        
        {/* Universal AI Provider Pill */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover-3d-tilt ${
            aiConnected
              ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50 glow-emerald"
              : "bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/50 glow-amber"
          }`}
          title="Configure Universal AI Provider (Gemini, OpenRouter, Groq, Ollama, etc.)"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${aiConnected ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${aiConnected ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          </span>
          <Cpu className="w-3.5 h-3.5 text-slate-300" />
          <span>{aiConnected ? `${getProviderName(aiProvider)} Active` : "Connect Universal Key"}</span>
        </button>

        {currentAnalysis && (
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold glass-card-3d border-white/10 hover:border-white/20 text-slate-200 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span> PDF
          </button>
        )}

        <button
          onClick={onNewIdea}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-lg glow-primary transition-all hover-3d-tilt"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </button>
      </div>
    </header>
  );
};
