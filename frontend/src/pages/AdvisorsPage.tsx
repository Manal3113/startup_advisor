import React, { useEffect, useState } from "react";
import { Users, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { AnalysisData, AgentResultItem } from "../types";
import { AdvisorDossier } from "../components/advisors/AdvisorDossier";
import { api } from "../services/api";

interface AdvisorsPageProps {
  analysis: AnalysisData;
}

export const AdvisorsPage: React.FC<AdvisorsPageProps> = ({ analysis }) => {
  const [agents, setAgents] = useState<AgentResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadAgents = async () => {
      try {
        const data = await api.getAnalysisAgents(analysis.id);
        if (mounted) setAgents(data);
      } catch (e) {
        console.error("Failed to load agent results", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadAgents();
    return () => { mounted = false; };
  }, [analysis.id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-400" />
        <p className="text-xs font-semibold text-slate-300">Convening 6 Specialized AI Advisory Dossiers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="text-left border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
          <Users className="w-4 h-4 text-amber-400" />
          <span>Independent Advisory Board</span>
        </div>
        <h2 className="text-2xl font-heading font-black text-white tracking-tight flex items-center gap-2">
          <span>Specialized Perspectives for {analysis.startup_title}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Six autonomous expert personas evaluating your venture from investment returns, debt safety, GTM economics, legal compliance, customer empathy, and lethal failure modes.
        </p>
      </div>

      <AdvisorDossier agents={agents} />
    </div>
  );
};
