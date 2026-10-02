import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { HomePage } from "./pages/HomePage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdvisorsPage } from "./pages/AdvisorsPage";
import { DebatePage } from "./pages/DebatePage";
import { KnowledgePage } from "./pages/KnowledgePage";
import { RiskPage } from "./pages/RiskPage";
import { ActionPlanPage } from "./pages/ActionPlanPage";
import { ReportsPage } from "./pages/ReportsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProcessingScreen } from "./components/common/ProcessingScreen";
import { ConnectAIModal } from "./components/settings/ConnectAIModal";
import { AnalysisData } from "./types";
import { api } from "./services/api";

export function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingIdea, setAnalyzingIdea] = useState<string>("");
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiConnected, setAiConnected] = useState<boolean>(false);
  const [aiProvider, setAiProvider] = useState<string>("groq");
  const [aiModel, setAiModel] = useState<string>("llama-3.1-8b-instant");

  // Pre-fill state for analyze form
  const [initialFormIdea, setInitialFormIdea] = useState<string>("");
  const [initialFormStage, setInitialFormStage] = useState<string>("Just an Idea");
  const [initialFormTitle, setInitialFormTitle] = useState<string>("");

  const refreshAIStatus = async () => {
    try {
      const status = await api.getSystemStatus();
      setAiConnected(Boolean(status.ai_connected || status.groq_connected));
      if (status.ai_provider) setAiProvider(status.ai_provider);
      if (status.ai_model) setAiModel(status.ai_model);
    } catch (e) {
      console.error("Status refresh error:", e);
    }
  };

  // Check system status & load latest analysis on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        await refreshAIStatus();

        // Load most recent analysis from SQLite history if available
        const history = await api.getHistory();
        if (history && history.length > 0) {
          const latest = await api.getAnalysis(history[0].id);
          setCurrentAnalysis(latest);
        }
      } catch (err) {
        console.log("App initialization note: backend might be warming up", err);
      }
    };
    initApp();
  }, []);

  const handleStartAnalysis = (payload: { raw_idea: string; stage: string; title?: string }) => {
    setAnalyzingIdea(payload.raw_idea);
    setIsAnalyzing(true);

    api.analyzeStartup(payload)
      .then((data) => {
        setCurrentAnalysis(data);
        setIsAnalyzing(false);
        setCurrentTab("dashboard");
      })
      .catch((err) => {
        alert(`Analysis error: ${err.message || "Please check backend connection"}`);
        setIsAnalyzing(false);
      });
  };

  const handleSelectSampleIdea = (ideaText: string, stage: string, title: string) => {
    setInitialFormIdea(ideaText);
    setInitialFormStage(stage);
    setInitialFormTitle(title);
    setCurrentTab("analyze");
  };

  const handleSelectHistoryAnalysis = async (id: number) => {
    try {
      const data = await api.getAnalysis(id);
      setCurrentAnalysis(data);
      setCurrentTab("dashboard");
    } catch (e: any) {
      alert(`Could not load analysis #${id}: ${e.message}`);
    }
  };

  const handleDownloadPdf = () => {
    if (!currentAnalysis) return;
    const url = api.getPdfDownloadUrl(currentAnalysis.id);
    window.open(url, "_blank");
  };

  const renderContent = () => {
    if (isAnalyzing) {
      return <ProcessingScreen ideaSnippet={analyzingIdea} />;
    }

    switch (currentTab) {
      case "home":
        return (
          <HomePage
            onStartAnalysis={() => {
              setInitialFormIdea("");
              setInitialFormTitle("");
              setCurrentTab("analyze");
            }}
            onSelectSampleIdea={handleSelectSampleIdea}
          />
        );

      case "analyze":
        return (
          <AnalyzePage
            onAnalyze={handleStartAnalysis}
            initialIdea={initialFormIdea}
            initialStage={initialFormStage}
            initialTitle={initialFormTitle}
          />
        );

      case "dashboard":
        return currentAnalysis ? (
          <DashboardPage
            analysis={currentAnalysis}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onDownloadPdf={handleDownloadPdf}
          />
        ) : (
          <AnalyzePage onAnalyze={handleStartAnalysis} />
        );

      case "advisors":
        return currentAnalysis ? (
          <AdvisorsPage analysis={currentAnalysis} />
        ) : (
          <AnalyzePage onAnalyze={handleStartAnalysis} />
        );

      case "debate":
        return currentAnalysis ? (
          <DebatePage analysis={currentAnalysis} />
        ) : (
          <AnalyzePage onAnalyze={handleStartAnalysis} />
        );

      case "knowledge":
        return <KnowledgePage currentAnalysis={currentAnalysis} />;

      case "risks":
        return currentAnalysis ? (
          <RiskPage analysis={currentAnalysis} />
        ) : (
          <AnalyzePage onAnalyze={handleStartAnalysis} />
        );

      case "action_plan":
        return currentAnalysis ? (
          <ActionPlanPage
            analysis={currentAnalysis}
            onDownloadPdf={handleDownloadPdf}
          />
        ) : (
          <AnalyzePage onAnalyze={handleStartAnalysis} />
        );

      case "reports":
        return currentAnalysis ? (
          <ReportsPage
            analysis={currentAnalysis}
            onDownloadPdf={handleDownloadPdf}
          />
        ) : (
          <AnalyzePage onAnalyze={handleStartAnalysis} />
        );

      case "history":
        return (
          <HistoryPage
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onNewAnalysis={() => {
              setInitialFormIdea("");
              setInitialFormTitle("");
              setCurrentTab("analyze");
            }}
          />
        );

      case "settings":
        return <SettingsPage onStatusUpdated={refreshAIStatus} />;

      default:
        return (
          <HomePage
            onStartAnalysis={() => setCurrentTab("analyze")}
            onSelectSampleIdea={handleSelectSampleIdea}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070B14] text-slate-100 relative cyber-grid">
      
      {/* Ambient 3D Glow Backdrops */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Fixed 3D Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab)}
        currentAnalysis={currentAnalysis}
        aiConnected={aiConnected}
        aiProvider={aiProvider}
        onOpenSettings={() => setIsAIModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          currentTab={currentTab}
          onNewIdea={() => {
            setInitialFormIdea("");
            setInitialFormTitle("");
            setCurrentTab("analyze");
          }}
          onOpenSettings={() => setIsAIModalOpen(true)}
          currentAnalysis={currentAnalysis}
          onDownloadPdf={handleDownloadPdf}
          aiConnected={aiConnected}
          aiProvider={aiProvider}
          aiModel={aiModel}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Universal AI Setup Modal */}
      <ConnectAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onConnectionSuccess={() => {
          refreshAIStatus();
        }}
        initialProvider={aiProvider}
        initialModel={aiModel}
      />
    </div>
  );
}

export default App;
