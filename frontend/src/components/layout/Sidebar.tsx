import React from "react";
import {
  Rocket,
  Home,
  Lightbulb,
  LayoutDashboard,
  Users,
  MessageSquareQuote,
  BookOpen,
  AlertTriangle,
  Target,
  FileText,
  History,
  Settings,
  ShieldCheck,
  ChevronRight,
  Cpu
} from "lucide-react";
import { AnalysisData } from "../../types";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentAnalysis: AnalysisData | null;
  aiConnected: boolean;
  aiProvider?: string;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentAnalysis,
  aiConnected,
  aiProvider = "groq",
  onOpenSettings,
}) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "analyze", label: "Analyze Startup", icon: Lightbulb, highlight: true },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, requiresData: true },
    { id: "advisors", label: "AI Advisors", icon: Users, requiresData: true },
    { id: "debate", label: "Debate Room", icon: MessageSquareQuote, requiresData: true },
    { id: "knowledge", label: "Knowledge", icon: BookOpen },
    { id: "risks", label: "Risk Analysis", icon: AlertTriangle, requiresData: true },
    { id: "action_plan", label: "Action Plan", icon: Target, requiresData: true },
    { id: "reports", label: "Reports", icon: FileText, requiresData: true },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getProviderLabel = (p: string) => {
    switch (p.toLowerCase()) {
      case "gemini": return "Gemini AI";
      case "openrouter": return "OpenRouter";
      case "groq": return "Groq Cloud";
      case "mistral": return "Mistral AI";
      case "openai": return "OpenAI";
      case "custom": return "Local Ollama";
      default: return "AI Engine";
    }
  };

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col h-screen sticky top-0 select-none z-30 shadow-2xl">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div 
          onClick={() => setCurrentTab("home")} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-white shadow-lg glow-primary group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-black text-white text-base leading-tight tracking-tight flex items-center gap-1">
              StartupAdvisor <span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">AI Advisory Board</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isDisabled = item.requiresData && !currentAnalysis;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600/30 text-white border border-indigo-500/50 glow-primary font-bold shadow-md"
                  : isDisabled
                  ? "text-slate-600 cursor-not-allowed opacity-40"
                  : item.highlight
                  ? "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : isDisabled ? "text-slate-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
              {isDisabled && <span className="text-[9px] text-slate-600">Run first</span>}
            </button>
          );
        })}
      </div>

      {/* Current Active Startup Capsule (if loaded) */}
      {currentAnalysis && (
        <div className="mx-3 mb-2 p-3 rounded-2xl glass-card-3d border-indigo-500/30 bg-indigo-950/30 space-y-1">
          <p className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Active Analysis</p>
          <p className="text-xs font-bold text-white truncate">{currentAnalysis.startup_title}</p>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Score: <b className="text-emerald-400 font-bold">{currentAnalysis.viability_score}/100</b></span>
            <span className="text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-500/30">
              {currentAnalysis.risk_level}
            </span>
          </div>
        </div>
      )}

      {/* Universal AI Provider Footer */}
      <div className="p-3 border-t border-white/10 bg-slate-950/90">
        <div 
          onClick={onOpenSettings}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900/70 cursor-pointer transition-colors border border-transparent hover:border-white/10"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${aiConnected ? "bg-emerald-400" : "bg-amber-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${aiConnected ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-white">
                {aiConnected ? getProviderLabel(aiProvider) : "Universal AI Engine"}
              </p>
              <p className="text-[10px] text-slate-400">
                {aiConnected ? "Live Inference Active" : "Click to connect any key"}
              </p>
            </div>
          </div>
          <Cpu className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
