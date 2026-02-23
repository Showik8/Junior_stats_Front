import { useEffect, useState } from "react";
import { Team } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { removeToken } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import ClubSidebar from "../components/club/ClubSidebar";
import ClubHeader from "../components/club/ClubHeader";
import ClubOverview from "../components/club/ClubOverview";
import ClubInfo from "../components/club/ClubInfo";
import PlayersModule from "../components/club/PlayersModule";
import MatchesModule from "../components/club/MatchesModule";
import TournamentsModule from "../components/club/TournamentsModule";

/* ── Skeleton loader ── */
const DashboardSkeleton = () => (
  <div className="flex h-screen w-full bg-gray-50">
    {/* Sidebar skeleton */}
    <aside className="hidden md:flex h-full w-[260px] flex-col bg-white border-r border-gray-100 p-5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gray-200 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-14 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    </aside>

    {/* Main content */}
    <div className="flex-1 flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-8 w-12 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 h-40 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-3/4 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ClubDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamInfo = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMyTeamInfo();
      setTeam(data);
      setError(null);
    } catch (err: unknown) {
      console.error("Failed to fetch team info:", err);
      setError("Failed to load club information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamInfo();
  }, []);

  const handleLogout = () => {
    adminService.logoutAdmin();
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error && !team) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Unable to Load Dashboard
          </h2>
          <p className="mb-6 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            Retry
          </button>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <ClubSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <ClubHeader team={team} onLogout={handleLogout} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === "overview" && (
              <ClubOverview team={team} onNavigate={setActiveTab} />
            )}
            {activeTab === "info" && (
              <ClubInfo team={team} onUpdate={fetchTeamInfo} />
            )}
            {activeTab === "players" && <PlayersModule team={team} />}
            {activeTab === "matches" && <MatchesModule team={team} />}
            {activeTab === "tournaments" && <TournamentsModule team={team} />}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your account preferences
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Notification Settings */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🔔 Notifications
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Match Reminders",
                        "Tournament Updates",
                        "Player Alerts",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                        >
                          <span className="text-sm text-gray-700">{item}</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow-sm" />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Account */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      👤 Account
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Role</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Club Administrator
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Team</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {team?.name || "—"}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full mt-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClubDashboard;
