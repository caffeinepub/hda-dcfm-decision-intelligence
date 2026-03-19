import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AssessmentPage } from "./pages/AssessmentPage";
import { LandingPage } from "./pages/LandingPage";
import { LearnMorePage } from "./pages/LearnMorePage";
import { ReportPage } from "./pages/ReportPage";
import { ResultsPage } from "./pages/ResultsPage";

const queryClient = new QueryClient();

type Page = "landing" | "assessment" | "results" | "report" | "learnmore";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNavbar = currentPage === "landing" || currentPage === "learnmore";

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar onNavigate={handleNavigate} />}

      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === "learnmore" && (
        <LearnMorePage onNavigate={handleNavigate} />
      )}
      {currentPage === "assessment" && (
        <AssessmentPage onNavigate={handleNavigate} />
      )}
      {currentPage === "results" && <ResultsPage onNavigate={handleNavigate} />}
      {currentPage === "report" && <ReportPage onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
