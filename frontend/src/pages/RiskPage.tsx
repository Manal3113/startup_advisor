import React from "react";
import { AlertTriangle } from "lucide-react";
import { AnalysisData } from "../types";
import { RiskMatrix } from "../components/dashboard/RiskMatrix";

interface RiskPageProps {
  analysis: AnalysisData;
}

export const RiskPage: React.FC<RiskPageProps> = ({ analysis }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="text-left border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Venture Vulnerability Diagnostics</span>
        </div>
        <h2 className="text-2xl font-heading font-black text-white tracking-tight">
          Risk Assessment & Mitigation Matrix for {analysis.startup_title}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Comprehensive Impact × Likelihood scoring across Market, Financial, Competitive, Regulatory, Customer, Operational, and Technological vectors.
        </p>
      </div>

      <RiskMatrix risks={analysis.risk_matrix || []} />
    </div>
  );
};
