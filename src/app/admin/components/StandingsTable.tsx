import React, { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { Standing, AgeCategory, Group } from "@/types/admin";
import { FaSync, FaChevronDown } from "react-icons/fa";

interface StandingsTableProps {
  tournamentId: string;
  ageCategory: AgeCategory;
  format?: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ tournamentId, ageCategory, format }) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGroupFormat = format === "GROUP_KNOCKOUT";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isGroupFormat) {
        const groupsData = await adminService.getGroups(tournamentId, ageCategory);
        setGroups(groupsData);
      }
      const data = await adminService.getStandings(
        tournamentId,
        ageCategory,
        selectedGroup || undefined
      );
      setStandings(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch standings";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, ageCategory, selectedGroup]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    setError(null);
    try {
      const data = await adminService.recalculateStandings(tournamentId, ageCategory);
      setStandings(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to recalculate standings";
      setError(msg);
    } finally {
      setRecalculating(false);
    }
  };

  const sorted = [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Standings</h2>
          <p className="text-sm text-gray-500 mt-1">{ageCategory.replace("_", "-")} • {sorted.length} Teams</p>
        </div>
        <div className="flex items-center gap-3">
          {isGroupFormat && groups.length > 0 && (
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">All Groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          )}
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 text-sm font-semibold shadow-lg shadow-blue-200 transition-all"
          >
            <FaSync className={`text-xs ${recalculating ? "animate-spin" : ""}`} />
            {recalculating ? "Calculating..." : "Recalculate"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <p className="text-sm font-medium">No standings available</p>
          <p className="text-xs mt-1">Play some matches and recalculate to see standings.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-10">#</th>
                <th className="text-left py-3 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Team</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">P</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">W</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">D</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">L</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">GF</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">GA</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">GD</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-blue-500 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => {
                const gd = s.goalsFor - s.goalsAgainst;
                return (
                  <tr key={s.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i < 2 ? "bg-emerald-50/30" : ""}`}>
                    <td className="py-3 px-3 text-sm font-bold text-gray-400">{i + 1}</td>
                    <td className="py-3 px-3 text-sm font-bold text-gray-900">{s.team?.name || "—"}</td>
                    <td className="py-3 px-2 text-sm text-center text-gray-600">{s.played}</td>
                    <td className="py-3 px-2 text-sm text-center text-gray-600">{s.wins}</td>
                    <td className="py-3 px-2 text-sm text-center text-gray-600">{s.draws}</td>
                    <td className="py-3 px-2 text-sm text-center text-gray-600">{s.losses}</td>
                    <td className="py-3 px-2 text-sm text-center text-gray-600">{s.goalsFor}</td>
                    <td className="py-3 px-2 text-sm text-center text-gray-600">{s.goalsAgainst}</td>
                    <td className={`py-3 px-2 text-sm text-center font-semibold ${gd > 0 ? "text-emerald-600" : gd < 0 ? "text-red-500" : "text-gray-400"}`}>
                      {gd > 0 ? `+${gd}` : gd}
                    </td>
                    <td className="py-3 px-2 text-sm text-center font-extrabold text-blue-600">{s.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StandingsTable;
