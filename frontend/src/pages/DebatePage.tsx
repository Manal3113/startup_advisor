import React, { useEffect, useState } from "react";
import { MessageSquareQuote, Loader2 } from "lucide-react";
import { AnalysisData, DebateData } from "../types";
import { DebateRoom } from "../components/debate/DebateRoom";
import { api } from "../services/api";

interface DebatePageProps {
  analysis: AnalysisData;
}

export const DebatePage: React.FC<DebatePageProps> = ({ analysis }) => {
  const [debate, setDebate] = useState<DebateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadDebate = async () => {
      try {
        const data = await api.getAnalysisDebate(analysis.id);
        if (mounted) setDebate(data);
      } catch (e) {
        console.error("Failed to load debate data", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDebate();
    return () => { mounted = false; };
  }, [analysis.id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-400" />
        <p className="text-xs font-semibold text-slate-300">Replaying Multi-Agent Debate Turns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <DebateRoom debate={debate} />
    </div>
  );
};
