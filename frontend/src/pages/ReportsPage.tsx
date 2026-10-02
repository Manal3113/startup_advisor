import React from "react";
import { FileText, FileDown, CheckCircle2, ShieldCheck, Sparkles, Printer, ExternalLink, Download } from "lucide-react";
import { AnalysisData } from "../types";

interface ReportsPageProps {
  analysis: AnalysisData;
  onDownloadPdf: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  analysis,
  onDownloadPdf,
}) => {
  const sections = [
    "1. Startup Overview & Problem Statement",
    "2. Extracted Structural Context (Model, Unit Economics, Tech Stack)",
    "3. Composite AI Viability Score & 3D Gauge Metrics",
    "4. Strategic 2×2 SWOT Matrix (Defensibility & Vulnerabilities)",
    "5. Investor Agent Diligence & 10x Scalability Thesis",
    "6. Commercial Lender Credit & Debt Financing Feasibility",
    "7. Business Strategist GTM & B2B Distribution Roadmap",
    "8. Legal & Compliance Audit (DPDP Act, IP & Regulatory Grounding)",
    "9. Customer Advocate Friction Analysis & Empathy Audit",
    "10. Devil's Advocate Failure Modes & Threat Stress-Testing",
    "11. Snappy Multi-Agent Dialectic & Cross-Examination Clashes",
    "12. Board Synthesis Consensus & Execution Mandate",
    "13. 5×5 Interactive Impact × Likelihood Risk Heatmap",
    "14. High-Impact 7 / 30 / 90-Day Action Execution Roadmap",
    "15. Contextual RAG Statutory Scheme Citations (Startup India, MUDRA)",
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="text-left border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Executive Intelligence Dossier</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          Executive Advisory PDF Report
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete publication-grade PDF report compiled with high-signal advisor findings, cross-examination debate highlights, and statutory citations.
        </p>
      </div>

      {/* Main Report Card Preview */}
      <div className="glass-card-3d rounded-3xl p-8 sm:p-10 border border-slate-800/80 shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-primary-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800/80 pb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-primary-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/10">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 glow-emerald">
                  Ready to Export
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                  Viability: {analysis.viability_score}/100
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-black text-white mt-1.5">
                {analysis.startup_title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated: {new Date(analysis.created_at).toLocaleString()} • Model: Multi-Agent Board
              </p>
            </div>
          </div>

          <button
            onClick={onDownloadPdf}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary-500 via-indigo-500 to-cyan-500 hover:from-primary-400 hover:to-cyan-400 text-white shadow-lg glow-primary hover:shadow-cyan-500/25 transition-all group shrink-0 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>📄 Download Full Startup Report</span>
          </button>
        </div>

        {/* Report Contents Index */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Document Sections & High-Signal Grounding
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">15 Curated Sections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            {sections.map((sec, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all group"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate group-hover:text-white transition-colors">{sec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3.5 text-xs text-slate-400 relative z-10">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <b className="text-slate-200">Executive Disclaimer:</b> This document integrates cross-examined intelligence from 6 autonomous AI advisors grounded in local regulatory and startup scheme corpora. It is formatted for direct presentation to venture funds, angel syndicates, and grant committees. AI-generated legal and financial outputs provide strategic direction and do not substitute certified legal or auditor review.
          </p>
        </div>

      </div>
    </div>
  );
};
