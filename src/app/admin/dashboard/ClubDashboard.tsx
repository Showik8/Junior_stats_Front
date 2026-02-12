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
    } catch (err: any) {
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
    removeToken();
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
             <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Unable to Load Dashboard</h2>
          <p className="mb-6 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Retry
          </button>
           <div className="mt-6 border-t pt-4">
            <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-700">
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
            {activeTab === "overview" && <ClubOverview team={team} />}
            {activeTab === "info" && <ClubInfo team={team} onUpdate={fetchTeamInfo} />}
            {activeTab === "players" && <PlayersModule team={team} />}
            {activeTab === "matches" && <MatchesModule team={team} />}
            {activeTab === "tournaments" && <TournamentsModule team={team} />}
            {activeTab === "settings" && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 text-4xl">⚙️</div>
                    <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                    <p className="text-gray-500">Global account settings coming soon.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClubDashboard;
