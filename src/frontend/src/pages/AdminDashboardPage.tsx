import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface Props {
  onNavigate: (page: string) => void;
}

type UserProfile = {
  principalId: string;
  name: string;
  country: string;
  phone: string;
  email: string;
  createdAt: bigint;
};

type PlatformStats = {
  totalUsers: number;
  totalAssessments: number;
  totalTwins: number;
  totalDecisionLogs: number;
  totalJournalEntries: number;
};

type JournalEntry = {
  id: string;
  userId: string;
  title: string;
  entryType: string;
  transcript: string;
  aiAnalysis: string;
  dimensionSignals: string;
  timestamp: bigint;
  blobUrl: string;
};

type ActivitySummary = {
  profile: UserProfile;
  assessments: {
    id: string;
    archetype: string;
    decisionForceLevel: string;
    timestamp: bigint;
    dimensionScores: Record<string, number>;
  }[];
  twinVersions: { id: string; versionName: string; createdAt: bigint }[];
  decisionLogs: { id: string; scenario: string; timestamp: bigint }[];
  journalEntries: JournalEntry[];
};

const GOLD = "#C8A24A";

function entryTypeIcon(t: string) {
  if (t === "video") return "🎥";
  if (t === "audio") return "🎤";
  return "📝";
}

export function AdminDashboardPage({ onNavigate }: Props) {
  const { actor } = useActor();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivitySummary | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [superAdminEmail, setSuperAdminEmail] = useState("");
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [confirmSeed, setConfirmSeed] = useState(false);

  const refreshData = async () => {
    if (!actor) return;
    const [s, u] = await Promise.all([
      actor.getPlatformStats().catch(() => null),
      actor.getAllUserProfiles().catch(() => []),
    ]);
    setStats(s as PlatformStats | null);
    setUsers(u as UserProfile[]);
  };

  useEffect(() => {
    if (!actor) return;
    actor
      .isCallerAdmin()
      .then(async (isAdmin) => {
        if (!isAdmin) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        setAuthorized(true);
        const [profileOpt, s, u] = await Promise.all([
          actor.getUserProfile().catch(() => null),
          actor.getPlatformStats().catch(() => null),
          actor.getAllUserProfiles().catch(() => []),
        ]);
        // Handle both array format and __kind__ format for profile extraction
        let adminEmail = "";
        if (Array.isArray(profileOpt) && profileOpt.length > 0) {
          const raw = profileOpt[0] as Record<string, unknown>;
          adminEmail = typeof raw.email === "string" ? raw.email : "";
        } else if (
          profileOpt &&
          typeof profileOpt === "object" &&
          "__kind__" in profileOpt &&
          (profileOpt as { __kind__: string }).__kind__ === "Some"
        ) {
          const v = (profileOpt as { __kind__: "Some"; value: UserProfile })
            .value;
          adminEmail = v.email || "";
        }
        setSuperAdminEmail(adminEmail);
        setStats(s as PlatformStats | null);
        setUsers(u as UserProfile[]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [actor]);

  const handleSeedData = async () => {
    if (!actor) return;
    setSeeding(true);
    try {
      const result = await (actor as any).seedDemoData();
      if (result === "already_seeded") {
        toast.info("Profiles already generated");
      } else {
        toast.success("35 profiles generated successfully");
        setSeeded(true);
        await refreshData();
      }
    } catch (_err) {
      toast.error("Could not generate profiles");
    } finally {
      setSeeding(false);
      setConfirmSeed(false);
    }
  };

  const loadActivity = async (userId: string) => {
    if (!actor) return;
    setActivityLoading(true);
    setSelectedUser(userId);
    try {
      const summary = (await actor.getUserActivitySummary(
        userId,
      )) as unknown as ActivitySummary;
      setActivity(summary);
    } catch (_) {
      setActivity(null);
    } finally {
      setActivityLoading(false);
    }
  };

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

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0A1F14" }}
      >
        <div className="text-white/50">Loading admin panel...</div>
      </div>
    );

  if (!authorized)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0A1F14" }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-white/60 mb-4">You do not have admin access.</p>
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="px-6 py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: GOLD, color: "#1B4332" }}
          >
            Go Home
          </button>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A1F14", color: "white" }}
    >
      {/* Confirm seed dialog */}
      {confirmSeed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          data-ocid="admin.dialog"
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full"
            style={{
              backgroundColor: "#1B4332",
              border: "1px solid rgba(200,162,74,0.3)",
            }}
          >
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-bold text-white text-lg mb-3">
              Generate Platform Profiles
            </h3>
            <p className="text-white/60 text-sm mb-6">
              This will generate 35 diverse profiles to showcase the
              platform&apos;s capabilities. Continue?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSeedData}
                disabled={seeding}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ backgroundColor: GOLD, color: "#1B4332" }}
                data-ocid="admin.confirm_button"
              >
                {seeding ? "Generating..." : "Generate 35 Profiles"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmSeed(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "white",
                }}
                data-ocid="admin.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#1B4332",
          borderBottom: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("userDashboard")}
              className="text-white/50 hover:text-white text-sm"
              data-ocid="admin.link"
            >
              ← Dashboard
            </button>
            <h1 className="text-white font-bold">Admin Dashboard</h1>
            {superAdminEmail === "sathishsampath@gmail.com" && (
              <span
                className="text-xs px-3 py-1 rounded-full font-bold"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #a07830)`,
                  color: "#1B4332",
                }}
              >
                ⭐ Super Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {superAdminEmail === "sathishsampath@gmail.com" && (
              <button
                type="button"
                onClick={() => onNavigate("showcase")}
                className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: GOLD,
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
                data-ocid="admin.secondary_button"
              >
                🏦 Investor Showcase →
              </button>
            )}
            {!seeded && (
              <button
                type="button"
                onClick={() => setConfirmSeed(true)}
                className="px-4 py-2 rounded-xl font-bold text-sm"
                style={{ backgroundColor: GOLD, color: "#1B4332" }}
                data-ocid="admin.primary_button"
              >
                Generate Profiles
              </button>
            )}
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(200,162,74,0.15)",
                color: GOLD,
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              elidi Admin
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                icon: "👥",
              },
              {
                label: "Assessments Taken",
                value: stats.totalAssessments,
                icon: "🧠",
              },
              {
                label: "Twin Versions",
                value: stats.totalTwins,
                icon: "🧩",
              },
              {
                label: "Decision Logs",
                value: stats.totalDecisionLogs,
                icon: "📋",
              },
              {
                label: "Journal Entries",
                value: stats.totalJournalEntries,
                icon: "📓",
              },
            ].map((s) => (
              <GreenCard key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: GOLD }}
                >
                  {Number(s.value)}
                </div>
                <div className="text-white/50 text-xs">{s.label}</div>
              </GreenCard>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <h2 className="font-bold mb-4">
              Registered Users ({users.length})
            </h2>
            {users.length === 0 ? (
              <GreenCard>
                <p className="text-white/40 text-sm text-center py-4">
                  No users yet.
                </p>
              </GreenCard>
            ) : (
              <div className="space-y-2">
                {users.map((u, idx) => (
                  <button
                    key={u.principalId}
                    type="button"
                    onClick={() => loadActivity(u.principalId)}
                    className="w-full text-left rounded-xl px-4 py-3 transition-all"
                    style={{
                      backgroundColor:
                        selectedUser === u.principalId
                          ? "rgba(200,162,74,0.12)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        selectedUser === u.principalId
                          ? "1px solid rgba(200,162,74,0.4)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="font-semibold text-sm">
                      {u.name || `Member #${String(idx + 1).padStart(3, "0")}`}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">
                      {u.country}
                      {u.phone ? ` · ${u.phone}` : ""}
                    </div>
                    <div className="text-white/30 text-xs mt-0.5">
                      {new Date(
                        Number(u.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-bold mb-4">User Activity</h2>
            {!selectedUser ? (
              <GreenCard className="text-center py-12">
                <div className="text-3xl mb-3">👆</div>
                <p className="text-white/40 text-sm">
                  Select a user to view their activity.
                </p>
              </GreenCard>
            ) : activityLoading ? (
              <GreenCard className="text-center py-12">
                <p className="text-white/40">Loading...</p>
              </GreenCard>
            ) : activity ? (
              <div className="space-y-4">
                <GreenCard>
                  <h3 className="font-bold mb-3">Profile</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      {
                        label: "Name",
                        value: activity.profile.name || "—",
                      },
                      { label: "Country", value: activity.profile.country },
                      { label: "Phone", value: activity.profile.phone },
                      {
                        label: "Email",
                        value: activity.profile.email || "—",
                      },
                      {
                        label: "Joined",
                        value: new Date(
                          Number(activity.profile.createdAt) / 1_000_000,
                        ).toLocaleDateString(),
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-white/40 text-xs">
                          {item.label}
                        </div>
                        <div className="text-white/80">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </GreenCard>

                <GreenCard>
                  <h3 className="font-bold mb-3">
                    Assessments ({activity.assessments.length})
                  </h3>
                  {activity.assessments.length === 0 ? (
                    <p className="text-white/30 text-sm">No assessments yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activity.assessments.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between text-sm py-2"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <span className="text-white/70">{a.archetype}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: GOLD }}>
                              {a.decisionForceLevel}
                            </span>
                            <span className="text-white/30 text-xs">
                              {new Date(
                                Number(a.timestamp) / 1_000_000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GreenCard>

                <GreenCard>
                  <h3 className="font-bold mb-3">
                    Twin Versions ({activity.twinVersions.length})
                  </h3>
                  {activity.twinVersions.length === 0 ? (
                    <p className="text-white/30 text-sm">
                      No twin versions yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {activity.twinVersions.map((v) => (
                        <span
                          key={v.id}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: "rgba(200,162,74,0.1)",
                            color: GOLD,
                            border: "1px solid rgba(200,162,74,0.25)",
                          }}
                        >
                          {v.versionName}
                        </span>
                      ))}
                    </div>
                  )}
                </GreenCard>

                <GreenCard>
                  <h3 className="font-bold mb-3">
                    Decision Logs ({activity.decisionLogs.length})
                  </h3>
                  {activity.decisionLogs.length === 0 ? (
                    <p className="text-white/30 text-sm">
                      No decision logs yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {activity.decisionLogs.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="text-sm py-2"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <p className="text-white/70 truncate">
                            {log.scenario}
                          </p>
                          <p className="text-white/30 text-xs">
                            {new Date(
                              Number(log.timestamp) / 1_000_000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </GreenCard>

                <GreenCard>
                  <h3 className="font-bold mb-3">
                    Journal Entries ({(activity.journalEntries || []).length})
                  </h3>
                  {!activity.journalEntries ||
                  activity.journalEntries.length === 0 ? (
                    <p className="text-white/30 text-sm">
                      No journal entries yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {activity.journalEntries.slice(0, 5).map((entry) => (
                        <div
                          key={entry.id}
                          className="text-sm py-2"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{entryTypeIcon(entry.entryType)}</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor:
                                  entry.entryType === "video"
                                    ? "rgba(200,162,74,0.15)"
                                    : entry.entryType === "audio"
                                      ? "rgba(147,51,234,0.2)"
                                      : "rgba(59,130,246,0.2)",
                                color:
                                  entry.entryType === "video"
                                    ? GOLD
                                    : entry.entryType === "audio"
                                      ? "#c084fc"
                                      : "#93c5fd",
                              }}
                            >
                              {entry.entryType}
                            </span>
                            <span className="text-white/70 font-medium">
                              {entry.title}
                            </span>
                          </div>
                          {entry.transcript && (
                            <p className="text-white/40 text-xs italic">
                              &ldquo;{entry.transcript.slice(0, 100)}
                              {entry.transcript.length > 100 ? "..." : ""}
                              &rdquo;
                            </p>
                          )}
                          <p className="text-white/25 text-xs mt-1">
                            {new Date(
                              Number(entry.timestamp) / 1_000_000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </GreenCard>
              </div>
            ) : (
              <GreenCard className="text-center py-8">
                <p className="text-white/40 text-sm">
                  Could not load activity data.
                </p>
              </GreenCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
