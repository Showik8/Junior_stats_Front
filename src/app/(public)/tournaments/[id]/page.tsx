"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import {
  FiCalendar, FiMapPin, FiUsers, FiClock, FiBarChart2,
  FiGrid, FiList, FiChevronRight
} from "react-icons/fi";
import { GiTrophy, GiSoccerBall, GiShield } from "react-icons/gi";
import LoadingSpinner from "@/app/components/public/shared/LoadingSpinner";
import EmptyState from "@/app/components/public/shared/EmptyState";
import { formatShortDate } from "@/app/utils/format";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    const fetchTournament = async () => {
      try {
        const res = await publicService.getTournamentDetail(id as string);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  if (loading) return <LoadingSpinner icon={GiTrophy} />;

  if (!data) {
    return <EmptyState icon={GiTrophy} title="ტურნირი არ მოიძებნა" />;
  }



  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    FINISHED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    INACTIVE: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };

  // --- SUB-COMPONENTS ---

  const MatchesList = ({ matches }: { matches: any[] }) => (
    <div className="flex flex-col gap-3">
      {matches.length === 0 ? (
        <div className="p-8 text-center text-slate-600 glass-card rounded-xl">
          მატჩები არ არის
        </div>
      ) : (
        matches.map((m, idx) => (
          <Link
            href={`/matches/${m.id}`}
            key={m.id}
            className="group flex items-center justify-between p-4 glass-card rounded-xl hover:transform-none! animate-reveal-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Date */}
            <div className="w-[90px] text-sm text-slate-500 flex flex-col gap-1">
              <span className="font-semibold">{formatShortDate(m.date)}</span>
              <span className="text-xs opacity-70">
                {new Date(m.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Teams */}
            <div className="flex-1 flex items-center justify-center gap-5">
              {/* Home */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="text-white font-semibold text-sm text-right truncate">{m.homeTeam.name}</span>
                {m.homeTeam.logo ? (
                  <img src={m.homeTeam.logo} alt="" className="w-8 h-8 rounded-lg object-contain shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <GiShield size={14} className="text-slate-600" />
                  </div>
                )}
              </div>

              {/* Score */}
              <div className={`px-4 py-1.5 rounded-lg min-w-[80px] text-center border ${
                m.status === 'FINISHED' ? 'bg-black/30 border-white/5' : 'bg-emerald-500/5 border-emerald-500/15'
              }`}>
                <span className={`font-extrabold text-lg ${
                  m.status === 'FINISHED' ? 'text-white' : 'text-emerald-400'
                }`}>
                  {m.status === "FINISHED" ? `${m.homeScore} - ${m.awayScore}` : "VS"}
                </span>
              </div>

              {/* Away */}
              <div className="flex items-center gap-3 flex-1">
                {m.awayTeam.logo ? (
                  <img src={m.awayTeam.logo} alt="" className="w-8 h-8 rounded-lg object-contain shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <GiShield size={14} className="text-slate-600" />
                  </div>
                )}
                <span className="text-white font-semibold text-sm truncate">{m.awayTeam.name}</span>
              </div>
            </div>

            <div className="w-8 flex justify-end">
              <FiChevronRight size={16} className="text-slate-700 group-hover:text-emerald-400 transition-colors" />
            </div>
          </Link>
        ))
      )}
    </div>
  );

  const StandingsTable = ({ standings }: { standings: any[] }) => (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-slate-600 text-xs uppercase tracking-wider text-left border-b border-white/5">
            <th className="p-3.5 w-14">#</th>
            <th className="p-3.5">გუნდი</th>
            <th className="p-3.5 text-center">თ</th>
            <th className="p-3.5 text-center">მ</th>
            <th className="p-3.5 text-center">ფ</th>
            <th className="p-3.5 text-center">წ</th>
            <th className="p-3.5 text-center">ბ</th>
            <th className="p-3.5 text-center font-bold">ქ</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => (
            <tr
              key={s.id}
              className="border-b border-white/3 hover:bg-white/3 transition-colors group"
            >
              <td className="p-3.5">
                <span className={`
                  text-sm font-bold
                  ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-700" : "text-slate-600"}
                `}>
                  {idx + 1}
                </span>
              </td>
              <td className="p-3.5">
                <Link href={`/teams/${s.team.id}`} className="flex items-center gap-3 group/team">
                  {s.team.logo ? (
                    <img src={s.team.logo} alt="" className="w-7 h-7 rounded-md object-contain" />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center">
                      <GiShield size={12} className="text-slate-600" />
                    </div>
                  )}
                  <span className="text-white text-sm font-semibold group-hover/team:text-emerald-400 transition-colors">
                    {s.team.name}
                  </span>
                </Link>
              </td>
              <td className="p-3.5 text-center text-slate-400 text-sm">{s.played}</td>
              <td className="p-3.5 text-center text-emerald-400 text-sm font-medium">{s.wins}</td>
              <td className="p-3.5 text-center text-amber-400 text-sm">{s.draws}</td>
              <td className="p-3.5 text-center text-red-400 text-sm">{s.losses}</td>
              <td className="p-3.5 text-center text-slate-500 text-sm">{s.goalsFor - s.goalsAgainst}</td>
              <td className="p-3.5 text-center text-white font-extrabold text-sm">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { id: "overview", label: "მიმოხილვა", icon: FiGrid },
    { id: "matches", label: "მატჩები", icon: FiClock },
    { id: "table", label: "ცხრილი", icon: FiList },
    { id: "teams", label: "გუნდები", icon: FiUsers },
    { id: "stats", label: "სტატისტიკა", icon: FiBarChart2 },
  ];

  return (
    <div>
      {/* ──────────── BANNER ──────────── */}
      <div className="relative py-16 px-6 border-b border-white/5 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-[20%] w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto flex gap-10 items-center flex-wrap animate-fade-in-up">
          {/* Logo */}
          <div className="w-[130px] h-[130px] rounded-3xl glass-card transform-none! p-4 flex items-center justify-center shadow-2xl shadow-black/30">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <GiTrophy size={56} className="text-emerald-500/60" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex gap-3 mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${statusColors[data.status] || statusColors.INACTIVE}`}>
                {data.status}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-400 text-xs font-semibold">
                {data.format}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              {data.name}
            </h1>

            <div className="flex flex-wrap gap-5 text-sm text-slate-400">
              {data.location && (
                <div className="flex items-center gap-2">
                  <FiMapPin size={15} className="text-emerald-500" />
                  {data.location}
                </div>
              )}
              {data.startDate && (
                <div className="flex items-center gap-2">
                  <FiCalendar size={15} className="text-emerald-500" />
                  {formatShortDate(data.startDate)} — {formatShortDate(data.endDate)}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FiUsers size={15} className="text-emerald-500" />
                {data.ageCategories.join(" / ")}
              </div>
            </div>
          </div>
        </div>

        {/* Sponsors */}
        {data.sponsors && data.sponsors.length > 0 && (
          <div className="relative max-w-[1200px] mx-auto mt-10 pt-6 border-t border-white/5">
            <span className="text-[11px] text-slate-700 uppercase tracking-[0.12em] font-bold block mb-3">
              პარტნიორები
            </span>
            <div className="flex gap-6 items-center flex-wrap">
              {data.sponsors.map((s: any) => (
                <a
                  key={s.id}
                  href={s.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 hover:scale-110 transition-all duration-300"
                >
                  <img
                    src={s.logoUrl}
                    alt={s.name}
                    title={s.name}
                    className={`object-contain ${s.tier === "MAIN" ? "h-12" : s.tier === "GOLD" ? "h-10" : "h-8"}`}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────── CONTENT ──────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 overflow-x-auto pb-1 border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-t-lg transition-all duration-300 whitespace-nowrap border-b-2
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

        {/* ── VIEW: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div className="flex flex-col gap-8">
              {/* Latest Matches */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">ბოლო მატჩები</h3>
                  <button
                    onClick={() => setActiveTab("matches")}
                    className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors"
                  >
                    ყველა →
                  </button>
                </div>
                <MatchesList matches={data.finishedMatches.slice(0, 3)} />
              </section>

              {/* Scheduled Matches */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4">განრიგი</h3>
                <MatchesList matches={data.scheduledMatches.slice(0, 3)} />
              </section>
            </div>

            {/* Sidebar Stats */}
            <div className="flex flex-col gap-6">
              {/* Top Scorers Widget */}
              <div className="glass-card transform-none! rounded-2xl p-5 animate-slide-in-right">
                <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                  <GiSoccerBall className="text-amber-400" size={16} />
                  ბომბარდირები
                </h3>
                {data.topScorers && data.topScorers.length > 0 ? (
                  <div className="flex flex-col gap-3.5">
                    {data.topScorers.slice(0, 5).map((s: any) => (
                      <div key={s.rank} className="flex items-center gap-3">
                        <span className={`text-xs font-extrabold w-5 text-center ${
                          s.rank === 1 ? "text-amber-400" : s.rank === 2 ? "text-slate-300" : s.rank === 3 ? "text-amber-700" : "text-slate-600"
                        }`}>
                          {s.rank}
                        </span>
                        {s.player.photoUrl ? (
                          <img src={s.player.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/10" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border-2 border-white/5">
                            {s.player.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/players/${s.player.id}`}
                            className="text-white text-sm font-semibold block truncate hover:text-emerald-400 transition-colors"
                          >
                            {s.player.name}
                          </Link>
                          <span className="text-slate-600 text-xs">{s.team.name}</span>
                        </div>
                        <div className="text-emerald-400 font-extrabold text-sm">{s.goals}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">მონაცემები არ არის</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW: MATCHES ── */}
        {activeTab === "matches" && (
          <div className="flex flex-col gap-10 animate-fade-in">
            <section>
              <h3 className="text-lg font-bold text-white mb-4">მიმდინარე / დაგეგმილი</h3>
              <MatchesList matches={data.scheduledMatches} />
            </section>
            <section>
              <h3 className="text-lg font-bold text-white mb-4">დასრულებული</h3>
              <MatchesList matches={data.finishedMatches} />
            </section>
          </div>
        )}

        {/* ── VIEW: TABLE ── */}
        {activeTab === "table" && (
          <div className="animate-fade-in">
            {data.format === "LEAGUE" && data.standings && (
              <StandingsTable standings={data.standings} />
            )}

            {(data.format === "GROUP_KNOCKOUT" || data.format === "KNOCKOUT") && data.groups && data.groups.map((group: any) => (
              <div key={group.id} className="mb-10">
                <h3 className="text-lg font-bold text-white mb-4 pl-3 border-l-4 border-emerald-500">
                  {group.name}
                </h3>
                <StandingsTable standings={group.standings} />
              </div>
            ))}
          </div>
        )}

        {/* ── VIEW: TEAMS ── */}
        {activeTab === "teams" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.teams && data.teams.map((t: any, idx: number) => (
              <Link href={`/teams/${t.id}`} key={t.id} className="group block animate-reveal-up" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
                  {t.logo ? (
                    <img src={t.logo} alt="" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                      <GiShield size={32} className="text-emerald-500/40 group-hover:text-emerald-500/60 transition-colors" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                    <p className="text-slate-600 text-xs mt-1">{t.coach || "მწვრთნელის გარეშე"}</p>
                  </div>
                  <div className="w-full pt-3 border-t border-white/5 text-center">
                    <div className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">მოთამაშე</div>
                    <div className="text-white text-lg font-extrabold">{t.playerCount}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── VIEW: STATS ── */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Scorers */}
            <div className="glass-card transform-none! rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-5">ბომბარდირები</h3>
              {data.topScorers && data.topScorers.map((s: any) => (
                <div
                  key={s.rank}
                  className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0"
                >
                  <span className={`text-base font-extrabold ${
                    s.rank === 1 ? "text-amber-400" : s.rank === 2 ? "text-slate-300" : s.rank === 3 ? "text-amber-700" : "text-slate-600"
                  }`}>
                    {s.rank}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">{s.player.name}</div>
                    <div className="text-slate-600 text-xs">{s.team.name}</div>
                  </div>
                  <div className="text-emerald-400 font-extrabold text-lg">{s.goals}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
