import React, { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { TournamentStatsSummary, PlayerStatEntry, AgeCategory } from "@/types/admin";

interface TournamentStatisticsProps {
  tournamentId: string;
  ageCategory: AgeCategory;
}

const StatCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  entries: PlayerStatEntry[];
  statKey: "goals" | "assists" | "matchesPlayed";
  perMatchKey?: "goalsPerMatch" | "assistsPerMatch";
}> = ({ title, icon, color, entries, statKey, perMatchKey }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className={`px-6 py-4 ${color} border-b`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      </div>
    </div>
    {entries.length === 0 ? (
      <div className="px-6 py-10 text-center text-gray-400 text-sm">No data available</div>
    ) : (
      <div className="divide-y divide-gray-50">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-center px-6 py-3 hover:bg-gray-50/50 transition-colors">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
              i === 0 ? "bg-yellow-100 text-yellow-700" :
              i === 1 ? "bg-gray-200 text-gray-600" :
              i === 2 ? "bg-amber-100 text-amber-700" :
              "bg-gray-100 text-gray-400"
            }`}>
              {entry.rank || i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{entry.player?.name || "Unknown"}</div>
              <div className="text-xs text-gray-400 truncate">{entry.team?.name || "—"}</div>
            </div>
            <div className="text-right ml-3">
              <div className="text-lg font-extrabold text-gray-900">{entry.statistics[statKey]}</div>
              {perMatchKey && entry.statistics[perMatchKey] != null && (
                <div className="text-[10px] text-gray-400 font-semibold uppercase">
                  {entry.statistics[perMatchKey].toFixed(2)}/match
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TournamentStatistics: React.FC<TournamentStatisticsProps> = ({ tournamentId, ageCategory }) => {
  const [stats, setStats] = useState<TournamentStatsSummary | null>(null);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getTournamentStatsSummary(tournamentId, ageCategory, limit);
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch statistics";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, ageCategory, limit]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Statistics</h2>
            <p className="text-sm text-gray-500 mt-1">{ageCategory.replace("_", "-")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-10 bg-gray-100 rounded mb-2 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Statistics</h2>
          <p className="text-sm text-gray-500 mt-1">{ageCategory.replace("_", "-")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase">Show top</span>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {[5, 10, 20].map((n) => (
              <button
                key={n}
                onClick={() => setLimit(n)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  limit === n ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          title="Top Scorers"
          icon={<span className="text-lg">⚽</span>}
          color="bg-emerald-50/80"
          entries={stats?.topScorers || []}
          statKey="goals"
          perMatchKey="goalsPerMatch"
        />
        <StatCard
          title="Top Assists"
          icon={<span className="text-lg">🎯</span>}
          color="bg-blue-50/80"
          entries={stats?.topAssists || []}
          statKey="assists"
          perMatchKey="assistsPerMatch"
        />
        <StatCard
          title="Most Matches"
          icon={<span className="text-lg">🏃</span>}
          color="bg-purple-50/80"
          entries={stats?.mostMatchesPlayed || []}
          statKey="matchesPlayed"
        />
      </div>
    </div>
  );
};

export default TournamentStatistics;
