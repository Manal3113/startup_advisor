import React from "react";
import {
  Rocket,
  Lightbulb,
  Users,
  BookOpen,
  MessageSquareQuote,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  Cpu,
  Globe
} from "lucide-react";

interface HomePageProps {
  onStartAnalysis: () => void;
  onSelectSampleIdea: (idea: string, stage: string, title: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartAnalysis,
  onSelectSampleIdea,
}) => {
  const sampleIdeas = [
    {
      title: "AgriCure AI",
      stage: "Prototype",
      industry: "AgriTech & Rural Tech",
      text: "I want to build an affordable AI application that helps small farmers identify crop diseases using their phone camera.",
    },
    {
      title: "VyaparCredit",
      stage: "MVP",
      industry: "FinTech & Micro-Lending",
      text: "A micro-credit scoring app for daily street vendors using UPI transaction histories and automated inventory reconciliation.",
    },
    {
      title: "SwasthyaDirect",
      stage: "Just an Idea",
      industry: "HealthTech Diagnostics",
      text: "An edge-AI tele-triage tablet application that equips rural community health clinics with instant vital-sign risk screening.",
    },
  ];

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      
      {/* 3D Cyber Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-card-3d p-8 sm:p-14 border border-white/10 shadow-2xl">
        
        {/* Ambient Radial Lights */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 glow-primary">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Autonomous Multi-Agent Board + Universal Key AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight leading-[1.12]">
              StartupAdvisor <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-lg sm:text-xl font-heading font-bold text-slate-300">
              Your 3D Autonomous AI Advisory Board
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              Transform raw startup pitches into high-signal venture intelligence: 6 specialized advisors, real-world dialectic debate, 5×5 risk matrix, and instant executive PDF dossiers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartAnalysis}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-xl glow-primary transition-all hover-3d-tilt group"
              >
                <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>🚀 Convene Advisory Board</span>
              </button>

              <button
                onClick={() => {
                  const s = sampleIdeas[0];
                  onSelectSampleIdea(s.text, s.stage, s.title);
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold glass-card-3d border-white/10 hover:border-amber-400/50 text-slate-200 transition-all hover-3d-tilt"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>💡 Try Sample Idea</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-4 text-xs text-slate-400 font-semibold border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 6 Autonomous Personas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Universal Key Compatible
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Snappy High-Signal Takeaways
              </span>
            </div>
          </div>

          {/* Hero 3D Interactive Diagram Node */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md glass-card-3d rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 text-center hover-3d-tilt">
              
              {/* Founder Node */}
              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 font-bold flex items-center justify-center text-xs glow-primary">
                    💡
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Founder Natural Pitch</p>
                    <p className="text-[10px] text-slate-400">Unstructured 1-paragraph idea</p>
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">Input</span>
              </div>

              <div className="text-slate-500 text-xs font-mono">↓ Context Extraction & Policy Grounding ↓</div>

              {/* 6 AI Advisors Grid in 3D */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 shadow-sm space-y-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                  Multi-Agent Advisory Board
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-left">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">💼 Investor Agent</div>
                  <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 font-semibold">🏦 Lender Agent</div>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold">📈 Chief Strategist</div>
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold">⚖️ Legal Counsel</div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">👥 Customer Voice</div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold">⚔️ Devil's Advocate</div>
                </div>
              </div>

              <div className="text-slate-500 text-xs font-mono">↓ Cross-Examination Debate & Synthesis ↓</div>

              {/* Decision Support Output Node */}
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-left flex items-center justify-between glow-emerald">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                    📊
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">High-Signal Strategic Verdict</p>
                    <p className="text-[10px] text-emerald-300">SWOT, 5×5 Matrix, 90-Day Plan & PDF</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full">Ready</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4 Core Technology Pillars in 3D Glass */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-heading font-extrabold text-white">
            Engineered for Realistic Venture Decision Support
          </h2>
          <p className="text-xs text-slate-400">
            A pipeline combining universal LLM execution, autonomous agent debate, and statutory knowledge grounding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover-3d-tilt">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center glow-amber">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-heading font-extrabold text-white">
              🤖 6 Specialized Advisors
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              VC, Credit Officer, Growth Strategist, Legal Attorney, Customer Advocate, and Ruthless Devil's Advocate.
            </p>
          </div>

          <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover-3d-tilt">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center glow-teal">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-heading font-extrabold text-white">
              📚 Contextual RAG Corpus
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TF-IDF policy citations for Startup India, MUDRA, CGTMSE, SISFS grants, and the DPDP Act 2023.
            </p>
          </div>

          <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover-3d-tilt">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center glow-blue">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-heading font-extrabold text-white">
              💬 Snappy Dialectic Debate
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crisp 1-2 sentence clashes where advisors expose blind spots and eliminate optimistic founder bias.
            </p>
          </div>

          <div className="glass-card-3d rounded-3xl p-6 border border-white/10 shadow-xl space-y-3 hover-3d-tilt">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center glow-emerald">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-heading font-extrabold text-white">
              📊 Actionable Roadmaps
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Viability gauge (0-100), 2×2 SWOT, interactive 5×5 risk matrix, and 90-day founder checklist with PDF.
            </p>
          </div>
        </div>
      </section>

      {/* Try an Example Section */}
      <section className="glass-card-3d rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-heading font-extrabold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Try an Example Startup Idea</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select one of the pre-loaded venture prompts to test the advisory board immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleIdeas.map((s, idx) => (
            <div
              key={idx}
              onClick={() => onSelectSampleIdea(s.text, s.stage, s.title)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-400/50 hover:bg-slate-900 shadow-xl transition-all cursor-pointer space-y-3 group hover-3d-tilt"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  {s.stage}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{s.industry}</span>
              </div>
              <h4 className="text-base font-heading font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                {s.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                "{s.text}"
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Analyze this concept</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
