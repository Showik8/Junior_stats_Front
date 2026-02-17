import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Standing, Group, AgeCategory } from "@/types/admin";
import { FaSync } from "react-icons/fa";

interface StandingsTableProps {
  tournamentId: string;
  ageCategory: AgeCategory;
  format: string;
}

const medalIcons: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

const StandingsTable: React.FC<StandingsTableProps> = ({
  tournamentId,
  ageCategory,
  format,
}) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGroupFormat = format === "GROUP_KNOCKOUT";

  const fetchGroups = async () => {
    if (!isGroupFormat) return;
    try {
      const data = await adminService.getGroups(tournamentId, ageCategory);
      setGroups(data);
      if (data.length > 0 && !selectedGroupId) {
        setSelectedGroupId(data[0].id);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch groups:", err);
    }
  };

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getStandings(
        tournamentId,
        ageCategory,
        selectedGroupId
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
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, ageCategory]);

  useEffect(() => {
    fetchStandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, ageCategory, selectedGroupId]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const data = await adminService.recalculateStandings(
        tournamentId,
        ageCategory
      );
      setStandings(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to recalculate";
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
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Standings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {ageCategory.replace("_", "-")}
            {isGroupFormat && selectedGroupId && groups.length > 0 && (
              <> • {groups.find((g) => g.id === selectedGroupId)?.name || "All Groups"}</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isGroupFormat && groups.length > 0 && (
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    selectedGroupId === g.id
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 text-sm font-semibold shadow-lg shadow-blue-200 transition-all"
          >
            <FaSync className={recalculating ? "animate-spin" : ""} size={12} />
            {recalculating ? "Recalculating..." : "Recalculate"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm font-medium">No standings available</p>
          <p className="text-xs mt-1">
            Play matches and recalculate to see standings.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500">
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest w-12">
                    #
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-widest">
                    Team
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-12">
                    P
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-12">
                    W
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-12">
                    D
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-12">
                    L
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-14">
                    GF
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-14">
                    GA
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-14">
                    GD
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-bold uppercase tracking-widest w-14">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((standing, index) => {
                  const rank = index + 1;
                  const gd = standing.goalsFor - standing.goalsAgainst;
                  const medal = medalIcons[rank];

                  // Row highlight classes
                  let rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50/30";
                  if (rank <= 2) rowBg = "bg-emerald-50/40";

                  return (
                    <tr
                      key={standing.id || index}
                      className={`${rowBg} hover:bg-blue-50/40 transition-colors`}
                    >
                      {/* Rank */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center">
                          {medal ? (
                            <span className="text-lg leading-none" title={`Position ${rank}`}>
                              {medal}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-gray-400 w-7 h-7 flex items-center justify-center">
                              {rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Team */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                            {standing.team?.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={standing.team.logo}
                                alt={standing.team?.name || ""}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-gray-400">
                                {(standing.team?.name || "?").charAt(0)}
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-semibold truncate ${
                              rank <= 3 ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {standing.team?.name || "Unknown Team"}
                          </span>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3.5 text-center font-semibold text-gray-600">
                        {standing.played}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-emerald-600">
                        {standing.wins}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-gray-500">
                        {standing.draws}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-red-500">
                        {standing.losses}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600">
                        {standing.goalsFor}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600">
                        {standing.goalsAgainst}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`font-bold ${
                            gd > 0
                              ? "text-emerald-600"
                              : gd < 0
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          {gd > 0 ? `+${gd}` : gd}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-sm ${
                            rank <= 2
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {standing.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandingsTable;
