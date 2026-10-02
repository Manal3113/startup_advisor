import React from "react";
import { Target, FileDown } from "lucide-react";
import { AnalysisData } from "../types";
import { ActionPlanRoadmap } from "../components/dashboard/ActionPlanRoadmap";

interface ActionPlanPageProps {
  analysis: AnalysisData;
  onDownloadPdf: () => void;
}

export const ActionPlanPage: React.FC<ActionPlanPageProps> = ({
  analysis,
  onDownloadPdf,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Strategic Execution Playbook</span>
          </div>
          <h2 className="text-2xl font-heading font-black text-white tracking-tight">
            Founder Action Roadmap for {analysis.startup_title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Time-phased 7, 30, and 90-day derisking milestones mapped to specialized owner roles (Legal, Customer, Strategist, Lender, Investor).
          </p>
        </div>

        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-lg glow-primary transition-all hover-3d-tilt"
        >
          <FileDown className="w-4 h-4 text-white" />
          <span>Export Roadmap in PDF</span>
        </button>
      </div>

      <ActionPlanRoadmap actionPlan={analysis.action_plan} />
    </div>
  );
};
