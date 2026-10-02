import React, { useEffect, useState } from "react";
import { History, Eye, ArrowRight, Calendar, Layers, ShieldAlert, Loader2, Sparkles } from "lucide-react";
import { HistoryItem } from "../types";
import { api } from "../services/api";

interface HistoryPageProps {
  onSelectAnalysis: (id: number) => void;
  onNewAnalysis: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectAnalysis,
  onNewAnalysis,
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setHistory(data);
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
        <p className="text-xs font-medium text-slate-300">Loading Analysis History from SQLite Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
            <History className="w-4 h-4 text-cyan-400" />
            <span>SQLite Local Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Analysis History ({history.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persisted founder ventures, multi-agent dialectics, and viability scores saved locally.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-400 hover:to-indigo-500 text-white shadow-lg glow-primary transition-all self-start sm:self-auto transform hover:-translate-y-0.5 active:translate-y-0"
        >
          + Analyze Another Venture
        </button>
      </div>

      {/* History Cards Grid */}
      {history.length === 0 ? (
        <div className="glass-card-3d rounded-3xl p-12 border border-slate-800/80 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-7 h-7" />
          </div>
          <p className="text-base font-bold text-white">No previous evaluations found</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Submit your first startup idea on the Analyze page to initiate the 6-agent advisory board and build your venture portfolio.
          </p>
          <button
            onClick={onNewAnalysis}
            className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-500 text-white hover:bg-primary-600 transition-all glow-primary"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            const isHighViability = item.viability_score >= 70;
            const isMediumViability = item.viability_score >= 50 && item.viability_score < 70;

            return (
              <div
                key={item.id}
                className="glass-card-3d rounded-2xl p-6 border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-950/80 text-primary-300 border border-primary-800/60">
                      {item.stage}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {dateStr}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.startup_title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 italic leading-relaxed">
                    "{item.raw_idea}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Viability</span>
                      <span className={`text-base font-black font-mono ${
                        isHighViability 
                          ? "text-emerald-400 glow-emerald" 
                          : isMediumViability 
                          ? "text-amber-400 glow-amber" 
                          : "text-rose-400 glow-rose"
                      }`}>
                        {item.viability_score}/100
                      </span>
                    </div>

                    <div className="border-l border-slate-800 pl-4">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Risk Level</span>
                      <span className="text-xs font-bold text-amber-400">
                        {item.risk_level}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectAnalysis(item.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700/60 transition-all group/btn"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
