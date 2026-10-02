import React from "react";
import { CheckCircle2, AlertCircle, Sparkles, ShieldAlert } from "lucide-react";

interface SWOTGridProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
}

export const SWOTGrid: React.FC<SWOTGridProps> = ({
  strengths,
  weaknesses,
  opportunities,
  risks,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
          <span>Strategic SWOT Analysis</span>
        </h3>
        <span className="text-xs text-slate-400 font-medium">Cross-agent consolidated 2×2</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Strengths */}
        <div className="glass-card-3d rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20 shadow-xl hover-3d-tilt transition-all">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 glow-emerald">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-white">Strengths</h4>
              <p className="text-[11px] text-emerald-400 font-medium">Internal advantages & moats</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold text-sm leading-none">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-card-3d rounded-2xl p-5 border border-rose-500/30 bg-rose-950/20 shadow-xl hover-3d-tilt transition-all">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 glow-rose">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-white">Weaknesses</h4>
              <p className="text-[11px] text-rose-400 font-medium">Internal vulnerabilities & gaps</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold text-sm leading-none">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="glass-card-3d rounded-2xl p-5 border border-cyan-500/30 bg-cyan-950/20 shadow-xl hover-3d-tilt transition-all">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 glow-cyan">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-white">Opportunities</h4>
              <p className="text-[11px] text-cyan-400 font-medium">External tailwinds & upside</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold text-sm leading-none">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="glass-card-3d rounded-2xl p-5 border border-amber-500/30 bg-amber-950/20 shadow-xl hover-3d-tilt transition-all">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 glow-amber">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-white">Risks & Threats</h4>
              <p className="text-[11px] text-amber-400 font-medium">External headwinds & competition</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {risks.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold text-sm leading-none">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
