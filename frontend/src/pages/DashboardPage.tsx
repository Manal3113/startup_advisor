import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  FileDown,
  MessageSquareQuote,
  Users,
  AlertTriangle,
  Target,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { AnalysisData } from "../types";
import { ViabilityGauge } from "../components/dashboard/ViabilityGauge";
import { SWOTGrid } from "../components/dashboard/SWOTGrid";
import { StartupCostCard } from "../components/dashboard/StartupCostCard";

interface DashboardPageProps {
  analysis: AnalysisData;
  onNavigateTab: (tab: string) => void;
  onDownloadPdf: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analysis,
  onNavigateTab,
  onDownloadPdf,
}) => {
  useEffect(() => {
    if (analysis.viability_score >= 70) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#10B981', '#F59E0B'],
          disableForReducedMotion: true
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [analysis.id]);

  const ctx = analysis.extracted_context || {
    title: analysis.startup_title,
    industry: "Technology",
    problem: "",
    solution: "",
    target_customers: "",
    business_model: "",
    revenue_model: "",
    location: "India",
    startup_stage: "Just an Idea",
    key_technologies: []
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 glow-primary">
              {ctx.startup_stage || "Early Stage"}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID #{analysis.id} • Evaluated {new Date(analysis.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-1.5 flex items-center gap-3">
            <span>{analysis.startup_title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {ctx.industry} • {ctx.location} • Model: <span className="font-semibold text-slate-200">{ctx.business_model}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab("debate")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold glass-card-3d border-white/10 hover:border-indigo-400/60 text-white shadow-lg transition-all hover-3d-tilt"
          >
            <MessageSquareQuote className="w-4 h-4 text-indigo-400" />
            <span>Debate Room</span>
          </button>

          <button
            onClick={() => onNavigateTab("advisors")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold glass-card-3d border-white/10 hover:border-amber-400/60 text-white shadow-lg transition-all hover-3d-tilt"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>6 AI Advisors</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-lg glow-primary transition-all hover-3d-tilt"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* 3D Viability Gauge */}
      <ViabilityGauge
        score={analysis.viability_score}
        marketPotential={analysis.market_potential_score}
        businessModel={analysis.business_model_score}
        financialFeasibility={analysis.financial_feasibility_score}
        riskLevel={analysis.risk_level}
      />

      {/* Startup Cost, Budget & Valuation Estimator */}
      <StartupCostCard
        finances={analysis.finances}
        startupTitle={analysis.startup_title}
      />

      {/* Extracted Context Cards in 3D Glass */}
      <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-heading font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Extracted Startup Context & Architecture</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Synthesized from founder idea</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 hover-3d-tilt transition-all">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem</span>
            <p className="text-slate-200 leading-relaxed font-medium">{ctx.problem}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 hover-3d-tilt transition-all">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Solution</span>
            <p className="text-slate-200 leading-relaxed font-medium">{ctx.solution}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 hover-3d-tilt transition-all">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Customers</span>
            <p className="text-slate-200 leading-relaxed font-medium">{ctx.target_customers}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 hover-3d-tilt transition-all">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monetization Mechanics</span>
            <p className="text-slate-200 leading-relaxed font-medium">{ctx.revenue_model} ({ctx.business_model})</p>
          </div>
        </div>

        {/* Tech Stack Pills */}
        {ctx.key_technologies && ctx.key_technologies.length > 0 && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-400">Key Tech Stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {ctx.key_technologies.map((t: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 text-indigo-300 border border-indigo-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SWOT Analysis 2x2 Grid */}
      <SWOTGrid
        strengths={analysis.strengths || []}
        weaknesses={analysis.weaknesses || []}
        opportunities={analysis.opportunities || []}
        risks={analysis.risks || []}
      />

      {/* Executive Strategic Synthesis Card */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white flex items-center justify-center shadow-md glow-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-heading font-extrabold text-white">
              Executive Strategic Verdict & Path Forward
            </h3>
            <p className="text-xs text-slate-400">
              Consolidated 6-agent advisory board consensus
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-2xl border border-white/5">
          {analysis.synthesis}
        </p>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
          <button
            onClick={() => onNavigateTab("advisors")}
            className="p-3.5 rounded-2xl glass-card-3d border-white/5 hover:border-indigo-400/50 text-left transition-all group hover-3d-tilt"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>6 Advisor Dossiers</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">VC, Lender, Legal & more</p>
          </button>

          <button
            onClick={() => onNavigateTab("debate")}
            className="p-3.5 rounded-2xl glass-card-3d border-white/5 hover:border-amber-400/50 text-left transition-all group hover-3d-tilt"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Debate Room</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-400 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Advisors challenge each other</p>
          </button>

          <button
            onClick={() => onNavigateTab("risks")}
            className="p-3.5 rounded-2xl glass-card-3d border-white/5 hover:border-rose-400/50 text-left transition-all group hover-3d-tilt"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>5×5 Risk Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-rose-400 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Impact vs Likelihood</p>
          </button>

          <button
            onClick={() => onNavigateTab("action_plan")}
            className="p-3.5 rounded-2xl glass-card-3d border-white/5 hover:border-emerald-400/50 text-left transition-all group hover-3d-tilt"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Action Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">7 / 30 / 90 days roadmap</p>
          </button>
        </div>
      </div>

    </div>
  );
};
