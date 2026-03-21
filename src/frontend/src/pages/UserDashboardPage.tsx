import { useEffect, useRef, useState } from "react";
import { DynamicRadarChart } from "../components/DynamicRadarChart";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_SHORT,
  QUESTIONS,
  classifyArchetype,
  classifyDecisionForce,
  computeScores,
} from "../scoring";
import type { Dimension } from "../scoring";

interface Props {
  onNavigate: (page: string) => void;
}

type TabId = "twin" | "builder" | "versions" | "simlab" | "growth";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "twin", label: "My Mind Twin", icon: "🧠" },
  { id: "builder", label: "Twin Builder", icon: "🎛️" },
  { id: "versions", label: "My Versions", icon: "📂" },
  { id: "simlab", label: "Simulation Lab", icon: "⚗️" },
  { id: "growth", label: "Growth Path", icon: "📈" },
];

const LIKERT = [1, 2, 3, 4, 5, 6, 7];

function computeDecisionForce(scores: Record<Dimension, number>): number {
  return scores.em + scores.rrm + scores.iai - (scores.sis + (10 - scores.edi));
}

function interpretForce(f: number): string {
  if (f >= 8) return "Decides confidently";
  if (f >= 6) return "Decides clearly";
  if (f >= 3) return "Cautious decision-maker";
  return "Hesitates";
}

function timeToDecision(em: number): string {
  if (em <= 3) return "Fast (low emotional drag)";
  if (em <= 5) return "Moderate";
  return "Slow (high emotional processing)";
}

function stabilityRating(iai: number): string {
  if (iai >= 6) return "Very Stable";
  if (iai >= 4) return "Stable";
  return "Variable";
}

type StoredAssessment = {
  id: string;
  userId: string;
  responses: bigint[];
  dimensionScores: {
    pm: number;
    em: number;
    rrm: number;
    iai: number;
    sis: number;
    edi: number;
  };
  archetype: string;
  decisionForceLevel: string;
  timestamp: bigint;
};

type TwinVersion = {
  id: string;
  userId: string;
  versionName: string;
  pm: number;
  em: number;
  rrm: number;
  iai: number;
  sis: number;
  edi: number;
  createdAt: bigint;
  notes: string;
};

type DecisionLogEntry = {
  id: string;
  userId: string;
  scenario: string;
  twinVersionUsed: string;
  decisionOutcome: string;
  actualOutcome: string;
  timestamp: bigint;
};

export function UserDashboardPage({ onNavigate }: Props) {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const [activeTab, setActiveTab] = useState<TabId>("twin");
  const [profile, setProfile] = useState<{
    name: string;
    country: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // My Mind Twin
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [asmStep, setAsmStep] = useState(0);
  const [asmResponses, setAsmResponses] = useState<number[]>(Array(36).fill(0));
  const [asmSubmitting, setAsmSubmitting] = useState(false);

  // Twin Builder
  const [bVersionName, setBVersionName] = useState("My Twin");
  const [bSliders, setBSliders] = useState({
    pm: 5,
    em: 5,
    rrm: 5,
    iai: 5,
    sis: 5,
    edi: 5,
  });
  const [bNotes, setBNotes] = useState("");
  const [bSaving, setBSaving] = useState(false);

  // My Versions
  const [versions, setVersions] = useState<TwinVersion[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  // Simulation Lab
  const [scenario, setScenario] = useState("");
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [simResult, setSimResult] = useState<
    | null
    | {
        name: string;
        force: number;
        interpretation: string;
        time: string;
        stability: string;
      }[]
  >(null);

  // Growth Path
  const [deltaCurrentId, setDeltaCurrentId] = useState<string | null>(null);
  const [deltaTargetId, setDeltaTargetId] = useState<string | null>(null);
  const [logScenario, setLogScenario] = useState("");
  const [logTwinUsed, setLogTwinUsed] = useState("");
  const [logDecisionOutcome, setLogDecisionOutcome] = useState("");
  const [logActualOutcome, setLogActualOutcome] = useState("");
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>([]);
  const [logSaving, setLogSaving] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("myDecisionTwin");
      return;
    }
    if (!actor) return;
    actor
      .getUserProfile()
      .then((opt) => {
        if (opt && "__kind__" in opt && opt.__kind__ === "Some") {
          const p = (
            opt as {
              __kind__: "Some";
              value: { name: string; country: string };
            }
          ).value;
          setProfile({ name: p.name, country: p.country });
        }
      })
      .catch(() => {});
    actor
      .isCallerAdmin()
      .then(setIsAdmin)
      .catch(() => {});
    loadAssessments();
    loadVersions();
    loadDecisionLogs();
  }, [isAuthenticated, actor]);

  const loadAssessments = async () => {
    if (!actor) return;
    const list = (await actor
      .getUserAssessments()
      .catch(() => [])) as StoredAssessment[];
    setAssessments(list);
    if (list.length > 0) {
      const latest = list[0].dimensionScores;
      setBSliders({
        pm: latest.pm,
        em: latest.em,
        rrm: latest.rrm,
        iai: latest.iai,
        sis: latest.sis,
        edi: latest.edi,
      });
    }
  };

  const loadVersions = async () => {
    if (!actor) return;
    const list = (await actor
      .getTwinVersions()
      .catch(() => [])) as TwinVersion[];
    setVersions(list);
  };

  const loadDecisionLogs = async () => {
    if (!actor) return;
    const list = (await actor
      .getDecisionLog()
      .catch(() => [])) as DecisionLogEntry[];
    setDecisionLogs(list);
  };

  // Inline assessment
  const currentDim = DIMENSIONS[asmStep];
  const stepQs = QUESTIONS.filter((q) => q.dimension === currentDim);
  const stepStart = asmStep * 6;
  const stepResponses = stepQs.map((_, i) => asmResponses[stepStart + i]);
  const allAnswered = stepResponses.every((r) => r > 0);

  const handleAsmSubmit = async () => {
    if (!actor) return;
    setAsmSubmitting(true);
    const scores = computeScores(asmResponses);
    const archetype = classifyArchetype(scores);
    const forceLevel = classifyDecisionForce(scores);
    const bigintR = asmResponses.map((r) => BigInt(r));
    try {
      await actor.submitRegisteredAssessment(
        bigintR,
        scores,
        archetype,
        forceLevel,
      );
      await loadAssessments();
      setShowAssessment(false);
      setAsmResponses(Array(36).fill(0));
      setAsmStep(0);
    } catch (_) {
    } finally {
      setAsmSubmitting(false);
    }
  };

  const handleSaveTwin = async () => {
    if (!actor || !bVersionName.trim()) return;
    setBSaving(true);
    try {
      await actor.saveTwinVersion(
        bVersionName,
        bSliders.pm,
        bSliders.em,
        bSliders.rrm,
        bSliders.iai,
        bSliders.sis,
        bSliders.edi,
        bNotes,
      );
      await loadVersions();
      setBVersionName("My Twin");
      setBNotes("");
    } catch (_) {
    } finally {
      setBSaving(false);
    }
  };

  const handleDeleteVersion = async (id: string) => {
    if (!actor) return;
    await actor.deleteTwinVersion(id).catch(() => {});
    await loadVersions();
  };

  const runSimulation = () => {
    const selected = versions.filter((v) => selectedVersionIds.includes(v.id));
    if (!selected.length) return;
    const results = selected.map((v) => {
      const scores = {
        pm: v.pm,
        em: v.em,
        rrm: v.rrm,
        iai: v.iai,
        sis: v.sis,
        edi: v.edi,
      };
      const force = computeDecisionForce(scores);
      return {
        name: v.versionName,
        force: Math.round(force * 100) / 100,
        interpretation: interpretForce(force),
        time: timeToDecision(v.em),
        stability: stabilityRating(v.iai),
      };
    });
    setSimResult(results);
  };

  const handleLogDecision = async () => {
    if (!actor || !logScenario.trim()) return;
    setLogSaving(true);
    try {
      await actor.logDecision(
        logScenario,
        logTwinUsed,
        logDecisionOutcome,
        logActualOutcome,
      );
      setLogScenario("");
      setLogTwinUsed("");
      setLogDecisionOutcome("");
      setLogActualOutcome("");
      await loadDecisionLogs();
    } catch (_) {
    } finally {
      setLogSaving(false);
    }
  };

  const latestScores =
    assessments.length > 0 ? assessments[0].dimensionScores : null;

  const versionA = versions.find((v) => v.id === compareA);
  const versionB = versions.find((v) => v.id === compareB);
  const currentTwin = versions.find((v) => v.id === deltaCurrentId);
  const targetTwin = versions.find((v) => v.id === deltaTargetId);

  function coachingTip(dim: Dimension, delta: number): string {
    if (Math.abs(delta) < 0.3)
      return "On track. Maintain current behaviour patterns.";
    const dir = delta > 0 ? "increase" : "reduce";
    const tips: Record<Dimension, { increase: string; reduce: string }> = {
      pm: {
        increase: "Build a daily decision log habit.",
        reduce: "Trust your process more; reduce over-planning.",
      },
      em: {
        increase: "Practice mindfulness before decisions.",
        reduce: "Build a pause-and-label protocol to reduce reactivity.",
      },
      rrm: {
        increase: "Add pre-mortem analysis to major decisions.",
        reduce: "Embrace more calculated risk; define acceptable loss.",
      },
      iai: {
        increase: "Commit to 3 data points before deciding.",
        reduce: "Reduce analysis paralysis; set decision time limits.",
      },
      sis: {
        increase: "Consult one stakeholder earlier per decision.",
        reduce: "Build independent decision confidence.",
      },
      edi: {
        increase: "Set firm decision deadlines and stick to them.",
        reduce: "Delegate more; focus on highest-leverage calls.",
      },
    };
    return tips[dim][dir];
  }

  const GreenCard = ({
    children,
    className = "",
  }: { children: React.ReactNode; className?: string }) => (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {children}
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A1F14", color: "white" }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1B4332",
          borderBottom: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("myDecisionTwin")}
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-white font-bold">
                My Decision Twin Dashboard
              </h1>
              {profile && (
                <p className="text-white/50 text-xs">
                  {profile.name || ""}{" "}
                  {profile.country ? `· ${profile.country}` : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate("adminDashboard")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: "#C8A24A",
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                Admin Panel
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                clear();
                onNavigate("landing");
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all"
                style={{
                  borderBottomColor:
                    activeTab === tab.id ? "#C8A24A" : "transparent",
                  color:
                    activeTab === tab.id ? "#C8A24A" : "rgba(255,255,255,0.5)",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* TAB 1: My Mind Twin */}
        {activeTab === "twin" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">My Mind Twin</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAssessment(!showAssessment);
                  setAsmStep(0);
                  setAsmResponses(Array(36).fill(0));
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
              >
                {showAssessment ? "Cancel" : "Take New Assessment"}
              </button>
            </div>

            {showAssessment && (
              <GreenCard className="mb-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#C8A24A" }}
                    >
                      Dimension {asmStep + 1} of 6:{" "}
                      {DIMENSION_LABELS[currentDim]}
                    </span>
                    <span className="text-white/40 text-xs">
                      Step {asmStep + 1}/6
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${((asmStep + 1) / 6) * 100}%`,
                        backgroundColor: "#C8A24A",
                      }}
                    />
                  </div>
                  {/* Dimension description */}
                  {(() => {
                    const DIMENSION_DESCRIPTIONS: Record<string, string> = {
                      pm: "This set explores how you structure, plan, and manage your decision-making process. High scorers are methodical and systematic; lower scorers tend to be more intuitive or spontaneous.",
                      em: "These questions reveal how your emotions influence your choices and how well you manage emotional responses under pressure. High scorers stay composed; lower scorers may be more reactive.",
                      rrm: "This dimension measures your appetite for risk, how you evaluate trade-offs, and whether you lean toward caution or boldness. High scorers embrace calculated risk; lower scorers prefer certainty.",
                      iai: "These questions probe how you gather, process, and weigh information before deciding. High scorers are analytical and data-driven; lower scorers trust instinct over evidence.",
                      sis: "This set examines how social dynamics, group influence, and interpersonal relationships shape your decisions. High scorers navigate social complexity well; lower scorers may find it challenging.",
                      edi: "These questions assess how quickly and decisively you act once a decision is made, and how well you follow through. High scorers are decisive executors; lower scorers may overthink before acting.",
                    };
                    return (
                      <div
                        className="mb-5 p-4 rounded-xl"
                        style={{
                          backgroundColor: "rgba(200,162,74,0.07)",
                          border: "1px solid rgba(200,162,74,0.15)",
                        }}
                      >
                        <p className="text-white/75 text-sm leading-relaxed">
                          {DIMENSION_DESCRIPTIONS[currentDim]}
                        </p>
                        <div className="flex items-center justify-between mt-3 px-1">
                          <span
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            1 = Strongly Disagree
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "rgba(200,162,74,0.7)" }}
                          >
                            4 = Neutral
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            7 = Strongly Agree
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="space-y-5">
                  {stepQs.map((q, qi) => {
                    const idx = stepStart + qi;
                    return (
                      <div key={idx}>
                        <p className="text-white/80 text-sm mb-3">
                          <span
                            className="font-bold"
                            style={{ color: "#C8A24A" }}
                          >
                            {idx + 1}.
                          </span>{" "}
                          {q.text}
                        </p>
                        <div className="flex gap-1">
                          {LIKERT.map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                const r = [...asmResponses];
                                r[idx] = v;
                                setAsmResponses(r);
                              }}
                              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                              style={{
                                backgroundColor:
                                  asmResponses[idx] === v
                                    ? "#C8A24A"
                                    : "rgba(255,255,255,0.07)",
                                color:
                                  asmResponses[idx] === v
                                    ? "#1B4332"
                                    : "rgba(255,255,255,0.5)",
                                border: "1px solid",
                                borderColor:
                                  asmResponses[idx] === v
                                    ? "#C8A24A"
                                    : "rgba(255,255,255,0.1)",
                              }}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    disabled={asmStep === 0}
                    onClick={() => setAsmStep((s) => s - 1)}
                    className="px-4 py-2 rounded-lg text-sm border border-white/20 text-white/60 disabled:opacity-30"
                  >
                    ← Back
                  </button>
                  {asmStep < 5 ? (
                    <button
                      type="button"
                      disabled={!allAnswered}
                      onClick={() => setAsmStep((s) => s + 1)}
                      className="px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-40"
                      style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!allAnswered || asmSubmitting}
                      onClick={handleAsmSubmit}
                      className="px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-40"
                      style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
                    >
                      {asmSubmitting ? "Saving..." : "Submit Assessment"}
                    </button>
                  )}
                </div>
              </GreenCard>
            )}

            {latestScores ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GreenCard>
                  <h3 className="font-bold mb-4">Your HDA-DCFM Profile</h3>
                  <DynamicRadarChart
                    scores={latestScores as Record<Dimension, number>}
                  />
                </GreenCard>
                <GreenCard>
                  <h3 className="font-bold mb-4">Dimension Scores</h3>
                  <div className="space-y-3">
                    {DIMENSIONS.map((dim) => (
                      <div key={dim}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">
                            {DIMENSION_SHORT[dim]} — {DIMENSION_LABELS[dim]}
                          </span>
                          <span
                            style={{ color: "#C8A24A" }}
                            className="font-bold"
                          >
                            {(
                              latestScores[
                                dim as keyof typeof latestScores
                              ] as number
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${((latestScores[dim as keyof typeof latestScores] as number) / 7) * 100}%`,
                              backgroundColor: "#C8A24A",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GreenCard>
              </div>
            ) : (
              <GreenCard className="text-center py-12">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="font-bold text-lg mb-2">No Assessment Yet</h3>
                <p className="text-white/50 text-sm mb-4">
                  Take your first HDA-DCFM assessment to generate your base twin
                  profile.
                </p>
              </GreenCard>
            )}

            {assessments.length > 1 && (
              <GreenCard className="mt-6">
                <h3 className="font-bold mb-4">Assessment History</h3>
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((a, i) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between text-sm"
                      style={{
                        borderBottom:
                          i < Math.min(4, assessments.length - 1)
                            ? "1px solid rgba(255,255,255,0.07)"
                            : undefined,
                        paddingBottom: 8,
                      }}
                    >
                      <div>
                        <span className="font-medium">{a.archetype}</span>
                        <span className="text-white/40 ml-2">
                          {new Date(
                            Number(a.timestamp) / 1_000_000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{ color: "#C8A24A" }} className="text-xs">
                        {a.decisionForceLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </GreenCard>
            )}
          </div>
        )}

        {/* TAB 2: Twin Builder */}
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-6">Twin Builder</h2>
              {!latestScores && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.1)",
                    border: "1px solid rgba(200,162,74,0.25)",
                    color: "#C8A24A",
                  }}
                >
                  Take an assessment first to seed your base values.
                </div>
              )}
              <GreenCard>
                <div className="mb-4">
                  <label
                    className="block text-white/70 text-sm font-medium mb-1"
                    htmlFor="vname"
                  >
                    Version Name
                  </label>
                  <input
                    id="vname"
                    type="text"
                    value={bVersionName}
                    onChange={(e) => setBVersionName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    placeholder="e.g. Bold Me, Calm Me, Future Me"
                  />
                </div>
                <div className="space-y-5 mb-5">
                  {DIMENSIONS.map((dim) => (
                    <div key={dim}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">
                          {DIMENSION_SHORT[dim]} — {DIMENSION_LABELS[dim]}
                        </span>
                        <span
                          style={{ color: "#C8A24A" }}
                          className="font-bold"
                        >
                          {bSliders[dim].toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="0.1"
                        value={bSliders[dim]}
                        onChange={(e) =>
                          setBSliders((prev) => ({
                            ...prev,
                            [dim]: Number.parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-yellow-500"
                      />
                      {latestScores && (
                        <div className="text-xs text-white/30 mt-1">
                          Base:{" "}
                          {(
                            latestScores[
                              dim as keyof typeof latestScores
                            ] as number
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <label
                    className="block text-white/70 text-sm font-medium mb-1"
                    htmlFor="bnotes"
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="bnotes"
                    value={bNotes}
                    onChange={(e) => setBNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    rows={2}
                    placeholder="What does this version represent?"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveTwin}
                  disabled={bSaving || !bVersionName.trim()}
                  className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                  style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
                >
                  {bSaving ? "Saving..." : "Save Twin Version"}
                </button>
              </GreenCard>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Simulation Preview</h3>
              <GreenCard>
                <div
                  className="mb-3 text-xs font-semibold"
                  style={{ color: "#C8A24A", letterSpacing: "0.08em" }}
                >
                  DCFM DECISION FORCE
                </div>
                {(() => {
                  const f = computeDecisionForce(
                    bSliders as Record<Dimension, number>,
                  );
                  return (
                    <>
                      <div className="text-4xl font-bold text-white mb-1">
                        {f.toFixed(2)}
                      </div>
                      <div className="text-white/60 text-sm mb-4">
                        {interpretForce(f)}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className="rounded-xl p-3"
                          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        >
                          <div className="text-xs text-white/40 mb-1">
                            Time to Decision
                          </div>
                          <div className="text-sm font-semibold">
                            {timeToDecision(bSliders.em)}
                          </div>
                        </div>
                        <div
                          className="rounded-xl p-3"
                          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        >
                          <div className="text-xs text-white/40 mb-1">
                            Stability
                          </div>
                          <div className="text-sm font-semibold">
                            {stabilityRating(bSliders.iai)}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </GreenCard>
            </div>
          </div>
        )}

        {/* TAB 3: My Versions */}
        {activeTab === "versions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">My Twin Versions</h2>
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: "#C8A24A",
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                + Create New
              </button>
            </div>

            {versions.length === 0 ? (
              <GreenCard className="text-center py-12">
                <div className="text-4xl mb-3">📂</div>
                <p className="text-white/50">
                  No versions yet. Use Twin Builder to create your first
                  version.
                </p>
              </GreenCard>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {versions.map((v) => (
                    <GreenCard key={v.id}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold">{v.versionName}</h3>
                          <p className="text-white/40 text-xs mt-0.5">
                            {new Date(
                              Number(v.createdAt) / 1_000_000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVersion(v.id)}
                          className="text-white/30 hover:text-red-400 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="space-y-2 mb-3">
                        {DIMENSIONS.map((dim) => (
                          <div key={dim} className="flex items-center gap-2">
                            <span className="text-white/40 text-xs w-8">
                              {DIMENSION_SHORT[dim]}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/10">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${((v[dim as keyof TwinVersion] as number) / 7) * 100}%`,
                                  backgroundColor: "#C8A24A",
                                }}
                              />
                            </div>
                            <span className="text-xs text-white/50">
                              {(v[dim as keyof TwinVersion] as number).toFixed(
                                1,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      {v.notes && (
                        <p className="text-white/40 text-xs italic">
                          {v.notes}
                        </p>
                      )}
                    </GreenCard>
                  ))}
                </div>

                {versions.length >= 2 && (
                  <GreenCard>
                    <h3 className="font-bold mb-4">Compare Two Versions</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <select
                        value={compareA || ""}
                        onChange={(e) => setCompareA(e.target.value)}
                        className="px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        <option value="" style={{ backgroundColor: "#1B4332" }}>
                          Version A
                        </option>
                        {versions.map((v) => (
                          <option
                            key={v.id}
                            value={v.id}
                            style={{ backgroundColor: "#1B4332" }}
                          >
                            {v.versionName}
                          </option>
                        ))}
                      </select>
                      <select
                        value={compareB || ""}
                        onChange={(e) => setCompareB(e.target.value)}
                        className="px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        <option value="" style={{ backgroundColor: "#1B4332" }}>
                          Version B
                        </option>
                        {versions.map((v) => (
                          <option
                            key={v.id}
                            value={v.id}
                            style={{ backgroundColor: "#1B4332" }}
                          >
                            {v.versionName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {versionA && versionB && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p
                            className="text-center text-sm font-semibold mb-3"
                            style={{ color: "#C8A24A" }}
                          >
                            {versionA.versionName}
                          </p>
                          <DynamicRadarChart
                            scores={
                              {
                                pm: versionA.pm,
                                em: versionA.em,
                                rrm: versionA.rrm,
                                iai: versionA.iai,
                                sis: versionA.sis,
                                edi: versionA.edi,
                              } as Record<Dimension, number>
                            }
                          />
                        </div>
                        <div>
                          <p
                            className="text-center text-sm font-semibold mb-3"
                            style={{ color: "#C8A24A" }}
                          >
                            {versionB.versionName}
                          </p>
                          <DynamicRadarChart
                            scores={
                              {
                                pm: versionB.pm,
                                em: versionB.em,
                                rrm: versionB.rrm,
                                iai: versionB.iai,
                                sis: versionB.sis,
                                edi: versionB.edi,
                              } as Record<Dimension, number>
                            }
                          />
                        </div>
                      </div>
                    )}
                  </GreenCard>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 4: Simulation Lab */}
        {activeTab === "simlab" && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Simulation Lab</h2>
            <GreenCard className="mb-6">
              <label
                className="block text-white/70 text-sm font-medium mb-2"
                htmlFor="scenario"
              >
                Describe a decision scenario
              </label>
              <textarea
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g. I need to decide whether to leave my job for a startup opportunity with higher risk but bigger reward..."
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                rows={4}
              />
            </GreenCard>

            {versions.length === 0 ? (
              <div className="text-white/40 text-sm mb-6">
                Create twin versions in the Twin Builder first.
              </div>
            ) : (
              <GreenCard className="mb-6">
                <p className="text-white/70 text-sm font-medium mb-3">
                  Select up to 3 versions to simulate:
                </p>
                <div className="space-y-2">
                  {versions.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVersionIds.includes(v.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedVersionIds.length < 3)
                              setSelectedVersionIds((prev) => [...prev, v.id]);
                          } else
                            setSelectedVersionIds((prev) =>
                              prev.filter((id) => id !== v.id),
                            );
                        }}
                        className="accent-yellow-500"
                      />
                      <span className="text-sm text-white/80">
                        {v.versionName}
                      </span>
                    </label>
                  ))}
                </div>
              </GreenCard>
            )}

            <button
              type="button"
              onClick={runSimulation}
              disabled={!scenario.trim() || selectedVersionIds.length === 0}
              className="mb-8 px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-40"
              style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
            >
              Run Simulation
            </button>

            {simResult && (
              <div className="space-y-4">
                <h3 className="font-bold">Simulation Results</h3>
                {simResult.map((r) => (
                  <GreenCard key={r.name}>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold">{r.name}</h4>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: "#C8A24A" }}
                      >
                        {r.force.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-white font-semibold mb-3">
                      → {r.interpretation}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="rounded-lg p-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <div className="text-xs text-white/40 mb-1">
                          Time to Decision
                        </div>
                        <div className="text-sm font-medium">{r.time}</div>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        <div className="text-xs text-white/40 mb-1">
                          Stability
                        </div>
                        <div className="text-sm font-medium">{r.stability}</div>
                      </div>
                    </div>
                  </GreenCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Growth Path */}
        {activeTab === "growth" && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold">Growth Path</h2>

            {/* Delta Engine */}
            <GreenCard>
              <h3 className="font-bold mb-4">Twin Delta Engine</h3>
              <p className="text-white/50 text-sm mb-4">
                Select your Current Me and your Target version to see the gap.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    className="text-white/60 text-xs mb-1 block"
                    htmlFor="dcurrent"
                  >
                    Current Me
                  </label>
                  <select
                    id="dcurrent"
                    value={deltaCurrentId || ""}
                    onChange={(e) => setDeltaCurrentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <option value="" style={{ backgroundColor: "#1B4332" }}>
                      Select version
                    </option>
                    {versions.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        style={{ backgroundColor: "#1B4332" }}
                      >
                        {v.versionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-white/60 text-xs mb-1 block"
                    htmlFor="dtarget"
                  >
                    Target Me
                  </label>
                  <select
                    id="dtarget"
                    value={deltaTargetId || ""}
                    onChange={(e) => setDeltaTargetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <option value="" style={{ backgroundColor: "#1B4332" }}>
                      Select version
                    </option>
                    {versions.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        style={{ backgroundColor: "#1B4332" }}
                      >
                        {v.versionName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentTwin && targetTwin && (
                <div className="space-y-4">
                  {DIMENSIONS.map((dim) => {
                    const delta =
                      (targetTwin[dim as keyof TwinVersion] as number) -
                      (currentTwin[dim as keyof TwinVersion] as number);
                    const pct = Math.abs(
                      Math.round(
                        (delta /
                          (currentTwin[dim as keyof TwinVersion] as number)) *
                          100,
                      ),
                    );
                    return (
                      <div
                        key={dim}
                        className="rounded-xl p-4"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            {DIMENSION_SHORT[dim]} — {DIMENSION_LABELS[dim]}
                          </span>
                          <span
                            className="text-sm font-bold"
                            style={{
                              color:
                                delta > 0
                                  ? "#4ade80"
                                  : delta < 0
                                    ? "#f87171"
                                    : "#C8A24A",
                            }}
                          >
                            {delta > 0
                              ? `↑ +${pct}%`
                              : delta < 0
                                ? `↓ -${pct}%`
                                : "= On Track"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                          <span>
                            Current:{" "}
                            {(
                              currentTwin[dim as keyof TwinVersion] as number
                            ).toFixed(1)}
                          </span>
                          <span>→</span>
                          <span>
                            Target:{" "}
                            {(
                              targetTwin[dim as keyof TwinVersion] as number
                            ).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: "#C8A24A" }}>
                          💡 {coachingTip(dim, delta)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </GreenCard>

            {/* Decision Log */}
            <GreenCard>
              <h3 className="font-bold mb-4">Decision Log</h3>
              <p className="text-white/50 text-sm mb-4">
                Log real decisions and track how your twin model performs over
                time.
              </p>
              <div className="space-y-3 mb-4">
                <textarea
                  value={logScenario}
                  onChange={(e) => setLogScenario(e.target.value)}
                  placeholder="Decision scenario..."
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  rows={2}
                />
                <input
                  type="text"
                  value={logTwinUsed}
                  onChange={(e) => setLogTwinUsed(e.target.value)}
                  placeholder="Twin version used (e.g. Bold Me)"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <input
                  type="text"
                  value={logDecisionOutcome}
                  onChange={(e) => setLogDecisionOutcome(e.target.value)}
                  placeholder="Predicted/planned outcome"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <input
                  type="text"
                  value={logActualOutcome}
                  onChange={(e) => setLogActualOutcome(e.target.value)}
                  placeholder="Actual outcome (fill in after the fact)"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleLogDecision}
                disabled={logSaving || !logScenario.trim()}
                className="px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-40"
                style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
              >
                {logSaving ? "Saving..." : "Log Decision"}
              </button>

              {decisionLogs.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm mb-3">Past Decisions</h4>
                  <div className="space-y-3">
                    {decisionLogs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="rounded-xl p-4"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <p className="text-white text-sm font-medium mb-1">
                          {log.scenario}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-white/40">
                          <span>
                            Twin:{" "}
                            <span className="text-white/60">
                              {log.twinVersionUsed || "—"}
                            </span>
                          </span>
                          <span>
                            Predicted:{" "}
                            <span className="text-white/60">
                              {log.decisionOutcome || "—"}
                            </span>
                          </span>
                          <span>
                            Actual:{" "}
                            <span style={{ color: "#C8A24A" }}>
                              {log.actualOutcome || "Pending"}
                            </span>
                          </span>
                          <span>
                            {new Date(
                              Number(log.timestamp) / 1_000_000,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GreenCard>
          </div>
        )}
      </div>
    </div>
  );
}
