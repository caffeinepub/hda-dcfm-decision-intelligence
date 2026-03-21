import { useEffect, useState } from "react";
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
};

export function AdminDashboardPage({ onNavigate }: Props) {
  const { actor } = useActor();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivitySummary | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);

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
        const [s, u] = await Promise.all([
          actor.getPlatformStats().catch(() => null),
          actor.getAllUserProfiles().catch(() => []),
        ]);
        setStats(s as PlatformStats | null);
        setUsers(u as UserProfile[]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [actor]);

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
            style={{ backgroundColor: "#C8A24A", color: "#1B4332" }}
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
            >
              ← Dashboard
            </button>
            <h1 className="text-white font-bold">Admin Panel</h1>
          </div>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(200,162,74,0.15)",
              color: "#C8A24A",
              border: "1px solid rgba(200,162,74,0.3)",
            }}
          >
            elidi Admin
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers },
              { label: "Assessments Taken", value: stats.totalAssessments },
              { label: "Twin Versions", value: stats.totalTwins },
              { label: "Decision Logs", value: stats.totalDecisionLogs },
            ].map((s) => (
              <GreenCard key={s.label} className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: "#C8A24A" }}
                >
                  {Number(s.value)}
                </div>
                <div className="text-white/50 text-sm">{s.label}</div>
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
                {users.map((u) => (
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
                      {u.name || "Unnamed User"}
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
                      { label: "Name", value: activity.profile.name || "—" },
                      { label: "Country", value: activity.profile.country },
                      { label: "Phone", value: activity.profile.phone },
                      { label: "Email", value: activity.profile.email || "—" },
                      {
                        label: "Joined",
                        value: new Date(
                          Number(activity.profile.createdAt) / 1_000_000,
                        ).toLocaleDateString(),
                      },
                      {
                        label: "Principal",
                        value: `${activity.profile.principalId.slice(0, 12)}...`,
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
                            <span
                              className="text-xs"
                              style={{ color: "#C8A24A" }}
                            >
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
                            color: "#C8A24A",
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
