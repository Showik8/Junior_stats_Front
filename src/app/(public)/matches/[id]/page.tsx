"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import { GiSoccerBall, GiShield, GiWhistle } from "react-icons/gi";

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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline");

  useEffect(() => {
    if (!id) return;
    const fetchMatch = async () => {
      try {
        const res = await publicService.getMatchDetail(id as string);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="w-10 h-10 border-[3px] border-white/10 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <GiSoccerBall size={64} className="text-slate-800 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-3">მატჩი არ მოიძებნა</h2>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
          ← მთავარზე დაბრუნება
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ka-GE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
              {formatDate(data.date)}
            </div>
          </div>

          {/* Score Area */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-8">
            {/* Home Team */}
            <Link href={`/teams/${data.homeTeam.id}`} className="group flex flex-col items-center gap-4 flex-1">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#0a1228] border-2 border-white/8 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/30 transition-colors shadow-xl shadow-black/30">
                {data.homeTeam.logo ? (
                  <img src={data.homeTeam.logo} alt="" className="w-[70%] h-[70%] object-contain" />
                ) : (
                  <GiShield size={36} className="text-slate-600" />
                )}
              </div>
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
                {data.status === "FINISHED" ? "დარულებული" : data.status === "SCHEDULED" ? "გეგმა" : data.status}
              </div>
            </div>

            {/* Away Team */}
            <Link href={`/teams/${data.awayTeam.id}`} className="group flex flex-col items-center gap-4 flex-1">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#0a1228] border-2 border-white/8 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/30 transition-colors shadow-xl shadow-black/30">
                {data.awayTeam.logo ? (
                  <img src={data.awayTeam.logo} alt="" className="w-[70%] h-[70%] object-contain" />
                ) : (
                  <GiShield size={36} className="text-slate-600" />
                )}
              </div>
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
            {/* Home */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
                {data.homeTeam.logo ? (
                  <img src={data.homeTeam.logo} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <GiShield size={20} className="text-slate-600" />
                )}
                <h3 className="text-base font-bold text-white">{data.homeTeam.name}</h3>
              </div>

              <div className="flex flex-col gap-2">
                {data.homeLineup && data.homeLineup.map((p: any) => (
                  <Link
                    href={`/players/${p.playerId || p.id}`}
                    key={p.playerId || p.id}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-400 text-xs font-bold">
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
                    {/* Per-match stats if available */}
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

            {/* Away */}
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
                {data.awayTeam.logo ? (
                  <img src={data.awayTeam.logo} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <GiShield size={20} className="text-slate-600" />
                )}
                <h3 className="text-base font-bold text-white">{data.awayTeam.name}</h3>
              </div>

              <div className="flex flex-col gap-2">
                {data.awayLineup && data.awayLineup.map((p: any) => (
                  <Link
                    href={`/players/${p.playerId || p.id}`}
                    key={p.playerId || p.id}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 text-xs font-bold">
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
          </div>
        )}
      </div>
    </div>
  );
}
