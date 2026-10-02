import React from "react";
import { Award, ShieldAlert, TrendingUp, Sparkles } from "lucide-react";

interface ViabilityGaugeProps {
  score: number;
  marketPotential: number;
  businessModel: number;
  financialFeasibility: number;
  riskLevel: string;
}

export const ViabilityGauge: React.FC<ViabilityGaugeProps> = ({
  score,
  marketPotential,
  businessModel,
  financialFeasibility,
  riskLevel,
}) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 75) return "#10B981"; // emerald neon
    if (val >= 60) return "#F59E0B"; // amber neon
    return "#F43F5E"; // rose neon
  };

  const getScoreLabel = (val: number) => {
    if (val >= 80) return "High Viability & Strong Market Fit";
    if (val >= 70) return "Promising Potential with Validation Needs";
    if (val >= 60) return "Moderate Viability — Critical Pivots Advised";
    return "High Vulnerability — Fundamental Re-scoping Needed";
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="glass-card-3d rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* Background Neon Sheen */}
      <div
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: scoreColor }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Main 3D Gauge Visual */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Subtle Outer Track */}
              <circle
                cx="80"
                cy="80"
                r={radius + 4}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="2"
                fill="none"
              />
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="12"
                fill="none"
              />
              {/* Animated Glowing Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={scoreColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: `drop-shadow(0 0 10px ${scoreColor}80)`,
                  transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              />
            </svg>
            
            {/* Center Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-heading font-black text-white tracking-tight drop-shadow-md">
                {score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                out of 100
              </span>
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 glow-emerald">
              <Award className="w-3.5 h-3.5" />
              <span>Viability Assessment</span>
            </div>
            <h3 className="text-lg font-heading font-extrabold text-white tracking-tight">
              {getScoreLabel(score)}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consolidated score rating your idea's customer demand, launch budget feasibility, and profit potential.
            </p>
          </div>
        </div>

        {/* 4 Glowing Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          
          {/* Market Potential */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 text-center min-w-[110px] hover-3d-tilt transition-all">
            <p className="text-[10px] uppercase font-bold text-slate-400">Market Potential</p>
            <p className="text-xl font-heading font-black text-amber-400 mt-1">{marketPotential}%</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-700 glow-amber"
                style={{ width: `${marketPotential}%` }}
              />
            </div>
          </div>

          {/* Business Model */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-teal-500/20 text-center min-w-[110px] hover-3d-tilt transition-all">
            <p className="text-[10px] uppercase font-bold text-slate-400">Business Model</p>
            <p className="text-xl font-heading font-black text-teal-400 mt-1">{businessModel}%</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-teal-400 h-full rounded-full transition-all duration-700 glow-teal"
                style={{ width: `${businessModel}%` }}
              />
            </div>
          </div>

          {/* Financial Feasibility */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/20 text-center min-w-[110px] hover-3d-tilt transition-all">
            <p className="text-[10px] uppercase font-bold text-slate-400">Financial Feasibility</p>
            <p className="text-xl font-heading font-black text-emerald-400 mt-1">{financialFeasibility}%</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700 glow-emerald"
                style={{ width: `${financialFeasibility}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-rose-500/20 text-center min-w-[110px] hover-3d-tilt transition-all">
            <p className="text-[10px] uppercase font-bold text-slate-400">Risk Level</p>
            <p className="text-xl font-heading font-black text-rose-400 mt-1">{riskLevel}</p>
            <div className="inline-flex items-center gap-1 text-[10px] text-rose-400 mt-1.5 font-bold">
              <ShieldAlert className="w-3 h-3" />
              <span>Stress-Tested</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
