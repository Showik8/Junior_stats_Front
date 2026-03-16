import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Team, Match, MatchEvent, MatchPlayerStatistic } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { matchService } from "@/services/match.service";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFutbol,
  FaChevronDown,
  FaChevronUp,
  FaExchangeAlt,
  FaUsers,
} from "react-icons/fa";
import LineupForm from "../LineupForm";

interface MatchesModuleProps {
  team: Team | null;
}

type TabFilter = "all" | "scheduled" | "finished" | "cancelled";

const MatchesModule: React.FC<MatchesModuleProps> = ({ team }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Expanded match state
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [expandedMatchData, setExpandedMatchData] = useState<Match | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);

  // Lineup modal state
  const [lineupMatchId, setLineupMatchId] = useState<string | null>(null);

  useEffect(() => {
    if (team?.id) {
      fetchMatches();
    }
  }, [team]);

  const fetchMatches = async () => {
    if (!team) return;
    try {
      setLoading(true);
      const data = await adminService.getTeamMatches(team.id);
      setMatches(data);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      setError("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandMatch = useCallback(
    async (matchId: string) => {
      if (expandedMatchId === matchId) {
        setExpandedMatchId(null);
        setExpandedMatchData(null);
        return;
      }

      setExpandedMatchId(matchId);
      setExpandLoading(true);
      try {
        const data = await matchService.getMatch(matchId);
        setExpandedMatchData(data);
      } catch (err) {
        console.error("Failed to fetch match details:", err);
        setExpandedMatchData(null);
      } finally {
        setExpandLoading(false);
      }
    },
    [expandedMatchId]
  );

  const filteredMatches = useMemo(() => {
    let result = matches;

    if (activeTab === "scheduled") {
      result = result.filter((m) => m.status === "SCHEDULED");
    } else if (activeTab === "finished") {
      result = result.filter((m) => m.status === "FINISHED");
    } else if (activeTab === "cancelled") {
      result = result.filter((m) => m.status === "CANCELLED");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.homeTeam?.name?.toLowerCase().includes(q) ||
          m.awayTeam?.name?.toLowerCase().includes(q) ||
          m.tournament?.name?.toLowerCase().includes(q)
      );
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [matches, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: matches.length,
      scheduled: matches.filter((m) => m.status === "SCHEDULED").length,
      finished: matches.filter((m) => m.status === "FINISHED").length,
      cancelled: matches.filter((m) => m.status === "CANCELLED").length,
    };
  }, [matches]);

  if (!team) return null;

  const tabs: { id: TabFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "scheduled", label: "Scheduled", count: counts.scheduled },
    { id: "finished", label: "Completed", count: counts.finished },
    { id: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "FINISHED":
        return {
          icon: <FaCheckCircle />,
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          badge: "bg-emerald-100 text-emerald-700",
          label: "Completed",
        };
      case "CANCELLED":
        return {
          icon: <FaTimesCircle />,
          bg: "bg-red-50",
          text: "text-red-500",
          badge: "bg-red-100 text-red-700",
          label: "Cancelled",
        };
      default:
        return {
          icon: <FaClock />,
          bg: "bg-blue-50",
          text: "text-blue-600",
          badge: "bg-blue-100 text-blue-700",
          label: "Scheduled",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString("en", { month: "short" }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Match Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            View all matches for {team.name} — click to see details
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by team or tournament..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse"
            >
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
          <FaTimesCircle className="mx-auto mb-2 text-xl" />
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchMatches}
            className="mt-3 text-sm font-medium text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-white border-2 border-dashed border-gray-200 text-gray-400">
          <FaCalendarAlt className="mb-3 text-3xl opacity-20" />
          <p className="font-medium text-gray-500">
            {searchQuery ? "No matches match your search" : "No matches found"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => {
            const isFinished = match.status === "FINISHED";
            const isCancelled = match.status === "CANCELLED";
            const config = getStatusConfig(match.status);
            const date = formatDate(match.date);
            const isHome = match.homeTeamId === team.id;
            const isExpanded = expandedMatchId === match.id;

            return (
              <div
                key={match.id}
                className={`group bg-white rounded-xl border transition-all ${
                  isCancelled
                    ? "border-gray-200 opacity-60"
                    : isExpanded
                    ? "border-blue-200 shadow-md ring-1 ring-blue-100"
                    : "border-gray-100 hover:shadow-md"
                }`}
              >
                {/* Main match row — clickable */}
                <button
                  onClick={() => handleExpandMatch(match.id)}
                  className="w-full text-left"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5">
                    {/* Date block */}
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <div
                        className={`flex flex-col items-center justify-center h-14 w-14 rounded-xl ${config.bg} shrink-0`}
                      >
                        <span className={`text-lg font-bold ${config.text}`}>
                          {date.day}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase ${config.text}`}
                        >
                          {date.month}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}
                        >
                          {config.icon}
                          {config.label}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {date.time}
                        </p>
                      </div>
                    </div>

                    {/* Teams & Score */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-4 w-full max-w-md">
                        <div className="flex-1 text-right">
                          <p
                            className={`font-bold text-sm ${
                              match.homeTeamId === team.id
                                ? "text-blue-600"
                                : "text-gray-900"
                            }`}
                          >
                            {match.homeTeam?.name || "Unknown"}
                          </p>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Home
                          </span>
                        </div>

                        <div className="shrink-0">
                          {isFinished &&
                          match.homeScore != null &&
                          match.awayScore != null ? (
                            <div className="flex items-center gap-1 px-4 py-2 bg-gray-900 rounded-xl text-white min-w-[80px] justify-center">
                              <span className="text-lg font-bold tabular-nums">
                                {match.homeScore}
                              </span>
                              <span className="text-gray-400 text-sm mx-0.5">
                                :
                              </span>
                              <span className="text-lg font-bold tabular-nums">
                                {match.awayScore}
                              </span>
                            </div>
                          ) : isCancelled ? (
                            <div className="px-4 py-2 bg-gray-100 rounded-xl text-center min-w-[80px]">
                              <span className="text-xs font-bold text-gray-400 uppercase">
                                CNC
                              </span>
                            </div>
                          ) : (
                            <div className="px-4 py-2 bg-gray-50 rounded-xl text-center min-w-[80px] border border-gray-200">
                              <span className="text-sm font-bold text-gray-400">
                                VS
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-left">
                          <p
                            className={`font-bold text-sm ${
                              match.awayTeamId === team.id
                                ? "text-blue-600"
                                : "text-gray-900"
                            }`}
                          >
                            {match.awayTeam?.name || "Unknown"}
                          </p>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Away
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta + expand icon */}
                    <div className="md:text-right min-w-[150px] flex items-center md:justify-end gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {match.tournament?.name || "Tournament"}
                        </p>
                        <div className="flex md:justify-end gap-2 flex-wrap">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                            {match.ageCategory.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-1.5 rounded-lg transition ${
                          isExpanded
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-300 group-hover:text-gray-500"
                        }`}
                      >
                        {isExpanded ? (
                          <FaChevronUp className="text-xs" />
                        ) : (
                          <FaChevronDown className="text-xs" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Lineup button for scheduled matches */}
                {match.status === "SCHEDULED" && (
                  <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLineupMatchId(match.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                    >
                      <FaUsers className="text-[10px]" />
                      შემადგენლობა
                    </button>
                  </div>
                )}

                {/* Win/Loss indicator */}
                {isFinished &&
                  match.homeScore != null &&
                  match.awayScore != null &&
                  !isExpanded && (
                    <div
                      className={`px-5 py-2 border-t text-xs font-medium flex items-center gap-2 ${
                        (isHome && match.homeScore > match.awayScore) ||
                        (!isHome && match.awayScore > match.homeScore)
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : match.homeScore === match.awayScore
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      <span className="font-bold">
                        {(isHome && match.homeScore > match.awayScore) ||
                        (!isHome && match.awayScore > match.homeScore)
                          ? "🏆 WIN"
                          : match.homeScore === match.awayScore
                          ? "🤝 DRAW"
                          : "❌ LOSS"}
                      </span>
                    </div>
                  )}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-blue-100">
                    {expandLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        <span className="ml-3 text-sm text-gray-500">
                          Loading match details...
                        </span>
                      </div>
                    ) : expandedMatchData ? (
                      <MatchDetails
                        match={expandedMatchData}
                        teamId={team.id}
                      />
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        Could not load match details
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

    {/* Lineup Modal */}
    {lineupMatchId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLineupMatchId(null)} />
        <div className="relative w-full max-w-3xl max-h-[95vh] z-10 mx-4">
          <LineupForm
            match={matches.find(m => m.id === lineupMatchId)!}
            teamId={team!.id}
            onClose={() => setLineupMatchId(null)}
            onSuccess={() => {}}
          />
        </div>
      </div>
    )}
    </>
  );
};

// =====================================================
// MatchDetails — Expanded panel showing events & stats
// =====================================================

const MatchDetails: React.FC<{ match: Match; teamId: string }> = ({
  match,
  teamId,
}) => {
  const events = match.events || [];
  const playerStats = match.playerStats || [];

  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "GOAL":
        return "⚽";
      case "PENALTY":
        return "🎯";
      case "OWN_GOAL":
        return "🔴";
      case "YELLOW_CARD":
        return "🟨";
      case "RED_CARD":
        return "🟥";
      case "SUBSTITUTION":
        return "🔄";
      default:
        return "📋";
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case "GOAL":
        return "Goal";
      case "PENALTY":
        return "Penalty";
      case "OWN_GOAL":
        return "Own Goal";
      case "YELLOW_CARD":
        return "Yellow Card";
      case "RED_CARD":
        return "Red Card";
      case "SUBSTITUTION":
        return "Substitution";
      default:
        return eventType;
    }
  };

  // Find player name by id from playerStats
  const getPlayerName = (playerId: string | null | undefined) => {
    if (!playerId) return "Unknown";
    const stat = playerStats.find((s) => s.playerId === playerId);
    return stat?.player?.name || "Player #" + playerId.slice(0, 6);
  };

  const isHome = match.homeTeamId === teamId;
  const myScore = isHome ? match.homeScore ?? 0 : match.awayScore ?? 0;
  const theirScore = isHome ? match.awayScore ?? 0 : match.homeScore ?? 0;

  return (
    <div className="p-5 space-y-6">
      {/* Result banner */}
      {match.status === "FINISHED" &&
        match.homeScore != null &&
        match.awayScore != null && (
          <div
            className={`rounded-xl p-4 flex items-center justify-between ${
              myScore > theirScore
                ? "bg-emerald-50 border border-emerald-100"
                : myScore < theirScore
                ? "bg-red-50 border border-red-100"
                : "bg-amber-50 border border-amber-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {myScore > theirScore
                  ? "🏆"
                  : myScore < theirScore
                  ? "❌"
                  : "🤝"}
              </span>
              <div>
                <p
                  className={`font-bold text-sm ${
                    myScore > theirScore
                      ? "text-emerald-800"
                      : myScore < theirScore
                      ? "text-red-800"
                      : "text-amber-800"
                  }`}
                >
                  {myScore > theirScore
                    ? "Victory"
                    : myScore < theirScore
                    ? "Defeat"
                    : "Draw"}
                </p>
                <p className="text-xs text-gray-500">
                  Final Score: {match.homeScore} - {match.awayScore}
                </p>
              </div>
            </div>
            {match.venue && (
              <span className="text-xs text-gray-500 hidden sm:block">
                📍 {match.venue}
              </span>
            )}
          </div>
        )}

      {/* Match info row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {match.venue && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Venue
            </p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {match.venue}
            </p>
          </div>
        )}
        {match.referee && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Referee
            </p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {match.referee}
            </p>
          </div>
        )}
        {match.group && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Group
            </p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {match.group.name}
            </p>
          </div>
        )}
        {match.attendees != null && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Attendance
            </p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {match.attendees}
            </p>
          </div>
        )}
      </div>

      {/* Events timeline */}
      {sortedEvents.length > 0 ? (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaFutbol className="text-gray-400" />
            Match Events
          </h4>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />

            <div className="space-y-1">
              {sortedEvents.map((event, idx) => {
                const isMyTeam = event.teamId === teamId;
                return (
                  <div key={event.id || idx} className="flex items-start gap-3 relative">
                    {/* Minute badge */}
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white border-2 border-gray-200 text-xs font-bold text-gray-700 z-10 shrink-0">
                      {event.minute}&apos;
                    </div>

                    {/* Event content */}
                    <div
                      className={`flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5 ${
                        isMyTeam
                          ? "bg-blue-50/70 border border-blue-100"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <span className="text-lg">
                        {getEventIcon(event.eventType)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {getEventLabel(event.eventType)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {getPlayerName(event.playerId)}
                          {event.assistPlayerId &&
                            event.eventType === "GOAL" &&
                            ` (Assist: ${getPlayerName(
                              event.assistPlayerId
                            )})`}
                          {event.description && ` — ${event.description}`}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          isMyTeam
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isMyTeam
                          ? match.homeTeamId === teamId
                            ? match.homeTeam?.name?.slice(0, 8)
                            : match.awayTeam?.name?.slice(0, 8)
                          : match.homeTeamId !== teamId
                          ? match.homeTeam?.name?.slice(0, 8)
                          : match.awayTeam?.name?.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-xl text-gray-400 text-sm">
          <FaFutbol className="mx-auto mb-2 text-xl opacity-20" />
          No match events recorded
        </div>
      )}

      {/* Player Stats for finished matches */}
      {playerStats.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3">
            Player Statistics
          </h4>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-semibold">Player</th>
                  <th className="px-4 py-3 font-semibold text-center">Min</th>
                  <th className="px-4 py-3 font-semibold text-center">⚽</th>
                  <th className="px-4 py-3 font-semibold text-center">🅰️</th>
                  <th className="px-4 py-3 font-semibold text-center">🟨</th>
                  <th className="px-4 py-3 font-semibold text-center">🟥</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {playerStats
                  .filter((s) => s.played)
                  .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
                  .map((stat) => (
                    <tr key={stat.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-gray-900">
                          {stat.player?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center text-gray-500">
                        {stat.minutesPlayed ?? "-"}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`font-bold ${
                            stat.goals > 0
                              ? "text-emerald-600"
                              : "text-gray-300"
                          }`}
                        >
                          {stat.goals}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`font-bold ${
                            stat.assists > 0
                              ? "text-blue-600"
                              : "text-gray-300"
                          }`}
                        >
                          {stat.assists}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`font-bold ${
                            stat.yellowCards > 0
                              ? "text-amber-600"
                              : "text-gray-300"
                          }`}
                        >
                          {stat.yellowCards}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`font-bold ${
                            stat.redCards > 0
                              ? "text-red-600"
                              : "text-gray-300"
                          }`}
                        >
                          {stat.redCards}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {match.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Match Notes
          </p>
          <p className="text-sm text-amber-700">{match.notes}</p>
        </div>
      )}
    </div>
  );
};

export default MatchesModule;
