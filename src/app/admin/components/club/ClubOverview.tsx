import React, { useMemo } from "react";
import { Team } from "@/types/admin";
import {
  FaUsers,
  FaTrophy,
  FaCalendarAlt,
  FaCheckCircle,
  FaChartLine,
  FaArrowRight,
  FaFutbol,
  FaShieldAlt,
  FaUserPlus,
  FaPercentage,
} from "react-icons/fa";

interface ClubOverviewProps {
  team: Team | null;
  onNavigate?: (tab: string) => void;
}

const ClubOverview: React.FC<ClubOverviewProps> = ({ team, onNavigate }) => {
  const stats = useMemo(() => {
    if (!team)
      return {
        players: 0,
        tournaments: 0,
        upcoming: 0,
        completed: 0,
        totalGoals: 0,
        cleanSheets: 0,
        winRate: 0,
        wins: 0,
        draws: 0,
        losses: 0,
      };

    const finished = team.finishedMatches || [];
    let wins = 0,
      draws = 0,
      losses = 0,
      totalGoals = 0,
      cleanSheets = 0;

    finished.forEach((match) => {
      const isHome = match.homeTeamId === team.id;
      const myScore = isHome
        ? match.homeScore ?? 0
        : match.awayScore ?? 0;
      const theirScore = isHome
        ? match.awayScore ?? 0
        : match.homeScore ?? 0;

      totalGoals += myScore;
      if (theirScore === 0) cleanSheets++;
      if (myScore > theirScore) wins++;
      else if (myScore === theirScore) draws++;
      else losses++;
    });

    return {
      players: team.players?.length || 0,
      tournaments: team.tournaments?.length || 0,
      upcoming: team.scheduledMatches?.length || 0,
      completed: finished.length,
      totalGoals,
      cleanSheets,
      winRate: finished.length > 0 ? Math.round((wins / finished.length) * 100) : 0,
      wins,
      draws,
      losses,
    };
  }, [team]);

  const recentForm = useMemo(() => {
    if (!team || !team.finishedMatches) return [];
    return team.finishedMatches
      .slice(-5)
      .reverse()
      .map((match) => {
        const isHome = match.homeTeamId === team.id;
        const myScore = isHome
          ? match.homeScore ?? 0
          : match.awayScore ?? 0;
        const theirScore = isHome
          ? match.awayScore ?? 0
          : match.homeScore ?? 0;
        if (myScore > theirScore) return "W";
        if (myScore < theirScore) return "L";
        return "D";
      });
  }, [team]);

  const primaryCards = [
    {
      label: "Squad Size",
      value: stats.players,
      icon: FaUsers,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Tournaments",
      value: stats.tournaments,
      icon: FaTrophy,
      gradient: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: FaCalendarAlt,
      gradient: "from-purple-500 to-indigo-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Played",
      value: stats.completed,
      icon: FaCheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];

  if (!team) return null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with{" "}
          <span className="font-semibold text-gray-700">{team.name}</span>{" "}
          today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md border border-gray-100"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgLight} ${card.textColor} transition-transform group-hover:scale-110`}
                >
                  <Icon className="text-base" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Stats Row */}
      {stats.completed > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaPercentage className="text-emerald-200 text-sm" />
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                Win Rate
              </span>
            </div>
            <p className="text-3xl font-bold tabular-nums">{stats.winRate}%</p>
            <p className="text-xs text-emerald-200 mt-1">
              {stats.wins}W / {stats.draws}D / {stats.losses}L
            </p>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaFutbol className="text-blue-200 text-sm" />
              <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                Goals Scored
              </span>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {stats.totalGoals}
            </p>
            <p className="text-xs text-blue-200 mt-1">
              {stats.completed > 0
                ? (stats.totalGoals / stats.completed).toFixed(1)
                : 0}{" "}
              per match
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-purple-200 text-sm" />
              <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">
                Clean Sheets
              </span>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {stats.cleanSheets}
            </p>
            <p className="text-xs text-purple-200 mt-1">
              {stats.completed > 0
                ? Math.round((stats.cleanSheets / stats.completed) * 100)
                : 0}
              % of matches
            </p>
          </div>

          <div className="bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="text-amber-200 text-sm" />
              <span className="text-xs font-medium text-amber-100 uppercase tracking-wider">
                Victories
              </span>
            </div>
            <p className="text-3xl font-bold tabular-nums">{stats.wins}</p>
            <p className="text-xs text-amber-200 mt-1">
              out of {stats.completed} matches
            </p>
          </div>
        </div>
      )}

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FaChartLine className="text-gray-400" />
              Recent Form
            </h3>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Last 5
            </span>
          </div>
          {recentForm.length > 0 ? (
            <div className="flex gap-2">
              {recentForm.map((result, i) => (
                <div
                  key={i}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-transform hover:scale-110 ${
                    result === "W"
                      ? "bg-emerald-100 text-emerald-700"
                      : result === "L"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No completed matches yet</p>
          )}
        </div>

        {/* Coach Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Coach Information
          </h3>
          <div className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-blue-50/50 rounded-xl">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              {team.coach ? team.coach.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {team.coach || "No Coach Assigned"}
              </p>
              <p className="text-xs text-gray-500">
                Head Coach • {team.ageCategory.replace("_", "-")}
              </p>
            </div>
          </div>
        </div>

        {/* Next Match */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-900">Next Match</h3>
          </div>
          {team.scheduledMatches && team.scheduledMatches.length > 0 ? (
            <div className="space-y-3">
              {team.scheduledMatches.slice(0, 2).map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {match.homeTeam?.name || "Home"}{" "}
                      <span className="text-gray-400">vs</span>{" "}
                      {match.awayTeam?.name || "Away"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                      {match.ageCategory.replace("_", " ")}
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap">
                    {new Date(match.date).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              <FaCalendarAlt className="mb-2 text-xl opacity-20" />
              <span className="text-xs">No matches scheduled</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {onNavigate && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate("players")}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 hover:border-blue-200 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <FaUsers />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                View Squad
              </span>
            </button>

            <button
              onClick={() => onNavigate("matches")}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-200 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <FaFutbol />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                Matches
              </span>
            </button>

            <button
              onClick={() => onNavigate("tournaments")}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-amber-50/50 border border-amber-100/50 hover:bg-amber-50 hover:border-amber-200 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <FaTrophy />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                Tournaments
              </span>
            </button>

            <button
              onClick={() => onNavigate("info")}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-purple-50/50 border border-purple-100/50 hover:bg-purple-50 hover:border-purple-200 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <FaShieldAlt />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                Club Info
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubOverview;
