import React, { useState } from "react";
import { CheckSquare, Square, Calendar, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ActionPlan, ActionPlanItem } from "../../types";

interface ActionPlanRoadmapProps {
  actionPlan: ActionPlan;
}

export const ActionPlanRoadmap: React.FC<ActionPlanRoadmapProps> = ({ actionPlan }) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSection = (title: string, subtitle: string, items: ActionPlanItem[], timeBadge: string, badgeBg: string, glowClass: string) => {
    return (
      <div className={`glass-card-3d rounded-3xl p-6 sm:p-7 border border-white/10 shadow-xl space-y-4`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeBg} ${glowClass}`}>
              {timeBadge}
            </span>
            <h4 className="text-base font-heading font-extrabold text-white mt-2">{title}</h4>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono font-bold">
              {items.filter((_, idx) => completedTasks[`${timeBadge}-${idx}`]).length} / {items.length} Done
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const taskKey = `${timeBadge}-${idx}`;
            const isDone = Boolean(completedTasks[taskKey]);

            return (
              <div
                key={idx}
                onClick={() => toggleTask(taskKey)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 hover-3d-tilt ${
                  isDone
                    ? "bg-slate-950/40 border-white/5 opacity-40"
                    : "bg-slate-900/60 border-white/10 hover:border-white/20 shadow-md"
                }`}
              >
                <button className="mt-0.5 text-indigo-400 hover:text-indigo-300 transition-colors">
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${isDone ? "line-through text-slate-500" : "text-white"}`}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.priority === "High"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-white/5">
                        {item.owner_role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.task}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const plan = actionPlan || { seven_days: [], thirty_days: [], ninety_days: [] };

  return (
    <div className="space-y-6">
      {renderSection(
        "Immediate Sprint (First 7 Days)",
        "Statutory compliance, user friction testing & risk shield setup",
        plan.seven_days || [],
        "7 Days",
        "bg-rose-500/20 text-rose-300 border-rose-500/40",
        "glow-rose"
      )}

      {renderSection(
        "Validation Sprint (30 Days)",
        "Seed grant applications, institutional MOUs & customer pilots",
        plan.thirty_days || [],
        "30 Days",
        "bg-amber-500/20 text-amber-300 border-amber-500/40",
        "glow-amber"
      )}

      {renderSection(
        "Scaling Milestone (90 Days)",
        "Paid unit economics benchmarking, edge inference & pre-seed round",
        plan.ninety_days || [],
        "90 Days",
        "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        "glow-emerald"
      )}
    </div>
  );
};
