import React, { useState } from "react";
import { Rocket, Lightbulb, Sparkles, Layers, Tag, ArrowRight } from "lucide-react";

interface AnalyzePageProps {
  onAnalyze: (payload: { raw_idea: string; stage: string; title?: string }) => void;
  initialIdea?: string;
  initialStage?: string;
  initialTitle?: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onAnalyze,
  initialIdea = "",
  initialStage = "Just an Idea",
  initialTitle = "",
}) => {
  const [idea, setIdea] = useState(initialIdea);
  const [stage, setStage] = useState(initialStage);
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState("");

  const sampleIdeas = [
    {
      title: "AgriCure AI",
      stage: "Prototype",
      text: "I want to build an affordable AI application that helps small farmers identify crop diseases using their phone camera.",
    },
    {
      title: "VyaparCredit",
      stage: "MVP",
      text: "A micro-credit scoring app for daily street vendors using UPI transaction histories and automated inventory reconciliation.",
    },
    {
      title: "EduVernacular",
      stage: "Just an Idea",
      text: "An adaptive voice-first vernacular tutoring platform that helps first-generation college students master engineering mathematics.",
    },
  ];

  const handleTryExample = () => {
    const currentIdx = sampleIdeas.findIndex((s) => s.text === idea);
    const nextIdx = (currentIdx + 1) % sampleIdeas.length;
    const s = sampleIdeas[nextIdx];
    setIdea(s.text);
    setStage(s.stage);
    setTitle(s.title);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || idea.trim().length < 15) {
      setError("Please describe your startup idea in at least a few sentences (minimum 15 characters).");
      return;
    }
    setError("");
    onAnalyze({
      raw_idea: idea.trim(),
      stage: stage,
      title: title.trim() || undefined,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 animate-in fade-in duration-300">
      <div className="glass-card-3d rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-left space-y-2 border-b border-white/10 pb-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 glow-primary">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Natural Language Pitch Input
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Tell us about your startup venture
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            No complex 20-page forms required. Describe what you're building in your own natural words, and our 6 AI advisors will convene to analyze, stress-test, and debate your idea.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Main Idea Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                Describe your startup idea in plain language...
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {idea.length} characters
              </span>
            </div>

            <textarea
              rows={5}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., I want to build an affordable AI application that helps small farmers identify crop diseases using their phone camera..."
              className="w-full p-4 rounded-2xl border border-white/10 bg-slate-950/70 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base text-white leading-relaxed transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          {/* Optional Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Project Title (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>Project Name / Title (Optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AgriCure AI (Auto-extracted if blank)"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium text-white placeholder:text-slate-600"
              />
            </div>

            {/* Startup Stage Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Current Venture Stage</span>
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/60 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium text-white"
              >
                <option value="Just an Idea" className="bg-slate-900 text-white">Just an Idea (Concept Validation)</option>
                <option value="Prototype" className="bg-slate-900 text-white">Prototype (Early Demo / Wireframe)</option>
                <option value="MVP" className="bg-slate-900 text-white">MVP (Minimum Viable Product)</option>
                <option value="Early Revenue" className="bg-slate-900 text-white">Early Revenue (Paying Customers)</option>
                <option value="Growth" className="bg-slate-900 text-white">Growth (Scaling Operations)</option>
              </select>
            </div>

          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleTryExample}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold glass-card-3d border-white/10 hover:border-amber-400/50 text-slate-300 hover:text-white transition-all hover-3d-tilt"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>💡 Load Sample Idea</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-xl glow-primary transition-all hover-3d-tilt group"
            >
              <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>Convene Advisory Board</span>
            </button>
          </div>

        </form>

        {/* Automatic Extraction Breakdown Note */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-xs text-slate-400 space-y-2">
          <p className="font-bold text-slate-300">What the AI Advisory Board extracts automatically:</p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Industry & Sector</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Core Problem Friction</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Proposed Solution</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Target Customer Profile</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Business Model (B2B/B2C/B2B2C)</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Revenue Mechanics</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300">Key Technologies</span>
          </div>
        </div>

      </div>
    </div>
  );
};
