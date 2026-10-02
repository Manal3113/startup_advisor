import React, { useState } from "react";
import {
  MessageSquare,
  ShieldAlert,
  CheckCheck,
  Scale,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  HelpCircle,
  Zap,
  Flame,
  Swords,
  Shield,
  Handshake
} from "lucide-react";
import { DebateData, DebateTurn } from "../../types";

interface DebateRoomProps {
  debate: DebateData | null;
}

export const DebateRoom: React.FC<DebateRoomProps> = ({ debate }) => {
  const [filterSentiment, setFilterSentiment] = useState<string>("all");

  if (!debate) {
    return (
      <div className="glass-card-3d rounded-3xl p-12 text-center text-slate-400 border border-white/10">
        <MessageSquare className="w-10 h-10 mx-auto text-slate-500 mb-3" />
        <p className="text-base font-bold text-white">No active debate session found</p>
        <p className="text-xs text-slate-400 mt-1">Run an analysis to watch the 6 AI advisors challenge each other</p>
      </div>
    );
  }

  const turns = debate.debate_content || [];
  const synthesis = debate.synthesis || {
    consensus: [],
    disagreements: [],
    critical_assumptions: [],
    key_risks: [],
    strategic_mandate: ""
  };

  const getSentimentChip = (sentiment?: string) => {
    switch (sentiment) {
      case "challenge":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Swords className="w-3 h-3 text-rose-400" />
            <span>Challenge</span>
          </span>
        );
      case "defense":
      case "counter":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>Counter</span>
          </span>
        );
      case "agreement":
      case "concurrence":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <Handshake className="w-3 h-3 text-emerald-400" />
            <span>Concurrence</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
            💬 Synthesis
          </span>
        );
    }
  };

  const filteredTurns = filterSentiment === "all"
    ? turns
    : turns.filter((t) => (t.sentiment || "neutral").includes(filterSentiment));

  return (
    <div className="space-y-8">
      
      {/* 3D Glass Header */}
      <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 mb-2 glow-primary">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Live Cross-Agent Dialectic
          </div>
          <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
            Multi-Agent Advisory Board Debate
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Advisors challenge each other in crisp 1-2 sentence clashes to eliminate bias and unvalidated assumptions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-white/10 text-xs">
          <button
            onClick={() => setFilterSentiment("all")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterSentiment === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            All Turns ({turns.length})
          </button>
          <button
            onClick={() => setFilterSentiment("challenge")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filterSentiment === "challenge" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Clashes Only
          </button>
        </div>
      </div>

      {/* Founder Strategic Mandate Hero */}
      {synthesis.strategic_mandate && (
        <div className="glass-card-3d rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 shadow-xl flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 glow-amber">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
              Consolidated Founder Mandate
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {synthesis.strategic_mandate}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Speech Bubbles Timeline */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-white/10 before:hidden sm:before:block">
        {filteredTurns.map((turn: DebateTurn, idx: number) => {
          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start gap-4 relative transition-all group"
            >
              {/* Glowing Avatar Bubble */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-extrabold shadow-lg shrink-0 z-10 border border-white/20 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: turn.avatar_color || "#3B82F6",
                  boxShadow: `0 0 16px ${turn.avatar_color}40`
                }}
              >
                {turn.agent_name.slice(0, 2).toUpperCase()}
              </div>

              {/* 3D Glass Speech Bubble */}
              <div className="flex-1 glass-card-3d rounded-2xl p-5 border border-white/10 hover:border-white/20 shadow-xl transition-all space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-white text-sm">
                      {turn.agent_name}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden md:inline">
                      ({turn.role_title})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {turn.targeted_agent && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium bg-slate-950/60 px-2.5 py-0.5 rounded-lg border border-white/5">
                        <span>to {turn.targeted_agent}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </span>
                    )}
                    {getSentimentChip(turn.sentiment)}
                  </div>
                </div>

                {/* Punchy Snappy Argument */}
                <p className="text-sm font-medium text-slate-200 leading-relaxed font-sans">
                  "{turn.message}"
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5">
                  <span>Round {turn.round_number || 1} Cross-Examination</span>
                  <span className="font-mono text-indigo-400 font-bold">Turn #{idx + 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis 3D Matrix Card */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg glow-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-heading font-extrabold text-white">
              Synthesis Agent Consensus Report
            </h4>
            <p className="text-xs text-slate-400">
              Cross-examination resolution & strategic trade-offs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Consensus */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCheck className="w-4 h-4" />
              <span>Unanimous Consensus Points</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {(synthesis.consensus || []).map((pt: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disagreements */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Scale className="w-4 h-4" />
              <span>Strategic Tensions & Trade-Offs</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {(synthesis.disagreements || []).map((pt: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Assumptions */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-400">
              <HelpCircle className="w-4 h-4" />
              <span>Critical Make-or-Break Assumptions</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {(synthesis.critical_assumptions || []).map((pt: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Systemic Risks */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Priority Red-Flag Risks</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {(synthesis.key_risks || []).map((pt: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
