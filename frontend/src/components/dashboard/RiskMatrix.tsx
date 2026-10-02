import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, X, ChevronRight, Layers, ShieldAlert, Sparkles } from "lucide-react";
import { RiskItem } from "../../types";

interface RiskMatrixProps {
  risks: RiskItem[];
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(risks[0] || null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Market", "Financial", "Competition", "Legal", "Customer", "Operational", "Technology"];

  const filteredRisks = activeCategory === "All"
    ? risks
    : risks.filter(r => r.category.toLowerCase() === activeCategory.toLowerCase());

  const getSeverityBadge = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 15) return "bg-rose-500/20 text-rose-300 border-rose-500/40 glow-rose";
    if (score >= 9) return "bg-amber-500/20 text-amber-300 border-amber-500/40 glow-amber";
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-emerald";
  };

  const getHeatmapCellColor = (i: number, l: number) => {
    const score = i * l;
    if (score >= 16) return "bg-rose-900/40 border-rose-500/50 hover:bg-rose-850/60";
    if (score >= 12) return "bg-rose-950/30 border-rose-500/30 hover:bg-rose-900/40";
    if (score >= 8) return "bg-amber-900/30 border-amber-500/40 hover:bg-amber-850/50";
    if (score >= 5) return "bg-amber-950/20 border-amber-500/20 hover:bg-amber-900/30";
    return "bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-900/30";
  };

  return (
    <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-heading font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>5×5 Interactive Risk Matrix (Impact × Likelihood)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click any matrix cell or list item to inspect root causes, severity ratings, and mitigations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-md glow-primary font-bold"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 5x5 Heatmap Visual Grid */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Criticality Heatmap Grid</span>
            <span className="text-[10px] text-slate-500 font-mono">5×5 Model</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2">
            {/* Grid Header (Likelihood) */}
            <div className="grid grid-cols-6 gap-1.5 text-center text-[10px] font-bold text-slate-500">
              <span className="text-left font-mono">Imp \ Lik</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>

            {/* Grid Rows (5 to 1) */}
            {[5, 4, 3, 2, 1].map((impactVal) => (
              <div key={impactVal} className="grid grid-cols-6 gap-1.5 items-center">
                <span className="text-[10px] font-bold text-slate-400 text-left font-mono">{impactVal}</span>
                {[1, 2, 3, 4, 5].map((likeVal) => {
                  const matchingRisks = risks.filter(
                    (r) => r.impact === impactVal && r.likelihood === likeVal
                  );
                  const isSelected = selectedRisk && selectedRisk.impact === impactVal && selectedRisk.likelihood === likeVal;

                  return (
                    <div
                      key={likeVal}
                      onClick={() => {
                        if (matchingRisks.length > 0) setSelectedRisk(matchingRisks[0]);
                      }}
                      className={`h-11 rounded-xl border flex items-center justify-center font-bold text-xs transition-all cursor-pointer relative ${getHeatmapCellColor(
                        impactVal,
                        likeVal
                      )} ${isSelected ? "ring-2 ring-indigo-400 shadow-lg scale-105 z-10" : ""}`}
                    >
                      {matchingRisks.length > 0 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-900/90 text-white flex items-center justify-center text-[11px] font-mono font-bold shadow-sm border border-white/20">
                          {matchingRisks.length}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
              <span>Vertical: Impact Severity (1=Low, 5=Catastrophic)</span>
              <span>Horizontal: Likelihood (1=Rare, 5=Almost Certain)</span>
            </div>
          </div>
        </div>

        {/* Risk Detail Inspector Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>Diligence Drill-Down Inspector</span>
            {selectedRisk && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(selectedRisk.impact, selectedRisk.likelihood)}`}>
                Score: {selectedRisk.impact * selectedRisk.likelihood} / 25
              </span>
            )}
          </div>

          {selectedRisk ? (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 shadow-xl space-y-4 hover-3d-tilt transition-all">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 block mb-0.5">
                    {selectedRisk.category} Risk Vector
                  </span>
                  <h4 className="text-base font-heading font-extrabold text-white">
                    {selectedRisk.title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Severity</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    Impact: {selectedRisk.impact}/5 • Likelihood: {selectedRisk.likelihood}/5
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 block mb-0.5">Specific Risk Scenario:</span>
                  <p className="text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    {selectedRisk.description}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-amber-400 block mb-0.5">Business & Capital Impact:</span>
                  <p className="text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    {selectedRisk.why_it_matters}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Actionable Founder Mitigation Playbook:</span>
                  </div>
                  <p className="text-emerald-200 leading-relaxed pl-5 font-sans">
                    {selectedRisk.suggested_mitigation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 border border-white/5 rounded-2xl">
              Select a risk item to view root causes and mitigations
            </div>
          )}

          {/* Quick List of Filtered Risks */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredRisks.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRisk(r)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  selectedRisk?.id === r.id
                    ? "bg-indigo-950/40 border-indigo-500/50 text-white font-bold"
                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase">{r.category}:</span>
                  <span className="truncate">{r.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
