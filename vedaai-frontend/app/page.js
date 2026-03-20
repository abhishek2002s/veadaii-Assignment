"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { HomePage } from "./components/HomePage";
import { PlaceholderPage } from "./components/PlaceholderPage";
import {
  AssignmentsView,
  EmptyAssignments,
} from "./components/AssignmentsView";
import { CreateAssignmentView } from "./components/CreateAssignmentView";
import { GeneratingView } from "./components/GeneratingView";
import { OutputView } from "./components/OutputView";
import { LoginView } from "./components/LoginView";
import { SAMPLE_ASSIGNMENTS } from "./constants";
import { generatePaper, getFallback, api } from "./lib/api";
import {
  MobileHeader,
  MobileBottomNav,
  FloatingAddButton,
} from "./components/MobileNav";

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("home");
  const [userAssignments, setUserAssignments] = useState([]);
  const [paper, setPaper] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for login token
    const token = localStorage.getItem("vedaai_token");
    if (token) {
      setIsLoggedIn(true);
      fetchAssignments();
    } else {
      setLoading(false);
    }

    // Responsive check
    const checkMobile = () => {
      const isNarrow = window.innerWidth < 768;
      setIsMobile(isNarrow);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.listAssignments();
      // If the real API works, we use it. Otherwise, we keep our mock defaults.
      if (res && res.data) setUserAssignments(res.data);
    } catch (err) {
      console.warn("Could not fetch real assignments:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const onNavigate = (dest) => {
    if (dest === "assignments")
      setView(allAssignments.length > 0 ? "assignments" : "empty");
    else setView(dest);
  };

  const handleGenerate = async (cfg) => {
    setConfig(cfg);
    setView("generating");
    const p = await generatePaper(cfg);
    setPaper(p);
    // After generation, we re-fetch to see the new entry if backend worked
    await fetchAssignments();
    setView("output");
  };

  const handleBack = () => {
    if (view === "create")
      setView(allAssignments.length > 0 ? "assignments" : "empty");
    else if (view === "output") setView("assignments");
    else setView("home");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4f4",
          fontFamily: "var(--font-manrope)",
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        VedaAI...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginView
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          fetchAssignments();
        }}
      />
    );
  }

  const allAssignments = [...SAMPLE_ASSIGNMENTS, ...userAssignments];
  const topBarLabels = {
    home: "Home",
    assignments: "Assignment",
    empty: "Assignment",
    create: "Assignment",
    generating: "Assignment",
    output: "Create New",
    groups: "My Groups",
    toolkit: "AI Teacher's Toolkit",
    library: "My Library",
  };
  const showBack = !["home", "groups", "toolkit", "library"].includes(view);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f4f4" }}>
      {!isMobile && <Sidebar view={view} onNavigate={onNavigate} />}
      <main
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 260,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingBottom: isMobile ? 120 : 0, // space for mobile nav
        }}
      >
        {isMobile ? (
          <MobileHeader />
        ) : (
          <TopBar
            label={topBarLabels[view] || "Assignment"}
            onBack={handleBack}
            showBack={showBack}
          />
        )}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {view === "home" && (
            <HomePage isMobile={isMobile} onNavigate={onNavigate} />
          )}
          {view === "groups" && (
            <PlaceholderPage
              title="My Groups"
              icon="groups"
              description="Create and manage student groups. Assign work to specific classes, track progress, and collaborate easily."
            />
          )}
          {view === "toolkit" && (
            <PlaceholderPage
              title="AI Teacher's Toolkit"
              icon="toolkit"
              description="Access AI-powered tools to create rubrics, grade essays, generate lesson plans, and much more."
            />
          )}
          {view === "library" && (
            <PlaceholderPage
              title="My Library"
              icon="library"
              description="All your saved templates, past question papers, and reusable content will appear here."
            />
          )}
          {view === "empty" && (
            <EmptyAssignments
              isMobile={isMobile}
              onCreate={() => setView("create")}
            />
          )}
          {view === "assignments" && (
            <AssignmentsView
              isMobile={isMobile}
              assignments={allAssignments}
              onCreate={() => setView("create")}
              onView={() => {
                setPaper(
                  getFallback([
                    {
                      type: "Multiple Choice Questions",
                      questions: 4,
                      marks: 1,
                    },
                    { type: "Short Questions", questions: 3, marks: 2 },
                  ]),
                );
                setView("output");
              }}
            />
          )}
          {view === "create" && (
            <CreateAssignmentView
              isMobile={isMobile}
              onBack={handleBack}
              onGenerate={handleGenerate}
            />
          )}
          {view === "generating" && <GeneratingView />}
          {view === "output" && paper && (
            <OutputView
              isMobile={isMobile}
              paper={paper}
              onRegenerate={() => config && handleGenerate(config)}
            />
          )}
        </div>

        {isMobile && (
          <>
            {view === "assignments" && (
              <FloatingAddButton onClick={() => setView("create")} />
            )}
            <MobileBottomNav activeView={view} onNavigate={onNavigate} />
          </>
        )}
      </main>
    </div>
  );
}
