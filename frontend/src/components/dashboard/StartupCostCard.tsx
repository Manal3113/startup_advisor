import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight,
  Info,
  Calendar,
  CreditCard,
  Target
} from "lucide-react";
import { StartupFinances } from "../../types";

interface StartupCostCardProps {
  finances?: StartupFinances;
  startupTitle: string;
}

export const StartupCostCard: React.FC<StartupCostCardProps> = ({ finances, startupTitle }) => {
  const [activeTab, setActiveTab] = useState<"launch" | "monthly">("launch");

  if (!finances) return null;

  const launchItems = finances.launch_budget_items || [
    { item: "App / Website Prototype", cost: "₹60,000 - ₹1,20,000", explanation: "Building first working version with core features" },
    { item: "Cloud Hosting & AI Setup", cost: "₹15,000 - ₹30,000", explanation: "Database and AI processing credits" },
    { item: "Company Setup & Basic Legal", cost: "₹15,000 - ₹25,000", explanation: "Registration, website domain, and user privacy terms" },
    { item: "Initial Marketing to 100 Users", cost: "₹40,000 - ₹75,000", explanation: "Direct personal outreach to get first real users" }
  ];

  const monthlyItems = finances.monthly_cost_items || [
    { item: "Cloud Hosting & Database", cost: "₹5,000 - ₹10,000/mo", explanation: "Keeping the app fast and always online" },
    { item: "AI API Processing Fees", cost: "₹5,000 - ₹15,000/mo", explanation: "Cost paid per user query to AI models" },
    { item: "User Support & Maintenance", cost: "₹5,000 - ₹10,000/mo", explanation: "Fixing bugs and helping users" }
  ];

  return (
    <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background glow decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Founder Financial Clarity & Valuation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight flex items-center gap-2">
            <span>Startup Cost, Budget & Net Worth</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Realistic, plain-English budget planning for <b className="text-slate-200">{startupTitle}</b>. What it costs to start, monthly bills, what to charge customers, and what your business is worth.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-emerald-400 glow-emerald self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Jargon Financial Model</span>
        </div>
      </div>

      {/* 4 Core Financial Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        
        {/* 1. Launch Budget */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Launch Budget</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 glow-emerald group-hover:scale-105 transition-transform origin-left">
            {finances.launch_budget}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Starting money needed to build prototype & launch to first 50 users.
          </p>
        </div>

        {/* 2. Monthly Running Cost */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/10 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Bill</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-400 glow-amber group-hover:scale-105 transition-transform origin-left">
            {finances.monthly_running_cost}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Monthly server hosting, AI API usage, and ongoing tool costs.
          </p>
        </div>

        {/* 3. Recommended Customer Price */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">What to Charge</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-cyan-400 glow-cyan group-hover:scale-105 transition-transform origin-left">
            {finances.pricing_recommendation}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Cost per user: <b className="text-slate-200">{finances.cost_per_user}</b> (leaves 70%+ profit).
          </p>
        </div>

        {/* 4. Business Valuation */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-primary-500/50 hover:shadow-primary-500/10 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Worth</span>
            <TrendingUp className="w-4 h-4 text-primary-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-primary-400 glow-primary group-hover:scale-105 transition-transform origin-left">
            {finances.estimated_valuation}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Pre-revenue idea worth. 3-Year potential: <b className="text-emerald-400">{finances.three_year_potential_worth}</b>.
          </p>
        </div>

      </div>

      {/* Itemized Cost Breakdown Tabs */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Exact Cost Breakdown (Where the Money Goes)
            </h4>
          </div>

          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("launch")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "launch"
                  ? "bg-emerald-500 text-slate-950 shadow-sm font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🚀 Launch Expenses
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "monthly"
                  ? "bg-amber-500 text-slate-950 shadow-sm font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📅 Monthly Expenses
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(activeTab === "launch" ? launchItems : monthlyItems).map((exp, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-200 block">
                  {exp.item}
                </span>
                <span className="text-[11px] text-slate-400 leading-relaxed block">
                  {exp.explanation}
                </span>
              </div>
              <span className={`text-xs font-mono font-bold shrink-0 px-2.5 py-1 rounded-lg ${
                activeTab === "launch" 
                  ? "text-emerald-400 bg-emerald-950/60 border border-emerald-800/40" 
                  : "text-amber-400 bg-amber-950/60 border border-amber-800/40"
              }`}>
                {exp.cost}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Break-Even Target & Plain English Founder Advice */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
        
        {/* Break-even timeline & grant target */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Break-Even Goal</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block">Time to become profitable:</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">
              {finances.break_even_timeline}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Recommended Funding Target:</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {finances.fundraising_goal}
            </span>
          </div>
        </div>

        {/* Plain English Founder Advice */}
        <div className="md:col-span-7 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-300 shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Mentor's Golden Rule for Early Founders
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {finances.plain_english_advice || "Start small with a working prototype. Keep your monthly costs under ₹25,000 until you have at least 50 happy paying users."}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
