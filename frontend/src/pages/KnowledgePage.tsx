import React, { useEffect, useState } from "react";
import { BookOpen, Search, ShieldCheck, Sparkles, Filter, FileText, Layers, Hash } from "lucide-react";
import { AnalysisData, KnowledgeDocument, RAGSource } from "../types";
import { api } from "../services/api";

interface KnowledgePageProps {
  currentAnalysis: AnalysisData | null;
}

export const KnowledgePage: React.FC<KnowledgePageProps> = ({ currentAnalysis }) => {
  const [corpus, setCorpus] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);

  useEffect(() => {
    const fetchCorpus = async () => {
      try {
        const res = await api.getKnowledgeCorpus();
        setCorpus(res.documents || []);
        if (res.documents && res.documents.length > 0) {
          setSelectedDoc(res.documents[0]);
        }
      } catch (e) {
        console.error("Failed to load knowledge corpus", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCorpus();
  }, []);

  const ragSources = currentAnalysis?.rag_sources || [];

  const filteredCorpus = corpus.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="text-left border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>RAG Neural Knowledge Vault</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
          Startup Knowledge & Statutory Corpus
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Contextual statutory schemes, regulatory frameworks (DPDP Act, Companies Act), and early-stage financing mechanisms indexed by TF-IDF to ground our autonomous advisors.
        </p>
        <p className="text-[11px] text-slate-500 mt-1 italic">
          * RAG delivers grounded context from curated policy documents to prevent hallucination.
        </p>
      </div>

      {/* RAG Sources Cited for Active Startup (if present) */}
      {ragSources.length > 0 && (
        <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Retrieved Grounding for: <span className="text-cyan-300 font-extrabold">{currentAnalysis?.startup_title}</span>
            </h3>
            <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/50">
              {ragSources.length} Grounding Citations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ragSources.map((src: RAGSource, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-cyan-500/40 hover:bg-slate-850/80 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    {src.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono glow-emerald">
                    {src.relevance_score}% Relevance
                  </span>
                </div>

                <h4 className="text-sm font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {src.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  "{src.excerpt}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Corpus Browser */}
      <div className="glass-card-3d rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h3 className="text-base sm:text-lg font-heading font-black text-white">
              Browse Local Knowledge Corpus ({corpus.length} Documents)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pre-loaded statutory policies, debt guarantee schemes, and sector frameworks.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, acts, keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-900/80 focus:bg-slate-900 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        {/* Document Master / Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Document List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[520px] overflow-y-auto pr-1.5 custom-scrollbar">
            {filteredCorpus.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-850/80 hover:border-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                    {doc.category}
                  </span>
                  <p className="text-xs sm:text-sm font-heading font-bold text-white mt-1 line-clamp-1">
                    {doc.title}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {doc.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Document Content Viewer */}
          <div className="lg:col-span-7">
            {selectedDoc ? (
              <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800/80 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    {selectedDoc.category}
                  </span>
                  <h4 className="text-lg font-heading font-black text-white mt-2">
                    {selectedDoc.title}
                  </h4>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-2 bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 font-normal">
                  {selectedDoc.content}
                </div>

                {selectedDoc.keywords && selectedDoc.keywords.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TF-IDF Vector Tokens:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoc.keywords.map((k: string, i: number) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-[10px] font-mono border border-slate-700/60">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs">
                Select a policy document to view statutory details
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
