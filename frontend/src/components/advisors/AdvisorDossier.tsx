import React, { useState } from "react";
import {
  Briefcase,
  Landmark,
  TrendingUp,
  Scale,
  Users,
  ShieldX,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame
} from "lucide-react";
import { AgentResultItem } from "../../types";

interface AdvisorDossierProps {
  agents: AgentResultItem[];
}

export const AdvisorDossier: React.FC<AdvisorDossierProps> = ({ agents }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"signals" | "detailed">("signals");

  const getAgentConfig = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("investor")) {
      return {
        icon: Briefcase,
        neonColor: "amber",
        borderColor: "border-amber-500/40",
        glowClass: "glow-amber",
        badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        scoreColor: "#F59E0B"
      };
    }
    if (lower.includes("lender")) {
      return {
        icon: Landmark,
        neonColor: "teal",
        borderColor: "border-teal-500/40",
        glowClass: "glow-teal",
        badgeBg: "bg-teal-500/15 text-teal-400 border-teal-500/30",
        scoreColor: "#14B8A6"
      };
    }
    if (lower.includes("strategist")) {
      return {
        icon: TrendingUp,
        neonColor: "blue",
        borderColor: "border-blue-500/40",
        glowClass: "glow-blue",
        badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        scoreColor: "#3B82F6"
      };
    }
    if (lower.includes("legal")) {
      return {
        icon: Scale,
        neonColor: "purple",
        borderColor: "border-purple-500/40",
        glowClass: "glow-purple",
        badgeBg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        scoreColor: "#A855F7"
      };
    }
    if (lower.includes("customer")) {
      return {
        icon: Users,
        neonColor: "emerald",
        borderColor: "border-emerald-500/40",
        glowClass: "glow-emerald",
        badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        scoreColor: "#10B981"
      };
    }
    // Devil's advocate
    return {
      icon: ShieldX,
      neonColor: "rose",
      borderColor: "border-rose-500/40",
      glowClass: "glow-rose",
      badgeBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      scoreColor: "#F43F5E"
    };
  };

  const currentAgent = agents[activeTab] || agents[0];
  const res = (currentAgent?.result as any) || {};
  const cfg = getAgentConfig(currentAgent?.agent_name || "");
  const Icon = cfg.icon;

  // Helper to parse key findings into structured bold signals
  const parseFinding = (rawText: string) => {
    // Check if format is **Topic:** Details
    const match = rawText.match(/^\*\*([^*]+)\*\*[:\s]*(.*)$/);
    if (match) {
      return { title: match[1].trim(), content: match[2].trim() };
    }
    const colonIdx = rawText.indexOf(":");
    if (colonIdx > 0 && colonIdx < 30) {
      return {
        title: rawText.slice(0, colonIdx).trim(),
        content: rawText.slice(colonIdx + 1).trim()
      };
    }
    return { title: "Diligence Metric", content: rawText };
  };

  return (
    <div className="space-y-6">
      
      {/* 6 Advisor 3D Perspective Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {agents.map((ag, idx) => {
          const c = getAgentConfig(ag.agent_name);
          const TabIcon = c.icon;
          const isActive = activeTab === idx;
          const score = ag.result?.score || 70;

          return (
            <button
              key={ag.id || idx}
              onClick={() => setActiveTab(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group hover-3d-tilt ${
                isActive
                  ? `glass-card-3d ${c.borderColor} ${c.glowClass} ring-1 ring-white/20 bg-slate-800/80`
                  : "glass-card-3d border-white/5 hover:border-white/20 hover:bg-slate-800/50"
              }`}
            >
              {isActive && (
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ backgroundColor: c.scoreColor }}
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isActive ? "bg-white/10 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                  style={{ color: isActive ? c.scoreColor : undefined }}
                >
                  <TabIcon className="w-4 h-4" />
                </div>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${c.scoreColor}15`,
                    color: c.scoreColor,
                    borderColor: `${c.scoreColor}30`
                  }}
                >
                  {score}%
                </span>
              </div>

              <p className="text-xs font-heading font-bold text-white truncate">
                {ag.agent_name}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {ag.role_title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Advisor Dossier Card */}
      {currentAgent && (
        <div className={`glass-card-3d rounded-3xl p-6 sm:p-8 border ${cfg.borderColor} shadow-2xl relative space-y-6`}>
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${cfg.glowClass}`}
                style={{ backgroundColor: `${cfg.scoreColor}25`, border: `1px solid ${cfg.scoreColor}50` }}
              >
                <Icon className="w-6 h-6" style={{ color: cfg.scoreColor }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
                    {currentAgent.agent_name}
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${cfg.badgeBg}`}>
                    {currentAgent.role_title}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-signal diligence evaluation & stress-tested findings
                </p>
              </div>
            </div>

            {/* Score & View Mode Toggle */}
            <div className="flex items-center gap-4">
              {/* View Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-white/10 text-xs">
                <button
                  onClick={() => setViewMode("signals")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    viewMode === "signals"
                      ? "bg-indigo-600 text-white shadow-md glow-primary"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>⚡ Must-Know Points</span>
                </button>
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    viewMode === "detailed"
                      ? "bg-slate-800 text-white border border-white/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3 h-3 text-slate-400" />
                  <span>Full Diligence</span>
                </button>
              </div>

              {/* Perspective Score */}
              <div className="text-right pl-3 border-l border-white/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
                <p className="text-2xl font-heading font-black leading-none mt-0.5" style={{ color: cfg.scoreColor }}>
                  {res.score || 72}
                  <span className="text-xs text-slate-500 font-normal font-sans"> / 100</span>
                </p>
              </div>
            </div>
          </div>

          {/* 1-Sentence Bottom-Line Verdict Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 flex items-start gap-3 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-0.5">
                Bottom-Line Verdict
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {res.verdict || res.summary}
              </p>
            </div>
          </div>

          {/* VIEW MODE: HIGH-SIGNAL MUST-KNOW POINTS (Crisp, No lengthy text!) */}
          {viewMode === "signals" ? (
            <div className="space-y-6">
              
              {/* Structured Key Findings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Essential "Must-Know" Signals
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(res.key_findings || (res as any).findings || []).map((finding: string, idx: number) => {
                    const parsed = parseFinding(finding);
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all hover-3d-tilt space-y-1.5 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-lg text-[10px] font-bold font-mono flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: `${cfg.scoreColor}20`,
                              color: cfg.scoreColor,
                              borderColor: `${cfg.scoreColor}40`
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white tracking-tight">
                            {parsed.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pl-7">
                          {parsed.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Red-Flag Warnings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validated Moats & Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {(res.strengths || []).map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                        <span className="leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concerns / Red Flags */}
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Dealbreaker Risks & Friction</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {(res.concerns || []).map((c: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold text-sm leading-none">•</span>
                        <span className="leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Strategic Next Steps */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Immediate Founder Actions (Next 14 Days)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(res.recommendations || []).map((rec: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-200 shadow-sm leading-relaxed"
                    >
                      <span className="font-bold text-amber-400 block text-[11px] mb-1">
                        Action #{idx + 1}:
                      </span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* DETAILED VIEW: For deep reference */
            <div className="space-y-5 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-white/10 leading-relaxed font-sans italic text-slate-300">
                "{res.summary}"
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Full Findings Breakdown:</h5>
                <ul className="space-y-2">
                  {(res.key_findings || []).map((f: string, i: number) => (
                    <li key={i} className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-2">
                      <span className="font-mono text-indigo-400 font-bold">{i + 1}.</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
