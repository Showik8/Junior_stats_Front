"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import { GiSoccerBall, GiShield, GiWhistle } from "react-icons/gi";
import LoadingSpinner from "@/app/components/public/shared/LoadingSpinner";
import EmptyState from "@/app/components/public/shared/EmptyState";
import TeamLogo from "@/app/components/public/shared/TeamLogo";
import { formatFullDate } from "@/app/utils/format";

/* eslint-disable @typescript-eslint/no-explicit-any */

const eventConfig: Record<string, { bg: string; text: string; icon: string }> = {
  GOAL: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", icon: "⚽" },
  ASSIST: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", icon: "👟" },
  YELLOW_CARD: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", icon: "🟨" },
  RED_CARD: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", icon: "🟥" },
  SUBSTITUTION_IN: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400", icon: "↗️" },
  SUBSTITUTION_OUT: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", icon: "↙️" },
  OWN_GOAL: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", icon: "🔴" },
  PENALTY_GOAL: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", icon: "🎯" },
  PENALTY_MISS: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", icon: "❌" },
};

const eventLabels: Record<string, string> = {
  GOAL: "გოლი",
  ASSIST: "ასისტი",
  YELLOW_CARD: "ყვითელი ბარათი",
  RED_CARD: "წითელი ბარათი",
  SUBSTITUTION_IN: "შემოსვლა",
  SUBSTITUTION_OUT: "გასვლა",
  OWN_GOAL: "ავტოგოლი",
  PENALTY_GOAL: "პენალტი (გოლი)",
  PENALTY_MISS: "პენალტი (გაცდა)",
};

export default function MatchDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("timeline");

  const { data, isLoading: loading } = useQuery<any>({
    queryKey: ["match-detail", id],
    queryFn: () => publicService.getMatchDetail(id as string),
    enabled: !!id,
  });

  if (loading) return <LoadingSpinner icon={GiSoccerBall} />;

  if (!data) {
    return <EmptyState icon={GiSoccerBall} title="მატჩი არ მოიძებნა" />;
  }



  const sortedEvents = data.events
    ? [...data.events].sort((a: any, b: any) => (a.minute ?? 0) - (b.minute ?? 0))
    : [];

  return (
    <div>
      {/* ──────────── SCOREBOARD ──────────── */}
      <div className="relative py-16 px-6 overflow-hidden border-b border-white/5">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/40 via-blue-950/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto text-center animate-fade-in-up">
          {/* Tournament name */}
          <div className="mb-8">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-[0.15em] mb-1">
              {data.tournament?.name}
            </div>
            <div className="text-sm text-slate-500">
              <FiCalendar className="inline-block mr-1" size={13} />
              {formatFullDate(data.date)}
            </div>
          </div>

          {/* Score Area */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-8">
            {/* Home Team */}
            <Link href={`/teams/${data.homeTeam.id}`} className="group flex flex-col items-center gap-4 flex-1">
              <TeamLogo src={data.homeTeam.logo} alt={data.homeTeam.name} size="xl" rounded="2xl" className="group-hover:border-emerald-500/30 shadow-xl shadow-black/30" />
              <div>
                <div className="text-white font-bold text-sm md:text-base group-hover:text-emerald-400 transition-colors">
                  {data.homeTeam.name}
                </div>
                <div className="text-slate-600 text-xs">სახლში</div>
              </div>
            </Link>

            {/* Score */}
            <div className="flex flex-col items-center">
              {data.status === "FINISHED" ? (
                <div className="bg-linear-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl px-8 py-5 shadow-2xl shadow-black/30">
                  <div className="text-5xl md:text-6xl font-black text-white tracking-wider">
                    {data.homeScore}
                    <span className="text-slate-600 mx-3">:</span>
                    {data.awayScore}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/8 rounded-2xl px-8 py-5">
                  <div className="text-3xl font-extrabold text-slate-500">VS</div>
                </div>
              )}
              <div className="mt-3 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {data.status === "FINISHED" ? "დასრულებული" : data.status === "SCHEDULED" ? "გეგმა" : data.status}
              </div>
            </div>

            {/* Away Team */}
            <Link href={`/teams/${data.awayTeam.id}`} className="group flex flex-col items-center gap-4 flex-1">
              <TeamLogo src={data.awayTeam.logo} alt={data.awayTeam.name} size="xl" rounded="2xl" className="group-hover:border-emerald-500/30 shadow-xl shadow-black/30" />
              <div>
                <div className="text-white font-bold text-sm md:text-base group-hover:text-emerald-400 transition-colors">
                  {data.awayTeam.name}
                </div>
                <div className="text-slate-600 text-xs">გასვლით</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────── CONTENT ──────────── */}
      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-white/5">
          {[
            { id: "timeline", label: "მოვლენები", icon: FiClock },
            { id: "lineups", label: "შემადგენლობა", icon: FiUser },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-t-lg transition-all duration-300 border-b-2
                ${activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/3"
                }
              `}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TIMELINE ── */}
        {activeTab === "timeline" && (
          <div className="animate-fade-in">
            {sortedEvents.length === 0 ? (
              <div className="glass-card transform-none! rounded-xl p-12 text-center text-slate-600">
                <GiWhistle size={36} className="mx-auto mb-3 opacity-30" />
                მოვლენები არ არის
              </div>
            ) : (
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-[30px] top-4 bottom-4 w-px bg-linear-to-b from-emerald-500/20 via-white/5 to-transparent" />
                
                <div className="flex flex-col gap-4">
                  {sortedEvents.map((event: any, idx: number) => {
                    const config = eventConfig[event.type] || eventConfig.GOAL;
                    const isHome = event.team?.id === data.homeTeam.id;

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-5 group animate-fade-in-up"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        {/* Minute */}
                        <div className="w-[60px] shrink-0 text-right">
                          <span className="text-sm font-extrabold text-emerald-400">{event.minute}&apos;</span>
                        </div>

                        {/* Event Card */}
                        <div className={`flex-1 p-4 rounded-xl border ${config.bg} flex items-center gap-4 transition-all duration-300 group-hover:scale-[1.01]`}>
                          <span className="text-2xl">{config.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-bold ${config.text}`}>
                                {eventLabels[event.type] || event.type}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isHome ? "bg-white/5 text-slate-400" : "bg-white/5 text-slate-400"
                              }`}>
                                {isHome ? data.homeTeam.name : data.awayTeam.name}
                              </span>
                            </div>
                            {event.player && (
                              <Link
                                href={`/players/${event.player.id}`}
                                className="text-white text-sm font-semibold hover:text-emerald-400 transition-colors mt-1 block"
                              >
                                {event.player.name}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LINEUPS ── */}
        {activeTab === "lineups" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <LineupList
              teamName={data.homeTeam.name}
              teamLogo={data.homeTeam.logo}
              lineup={data.homeLineup}
              color="emerald"
            />
            <LineupList
              teamName={data.awayTeam.name}
              teamLogo={data.awayTeam.logo}
              lineup={data.awayLineup}
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Extracted sub-component for lineup rendering ── */
function LineupList({ teamName, teamLogo, lineup, color }: { teamName: string; teamLogo?: string; lineup?: any[]; color: "emerald" | "blue" }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
        <TeamLogo src={teamLogo} alt={teamName} size="sm" />
        <h3 className="text-base font-bold text-white">{teamName}</h3>
      </div>

      <div className="flex flex-col gap-2">
        {lineup && lineup.map((p: any) => (
          <Link
            href={`/players/${p.playerId || p.id}`}
            key={p.playerId || p.id}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-all"
          >
            <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 border border-${color}-500/15 flex items-center justify-center text-${color}-400 text-xs font-bold`}>
              {p.shirtNumber || "—"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate group-hover:text-emerald-400 transition-colors">
                {p.playerName || p.name}
              </div>
              {p.position && (
                <div className="text-slate-600 text-xs">{p.position}</div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              {p.goals > 0 && <span className="text-emerald-400 font-bold">⚽ {p.goals}</span>}
              {p.assists > 0 && <span className="text-blue-400 font-bold">👟 {p.assists}</span>}
              {p.yellowCards > 0 && <span>🟨</span>}
              {p.redCard && <span>🟥</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
