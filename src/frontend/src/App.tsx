import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { DimensionsPage } from "./pages/DimensionsPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { LandingPage } from "./pages/LandingPage";
import { LearnMorePage } from "./pages/LearnMorePage";
import { MyDecisionTwinPage } from "./pages/MyDecisionTwinPage";
import { ReportPage } from "./pages/ReportPage";
import { ResultsPage } from "./pages/ResultsPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";

const queryClient = new QueryClient();

type Page =
  | "landing"
  | "assessment"
  | "results"
  | "report"
  | "learnmore"
  | "dimensions"
  | "howitworks"
  | "myDecisionTwin"
  | "userDashboard"
  | "adminDashboard";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNavbar = [
    "landing",
    "learnmore",
    "dimensions",
    "howitworks",
    "myDecisionTwin",
  ].includes(currentPage);

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar onNavigate={handleNavigate} />}
      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === "learnmore" && (
        <LearnMorePage onNavigate={handleNavigate} />
      )}
      {currentPage === "dimensions" && (
        <DimensionsPage onNavigate={handleNavigate} />
      )}
      {currentPage === "howitworks" && (
        <HowItWorksPage onNavigate={handleNavigate} />
      )}
      {currentPage === "assessment" && (
        <AssessmentPage onNavigate={handleNavigate} />
      )}
      {currentPage === "results" && <ResultsPage onNavigate={handleNavigate} />}
      {currentPage === "report" && <ReportPage onNavigate={handleNavigate} />}
      {currentPage === "myDecisionTwin" && (
        <MyDecisionTwinPage onNavigate={handleNavigate} />
      )}
      {currentPage === "userDashboard" && (
        <UserDashboardPage onNavigate={handleNavigate} />
      )}
      {currentPage === "adminDashboard" && (
        <AdminDashboardPage onNavigate={handleNavigate} />
      )}
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
