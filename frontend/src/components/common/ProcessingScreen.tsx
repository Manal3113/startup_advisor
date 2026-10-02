import React, { useEffect, useState } from "react";
import {
  Brain,
  BookOpen,
  Users,
  MessageSquareQuote,
  CheckCircle2,
  Loader2,
  Sparkles
} from "lucide-react";

interface ProcessingScreenProps {
  ideaSnippet: string;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ ideaSnippet }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 1400);
    const t2 = setTimeout(() => setCurrentStep(3), 3200);
    const t3 = setTimeout(() => setCurrentStep(4), 5800);
    const t4 = setTimeout(() => setCurrentStep(5), 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const stages = [
    {
      id: 1,
      title: "Understanding & Context Extraction",
      subtitle: "Deconstructing problem, target users, business model & technology",
      icon: Brain,
    },
    {
      id: 2,
      title: "RAG Context & Knowledge Retrieval",
      subtitle: "Indexing Startup India, MUDRA, CGTMSE, MSME & DPDP policy databases",
      icon: BookOpen,
    },
    {
      id: 3,
      title: "Convening 6 Specialized AI Advisors",
      subtitle: "Investor, Lender, Strategist, Legal Counsel, Customer Advocate, Devil's Advocate",
      icon: Users,
    },
    {
      id: 4,
      title: "Multi-Agent Cross-Evaluation & Debate",
      subtitle: "Red-team challenge rounds stress-testing assumptions and unit economics",
      icon: MessageSquareQuote,
    },
    {
      id: 5,
      title: "Strategic Synthesis & Risk Modeling",
      subtitle: "Computing viability gauge, 2×2 SWOT, 5×5 risk matrix & 90-day action plan",
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-300">
      <div className="glass-card-3d rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-8 text-center relative overflow-hidden">
        
        {/* Glow Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Visual */}
        <div className="space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-xl glow-primary animate-neon-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-white tracking-tight">
            Convening Advisory Board
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto line-clamp-2 italic font-mono bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
            "{ideaSnippet}"
          </p>
        </div>

        {/* Processing Stepper */}
        <div className="space-y-3.5 text-left pt-2 relative z-10">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = currentStep > stage.id;
            const isCurrent = currentStep === stage.id;

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  isCurrent
                    ? "bg-indigo-950/40 border-indigo-500/50 shadow-lg glow-primary ring-1 ring-indigo-400/40"
                    : isCompleted
                    ? "bg-slate-900/60 border-white/10"
                    : "bg-slate-950/20 border-white/5 opacity-30"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center glow-emerald">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-mono font-bold">
                      {stage.id}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={`text-sm font-heading font-bold ${
                    isCurrent ? "text-white" : isCompleted ? "text-slate-200" : "text-slate-500"
                  }`}>
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom indicator */}
        <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-2 relative z-10">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>Generating multi-agent dialectic & strategic risk modeling...</span>
        </div>

      </div>
    </div>
  );
};
