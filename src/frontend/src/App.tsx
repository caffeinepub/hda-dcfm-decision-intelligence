import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { DimensionsPage } from "./pages/DimensionsPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { InvestorShowcasePage } from "./pages/InvestorShowcasePage";
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
  | "adminDashboard"
  | "showcase";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  // Use a ref to ensure auto-nav only fires once per session load
  const autoNavFired = useRef(false);

  useEffect(() => {
    if (isInitializing || autoNavFired.current || !actor) return;
    const isAuthenticated =
      !!identity && !identity.getPrincipal().isAnonymous();
    if (!isAuthenticated) return;

    autoNavFired.current = true;

    const hash = window.location.hash;
    const hasAdminToken = hash.includes("caffeineAdminToken");

    if (hasAdminToken) {
      // Fix 2: Blank page on admin token URL — redirect properly
      window.history.replaceState(null, "", window.location.pathname);
      actor
        .isCallerAdmin()
        .then((isAdmin) => {
          setCurrentPage(isAdmin ? "adminDashboard" : "userDashboard");
        })
        .catch(() => setCurrentPage("userDashboard"));
      return;
    }

    // Fix 3: Returning logged-in users go straight to their dashboard
    actor
      .hasCompletedProfile()
      .then((done) => {
        if (done) setCurrentPage("userDashboard");
      })
      .catch(() => {});
  }, [identity, isInitializing, actor]);

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
      {currentPage === "showcase" && (
        <InvestorShowcasePage onNavigate={handleNavigate} />
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
