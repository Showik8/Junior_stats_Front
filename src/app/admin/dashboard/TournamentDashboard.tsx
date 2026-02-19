import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tournament, Team, Match, AgeCategory } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { removeToken } from "@/app/utils/auth";
import TournamentInfo from "../components/TournamentInfo";
import MembersManagement from "../components/MembersManagement";
import MatchManagement from "../components/MatchManagement";
import StandingsTable from "../components/StandingsTable";
import GroupManagement from "../components/GroupManagement";
import TournamentStatistics from "../components/TournamentStatistics";
import {
  FaFutbol,
  FaUsers,
  FaChartBar,
  FaLayerGroup,
  FaTrophy,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

type DashboardTab = "matches" | "members" | "standings" | "statistics" | "groups";

/* ── Skeleton loader ── */
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <nav className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-200 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Tournament info skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-64 bg-gray-200 rounded-lg" />
          <div className="h-6 w-20 bg-emerald-100 rounded-full" />
          <div className="h-6 w-28 bg-blue-50 rounded-full" />
        </div>
        <div className="h-4 w-96 bg-gray-100 rounded mb-4" />
        <div className="flex gap-3">
          <div className="h-7 w-32 bg-gray-100 rounded-lg" />
          <div className="h-7 w-40 bg-gray-100 rounded-lg" />
          <div className="h-7 w-28 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* Age category tabs skeleton */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-100 rounded-t-lg animate-pulse" />
        ))}
      </div>

      {/* Content tabs skeleton */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-10 bg-gray-200/50 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
          <div className="h-10 w-28 bg-blue-100 rounded-xl" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
        ))}
      </div>
    </main>
  </div>
);

const tabConfig: { key: DashboardTab; label: string; icon: React.ElementType; requiresGroup?: boolean }[] = [
  { key: "matches", label: "Matches", icon: FaFutbol },
  { key: "members", label: "Members", icon: FaUsers },
  { key: "standings", label: "Standings", icon: FaChartBar },
  { key: "statistics", label: "Statistics", icon: FaTrophy },
  { key: "groups", label: "Groups", icon: FaLayerGroup, requiresGroup: true },
];

const TournamentDashboard: React.FC = () => {
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeAgeCategory, setActiveAgeCategory] = useState<AgeCategory | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("matches");

  const fetchTournamentInfo = async () => {
    try {
      const fetchedTournament = await adminService.getTournamentInfo();
      setTournament(fetchedTournament);

      if (!activeAgeCategory && fetchedTournament) {
        if (fetchedTournament.ageCategories && fetchedTournament.ageCategories.length > 0) {
          setActiveAgeCategory(fetchedTournament.ageCategories[0].ageCategory);
        } else if (fetchedTournament.ageCategory) {
          setActiveAgeCategory(fetchedTournament.ageCategory as AgeCategory);
        }
      }
      return fetchedTournament;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load tournament info";
      console.error("Tournament info fetch error:", msg);
      setError(msg);
      return null;
    }
  };

  const fetchCategoryData = async (tournId: string, category: AgeCategory) => {
    try {
      setLoading(true);
      const [fetchedTeams, fetchedMatches] = await Promise.all([
        adminService.getTeams(tournId, category),
        adminService.getMatches(tournId, category),
      ]);
      setTeams(fetchedTeams);
      setMatches(fetchedMatches);
    } catch (err: unknown) {
      console.error("Category data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTournamentInfo();
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tournament && activeAgeCategory) {
      fetchCategoryData(tournament.id, activeAgeCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAgeCategory, tournament]);

  const handleRefresh = () => {
    if (tournament && activeAgeCategory) {
      fetchCategoryData(tournament.id, activeAgeCategory);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/sign-in");
  };

  const handleExit = () => {
    router.push("/");
  };

  if (loading && !tournament) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
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

  const availableCategories: AgeCategory[] =
    tournament?.ageCategories?.map((c) => c.ageCategory) ||
    (tournament?.ageCategory ? [tournament.ageCategory as AgeCategory] : []);

  const isGroupFormat = tournament?.format === "GROUP_KNOCKOUT";

  const visibleTabs = tabConfig.filter(
    (t) => !t.requiresGroup || isGroupFormat
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <nav className="shadow-sm border-b border-gray-200 sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                JS
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                  Junior Stats
                </h1>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Tournament Admin
                </span>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleExit}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Go to Home"
              >
                <FaExternalLinkAlt className="text-xs" />
                View Site
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out"
              >
                <FaSignOutAlt className="text-xs" />
                Sign Out
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => { handleExit(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
            >
              <FaExternalLinkAlt className="text-xs text-gray-400" />
              View Site
            </button>
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <FaSignOutAlt className="text-xs" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tournament Info */}
        <section>
          <TournamentInfo tournament={tournament} loading={loading} />
        </section>

        {tournament && (
          <div>
            {/* Age Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-1">
              {availableCategories.length > 0 ? (
                availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveAgeCategory(cat)}
                    className={`px-4 py-2.5 rounded-t-xl font-semibold text-sm transition-all relative ${
                      activeAgeCategory === cat
                        ? "bg-white text-blue-600 border border-gray-200 border-b-white shadow-sm"
                        : "bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    {cat.replace("_", "-")}
                    {activeAgeCategory === cat && (
                      <span className="absolute -bottom-[1px] left-2 right-2 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No age categories defined
                </div>
              )}
            </div>

            {activeAgeCategory ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Content Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === tab.key
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon
                          className={`text-xs ${
                            activeTab === tab.key
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                  {activeTab === "matches" && (
                    <section className="h-[600px]">
                      <MatchManagement
                        tournament={tournament}
                        teams={teams}
                        matches={matches}
                        activeAgeCategory={activeAgeCategory}
                        onMatchUpdate={handleRefresh}
                      />
                    </section>
                  )}

                  {activeTab === "members" && (
                    <section className="h-[600px]">
                      <MembersManagement
                        tournament={tournament}
                        teams={teams}
                        activeAgeCategory={activeAgeCategory}
                        onTeamUpdate={handleRefresh}
                      />
                    </section>
                  )}

                  {activeTab === "standings" && (
                    <section>
                      <StandingsTable
                        tournamentId={tournament.id}
                        ageCategory={activeAgeCategory}
                        format={tournament.format}
                      />
                    </section>
                  )}

                  {activeTab === "statistics" && (
                    <section>
                      <TournamentStatistics
                        tournamentId={tournament.id}
                        ageCategory={activeAgeCategory}
                      />
                    </section>
                  )}

                  {activeTab === "groups" && isGroupFormat && (
                    <section>
                      <GroupManagement
                        tournamentId={tournament.id}
                        ageCategory={activeAgeCategory}
                      />
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">
                  Please select an age category to manage teams and matches.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TournamentDashboard;
