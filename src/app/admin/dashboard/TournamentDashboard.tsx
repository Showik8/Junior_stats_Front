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

type DashboardTab = "matches" | "members" | "standings" | "statistics" | "groups";

const TournamentDashboard: React.FC = () => {
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
       console.error("Tournament info fetch error:", err);
       setError(err.message || "Failed to load tournament info");
       return null;
    }
  };

  const fetchCategoryData = async (tournId: string, category: AgeCategory) => {
      try {
        setLoading(true);
        const [fetchedTeams, fetchedMatches] = await Promise.all([
             adminService.getTeams(tournId, category),
             adminService.getMatches(tournId, category)
        ]);
        setTeams(fetchedTeams);
        setMatches(fetchedMatches);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
          console.error("Category data fetch error:", err);
      } finally {
          setLoading(false);
      }
  }

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Reload Page
                </button>
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
     )
  }

  const availableCategories: AgeCategory[] = tournament?.ageCategories?.map(c => c.ageCategory) || 
                                            (tournament?.ageCategory ? [tournament.ageCategory as AgeCategory] : []);

  const isGroupFormat = tournament?.format === "GROUP_KNOCKOUT";

  const tabs: { key: DashboardTab; label: string; show: boolean }[] = [
    { key: "matches", label: "Matches", show: true },
    { key: "members", label: "Members", show: true },
    { key: "standings", label: "Standings", show: true },
    { key: "statistics", label: "Statistics", show: true },
    { key: "groups", label: "Groups", show: isGroupFormat },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header / Nav */}
      <nav className="shadow-sm border-b border-gray-200 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                   JA
               </div>
               <div>
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                    Junior Stats
                  </h1>
                  <span className="text-xs text-gray-500 font-medium">Tournament Admin</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExit}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                title="Go to Home"
              >
               <span className="hidden sm:inline">View Site</span>
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Sign Out"
              >
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tournament Info Section */}
        <section>
            <TournamentInfo tournament={tournament} loading={loading} />
        </section>

        {tournament && (
            <div>
                {/* Age Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-1">
                   {availableCategories.length > 0 ? availableCategories.map(cat => (
                       <button
                          key={cat}
                          onClick={() => setActiveAgeCategory(cat)}
                          className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all relative top-[1] ${
                              activeAgeCategory === cat 
                                ? "bg-white text-blue-600 border border-gray-200 border-b-white shadow-sm" 
                                : "bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent"
                          }`}
                       >
                           {cat.replace('_', '-')}
                       </button>
                   )) : (
                       <div className="px-4 py-2 text-sm text-gray-400">No age categories defined</div>
                   )}
                </div>

                {activeAgeCategory ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Content Tabs */}
                        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                            {tabs.filter(t => t.show).map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                                        activeTab === tab.key
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
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
                        <p className="text-gray-500">Please select an age category to manage teams and matches.</p>
                    </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default TournamentDashboard;
