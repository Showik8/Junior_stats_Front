import React, { useMemo, useState, useEffect } from "react";
import { Team, Tournament, Standing, AgeCategory } from "@/types/admin";
import { standingService } from "@/services/standing.service";
import {
  FaTrophy,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaTable,
} from "react-icons/fa";

interface TournamentsModuleProps {
  team: Team | null;
}

interface TournamentWithMeta extends Tournament {
  joinStatus: string;
  joinedAt: string;
}

const TournamentsModule: React.FC<TournamentsModuleProps> = ({ team }) => {
  const tournaments = useMemo(() => {
    if (!team || !team.tournaments) return [];
    return team.tournaments.map(
      (t) =>
        ({
          ...t.tournament,
          joinStatus: t.status,
          joinedAt: t.joinedAt,
        } as TournamentWithMeta)
    );
  }, [team]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(false);

  const handleExpand = async (tournament: TournamentWithMeta) => {
    if (expandedId === tournament.id) {
      setExpandedId(null);
      setStandings([]);
      return;
    }

    setExpandedId(tournament.id);
    setStandingsLoading(true);
    try {
      const data = await standingService.getStandings(
        tournament.id,
        team?.ageCategory as AgeCategory
      );
      setStandings(data);
    } catch (err) {
      console.error("Failed to fetch standings:", err);
      setStandings([]);
    } finally {
      setStandingsLoading(false);
    }
  };

  if (!team) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tournaments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tournaments {team.name} is currently participating in. Click to view
          standings.
        </p>
      </div>

      {tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-white border-2 border-dashed border-gray-200 text-gray-400">
          <FaTrophy className="mb-3 text-3xl opacity-20" />
          <p className="font-medium text-gray-500">
            Not participating in any tournaments yet.
          </p>
          <p className="text-xs mt-1 text-gray-400">
            Ask a super admin to add you to a tournament.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => {
            const isExpanded = expandedId === tournament.id;

            return (
              <div
                key={tournament.id}
                className={`bg-white rounded-xl border transition-all ${
                  isExpanded
                    ? "border-amber-200 shadow-md ring-1 ring-amber-100"
                    : "border-gray-100 hover:shadow-md"
                }`}
              >
                {/* Tournament header — clickable */}
                <button
                  onClick={() => handleExpand(tournament)}
                  className="w-full text-left"
                >
                  <div className="p-5 flex items-center gap-5">
                    {/* Trophy icon */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                        isExpanded
                          ? "bg-amber-100 text-amber-600"
                          : "bg-amber-50 text-amber-500"
                      }`}
                    >
                      <FaTrophy className="text-xl" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900">
                          {tournament.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            tournament.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tournament.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400" />
                          Joined:{" "}
                          {new Date(tournament.joinedAt).toLocaleDateString()}
                        </span>
                        {tournament.startDate && (
                          <span>
                            Start:{" "}
                            {new Date(
                              tournament.startDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {tournament.format && (
                          <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                            {tournament.format}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div
                      className={`p-2 rounded-lg transition shrink-0 ${
                        isExpanded
                          ? "bg-amber-100 text-amber-600"
                          : "text-gray-300"
                      }`}
                    >
                      {isExpanded ? (
                        <FaChevronUp className="text-sm" />
                      ) : (
                        <FaChevronDown className="text-sm" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded standings table */}
                {isExpanded && (
                  <div className="border-t border-amber-100 p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaTable className="text-gray-400" />
                      League Table — {team.ageCategory.replace("_", " ")}
                    </h4>

                    {standingsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                        <span className="ml-3 text-sm text-gray-500">
                          Loading standings...
                        </span>
                      </div>
                    ) : standings.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-400 text-sm">
                        <FaTable className="mx-auto mb-2 text-xl opacity-20" />
                        No standings data available for this tournament
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3 font-semibold w-8">
                                #
                              </th>
                              <th className="px-4 py-3 font-semibold">Team</th>
                              <th className="px-4 py-3 font-semibold text-center">
                                P
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                W
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                D
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                L
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                GF
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                GA
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                GD
                              </th>
                              <th className="px-4 py-3 font-semibold text-center">
                                PTS
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {standings
                              .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
                              .map((standing, idx) => {
                                const isMyTeam =
                                  standing.teamId === team.id;
                                const gd =
                                  standing.goalsFor - standing.goalsAgainst;
                                return (
                                  <tr
                                    key={standing.id}
                                    className={`transition ${
                                      isMyTeam
                                        ? "bg-blue-50/70 font-semibold"
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    <td className="px-4 py-2.5">
                                      <span
                                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                          idx === 0
                                            ? "bg-amber-100 text-amber-700"
                                            : idx === 1
                                            ? "bg-gray-200 text-gray-700"
                                            : idx === 2
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        {idx + 1}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                      <span
                                        className={`${
                                          isMyTeam
                                            ? "text-blue-700"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {standing.team?.name || "Unknown"}
                                        {isMyTeam && (
                                          <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide">
                                            You
                                          </span>
                                        )}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-gray-600">
                                      {standing.played}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-emerald-600 font-semibold">
                                      {standing.wins}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-amber-600">
                                      {standing.draws}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-red-500">
                                      {standing.losses}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-gray-600">
                                      {standing.goalsFor}
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-gray-600">
                                      {standing.goalsAgainst}
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                      <span
                                        className={`font-semibold ${
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
                                    <td className="px-4 py-2.5 text-center">
                                      <span
                                        className={`inline-flex items-center justify-center h-7 w-7 rounded-lg text-sm font-bold ${
                                          isMyTeam
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-800"
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
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TournamentsModule;
