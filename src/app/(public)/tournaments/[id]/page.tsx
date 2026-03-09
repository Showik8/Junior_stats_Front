import { notFound } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import {
  FiCalendar, FiMapPin, FiUsers, FiClock, FiBarChart2,
  FiGrid, FiList, FiChevronRight, FiUser, FiSearch
} from "react-icons/fi";
import { GiTrophy, GiSoccerBall, GiShield } from "react-icons/gi";
import EmptyState from "@/app/components/public/shared/EmptyState";
import { formatShortDate } from "@/app/utils/format";

/* eslint-disable @typescript-eslint/no-explicit-any */

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  FINISHED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  INACTIVE: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  INACTIVE: "INACTIVE",
};

const formatLabels: Record<string, string> = {
  LEAGUE: "ლიგა",
  KNOCKOUT: "პლეი-ოფი",
  GROUP_KNOCKOUT: "GROUP",
};

/* ── MATCH CARD ── */
const MatchCard = ({ match, type }: { match: any; type: "scheduled" | "finished" }) => (
  <Link
    href={`/matches/${match.id}`}
    className="group flex items-center gap-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-[#0e0e0e] transition-all"
  >
    {/* Date */}
    <div className="w-[70px] shrink-0">
      <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider leading-tight">
        {formatShortDate(match.date)}
      </div>
      <div className="text-[10px] text-white/20 mt-0.5">
        {new Date(match.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>

    {/* Home Team */}
    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
      <span className="text-white text-xs font-bold truncate group-hover:text-emerald-400 transition-colors">
        {match.homeTeam?.name}
      </span>
      <div className="w-7 h-7 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
        {match.homeTeam?.logo ? (
          <img src={match.homeTeam.logo} alt="" className="w-5 h-5 object-contain" />
        ) : (
          <GiShield size={12} className="text-white/20" />
        )}
      </div>
    </div>

    {/* Score / VS */}
    <div className={`px-3 py-1.5 rounded-lg min-w-[56px] text-center border ${
      type === "finished"
        ? "bg-[#0a0a0a] border-white/10"
        : "bg-emerald-500/10 border-emerald-500/20"
    }`}>
      {type === "finished" ? (
        <div className="flex flex-col items-center">
          <span className="text-white font-black text-base tabular-nums leading-none">{match.homeScore}</span>
          <span className="text-white/20 text-[9px] font-bold leading-none my-0.5">-</span>
          <span className="text-white font-black text-base tabular-nums leading-none">{match.awayScore}</span>
        </div>
      ) : (
        <span className="text-emerald-400 font-black text-xs tracking-wider">V S</span>
      )}
    </div>

    {/* Away Team */}
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="w-7 h-7 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
        {match.awayTeam?.logo ? (
          <img src={match.awayTeam.logo} alt="" className="w-5 h-5 object-contain" />
        ) : (
          <GiShield size={12} className="text-white/20" />
        )}
      </div>
      <span className="text-white text-xs font-bold truncate group-hover:text-emerald-400 transition-colors">
        {match.awayTeam?.name}
      </span>
    </div>

    <FiChevronRight size={14} className="text-white/10 group-hover:text-emerald-400 transition-colors shrink-0" />
  </Link>
);

/* ── STANDINGS TABLE ── */
const StandingsTable = ({ standings }: { standings: any[] }) => (
  <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#030303]">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#080808] text-white/30 text-[10px] uppercase font-black tracking-widest text-left border-b border-white/5">
          <th className="p-4 w-12 rounded-tl-2xl">#</th>
          <th className="p-4">გუნდი</th>
          <th className="p-4 text-center">თ</th>
          <th className="p-4 text-center">მ</th>
          <th className="p-4 text-center">ფ</th>
          <th className="p-4 text-center">წ</th>
          <th className="p-4 text-center">ბ</th>
          <th className="p-4 text-center text-white/50 rounded-tr-2xl">ქულა</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, idx) => (
          <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0">
            <td className="p-4">
              <span className={`text-sm font-black ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-orange-700/80" : "text-white/20"}`}>
                {idx + 1}
              </span>
            </td>
            <td className="p-4">
              <Link href={`/teams/${s.team.id}`} className="flex items-center gap-3 group/team">
                <div className="w-8 h-8 rounded-lg bg-[#080808] border border-white/10 flex items-center justify-center p-1 group-hover/team:border-emerald-500/30 transition-colors">
                  {s.team.logo ? (
                    <img src={s.team.logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <GiShield size={14} className="text-white/20" />
                  )}
                </div>
                <span className="text-white text-sm font-bold group-hover/team:text-emerald-400 transition-colors">{s.team.name}</span>
              </Link>
            </td>
            <td className="p-4 text-center text-white/40 text-sm font-bold tabular-nums">{s.played}</td>
            <td className="p-4 text-center text-emerald-400 text-sm font-bold tabular-nums">{s.wins}</td>
            <td className="p-4 text-center text-white/60 text-sm font-bold tabular-nums">{s.draws}</td>
            <td className="p-4 text-center text-red-400/80 text-sm font-bold tabular-nums">{s.losses}</td>
            <td className="p-4 text-center text-white/30 text-xs font-black tabular-nums">{s.goalsFor - s.goalsAgainst}</td>
            <td className="p-4 text-center text-white font-black text-lg tabular-nums">{s.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── SIDEBAR TOURNAMENT ITEM ── */
const TournamentSidebarItem = ({ t, isActive }: { t: any; isActive: boolean }) => (
  <Link
    href={`/tournaments/${t.id}`}
    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive
        ? "bg-emerald-500/10 border border-emerald-500/20"
        : "hover:bg-white/5 border border-transparent"
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
      isActive ? "bg-emerald-500/20" : "bg-white/5"
    }`}>
      {t.logoUrl ? (
        <img src={t.logoUrl} alt="" className="w-5 h-5 object-contain" />
      ) : (
        <GiTrophy size={14} className={isActive ? "text-emerald-400" : "text-white/20"} />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className={`text-sm font-bold truncate ${isActive ? "text-emerald-400" : "text-white/80 group-hover:text-white"} transition-colors`}>
        {t.name}
      </div>
      <div className="text-[10px] text-white/30 font-bold mt-0.5">
        ★ {t.ageCategories?.join(" • ") || "—"}
      </div>
    </div>
    <FiChevronRight size={14} className={isActive ? "text-emerald-400" : "text-white/10 group-hover:text-white/30"} />
  </Link>
);

export default async function TournamentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab || "overview";

  let data: any = null;
  try {
    data = await publicService.getTournamentDetail(id);
  } catch (error) {
    console.error("Failed to fetch tournament details");
  }

  if (!data) {
    return <EmptyState icon={GiTrophy} title="ტურნირი არ მოიძებნა" />;
  }

  const tabs = [
    { id: "overview", label: "მატჩები", icon: FiGrid },
    { id: "matches", label: "მაჩვენები", icon: FiClock },
    { id: "table", label: "ტურნირი", icon: FiList },
    { id: "teams", label: "გუნდები", icon: FiUsers },
    { id: "stats", label: "სტატისტიკა", icon: FiBarChart2 },
  ];

  // Calculate tournament stats
  const totalMatches = (data.scheduledMatches?.length || 0) + (data.finishedMatches?.length || 0);
  const totalGoals = data.finishedMatches?.reduce((sum: number, m: any) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0) || 0;
  const avgGoals = data.finishedMatches?.length > 0 ? (totalGoals / data.finishedMatches.length).toFixed(1) : "0";
  const totalTeams = data.teams?.length || 0;

  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="flex">
        {/* ═══════════════ MAIN CONTENT ═══════════════ */}
        <div className="flex-1 min-w-0">

          {/* ──── HERO BANNER ──── */}
          <div className="relative py-12 px-6 md:px-10 border-b border-white/5 overflow-hidden">
            {/* Bg effects */}
            <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a] via-[#050505] to-[#050505] pointer-events-none" />
            <div className="absolute top-0 left-[30%] w-[400px] h-[250px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-5xl mx-auto flex gap-8 items-start flex-wrap">
              {/* Trophy Icon */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-500/15 blur-3xl rounded-full opacity-50 pointer-events-none" />
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-[#030303] border border-white/10 p-5 flex items-center justify-center shadow-2xl">
                  {data.logoUrl ? (
                    <img src={data.logoUrl} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
                  ) : (
                    <GiTrophy size={56} className="text-emerald-500/40" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-[280px]">
                {/* Status + Format Badges */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] ${statusColors[data.status] || statusColors.INACTIVE}`}>
                    {statusLabels[data.status] || data.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.15em]">
                    {formatLabels[data.format] || data.format}
                  </span>
                </div>

                {/* Tournament Name */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
                  {data.name}
                </h1>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-3 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  {data.location && (
                    <div className="flex items-center gap-2 bg-[#080808] border border-white/5 px-3 py-2 rounded-xl">
                      <FiMapPin size={12} className="text-emerald-500" />
                      {data.location}
                    </div>
                  )}
                  {data.startDate && (
                    <div className="flex items-center gap-2 bg-[#080808] border border-white/5 px-3 py-2 rounded-xl">
                      <FiCalendar size={12} className="text-emerald-500" />
                      {formatShortDate(data.startDate)} — {formatShortDate(data.endDate)}
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-[#080808] border border-white/5 px-3 py-2 rounded-xl">
                    <FiUsers size={12} className="text-emerald-500" />
                    {data.ageCategories?.join(" / ") || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsors Row */}
            {data.sponsors && data.sponsors.length > 0 && (
              <div className="relative max-w-5xl mx-auto mt-8 pt-6 border-t border-white/5 flex items-center gap-6 flex-wrap">
                {data.sponsors.map((s: any) => (
                  <a
                    key={s.id}
                    href={s.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-white/5 rounded-xl hover:border-white/15 transition-all group"
                  >
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className={`object-contain grayscale group-hover:grayscale-0 transition-all ${s.tier === "MAIN" ? "h-8" : "h-6"}`}
                    />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/20 group-hover:text-white/50 transition-colors hidden sm:inline">
                      {s.name}
                    </span>
                  </a>
                ))}
                <span className="text-[9px] text-white/10 uppercase tracking-[0.15em] font-bold ml-auto">
                  {data.format === "GROUP_KNOCKOUT" ? "GROUP" : data.format}
                </span>
              </div>
            )}
          </div>

          {/* ──── TABS ──── */}
          <div className="border-b border-white/5 bg-[#030303]/50 sticky top-0 z-20 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-6 md:px-10">
              <div className="flex gap-0 overflow-x-auto no-scrollbar">
                {tabs.map((t) => {
                  const isActive = activeTab === t.id;
                  return (
                    <Link
                      key={t.id}
                      href={`/tournaments/${data.id}?tab=${t.id}`}
                      replace
                      scroll={false}
                      className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                        isActive
                          ? "border-emerald-500 text-emerald-400"
                          : "border-transparent text-white/30 hover:text-white/60"
                      }`}
                    >
                      <t.icon size={14} />
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ──── CONTENT ──── */}
          <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">

            {/* ═══ OVERVIEW TAB ═══ */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
                {/* Left Content */}
                <div className="flex flex-col gap-8">
                  {/* Schedule */}
                  {data.scheduledMatches?.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        განრიგი
                      </h3>
                      <div className="flex flex-col gap-2">
                        {data.scheduledMatches.slice(0, 4).map((m: any) => (
                          <MatchCard key={m.id} match={m} type="scheduled" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Recent Results */}
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-white">ბოლო მატჩები</h3>
                      <Link
                        href={`/tournaments/${data.id}?tab=matches`}
                        replace
                        className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 hover:text-emerald-400 transition-colors"
                      >
                        ყველას ნახვა →
                      </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                      {data.finishedMatches?.length > 0 ? (
                        data.finishedMatches.slice(0, 5).map((m: any) => (
                          <MatchCard key={m.id} match={m} type="finished" />
                        ))
                      ) : (
                        <div className="p-8 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl text-white/20 text-xs font-bold uppercase tracking-widest">
                          მატჩები ჯერ არ ჩატარებულა
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-6">
                  {/* Top Scorers */}
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                      <GiSoccerBall className="text-emerald-500" size={16} />
                      ბომბარდირები
                    </h3>
                    {data.topScorers && data.topScorers.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {data.topScorers.slice(0, 4).map((s: any) => (
                          <Link
                            href={`/players/${s.player.id}`}
                            key={s.rank}
                            className="group flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <span className={`text-sm font-black w-5 text-center ${
                              s.rank === 1 ? "text-amber-500" : s.rank === 2 ? "text-slate-300" : s.rank === 3 ? "text-orange-700/80" : "text-white/20"
                            }`}>
                              {s.rank}
                            </span>
                            {s.player.photoUrl ? (
                              <img src={s.player.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-md group-hover:border-emerald-500/30 transition-colors" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                                <FiUser size={14} className="text-white/30" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-bold truncate group-hover:text-emerald-400 transition-colors">
                                {s.player.name}
                              </div>
                              <span className="text-white/30 text-[9px] uppercase font-bold tracking-wider truncate block mt-0.5">
                                {s.team.name}
                              </span>
                            </div>
                            <span className="text-emerald-400 font-black text-lg tabular-nums">
                              {s.goals}
                            </span>
                          </Link>
                        ))}
                        <Link
                          href={`/tournaments/${data.id}?tab=stats`}
                          replace
                          className="text-[10px] text-center text-white/30 hover:text-emerald-400 font-bold uppercase tracking-wider mt-2 py-2 transition-colors"
                        >
                          სრულად ნახვა
                        </Link>
                      </div>
                    ) : (
                      <p className="text-white/20 text-xs font-bold uppercase tracking-widest text-center py-4">მონაცემები არ არის</p>
                    )}
                  </div>

                  {/* Tournament Stats Card */}
                  <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      ტურნირის სტატისტიკა
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">გატანილი გოლი</div>
                        <div className="text-3xl font-black text-white tabular-nums mt-1">{totalGoals}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">საშ. გოლი</div>
                        <div className="text-3xl font-black text-white tabular-nums mt-1">{avgGoals}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">სულ მატჩი</div>
                        <div className="text-3xl font-black text-white tabular-nums mt-1">{totalMatches}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">გუნდები</div>
                        <div className="text-3xl font-black text-white tabular-nums mt-1">{totalTeams}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ MATCHES TAB ═══ */}
            {activeTab === "matches" && (
              <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
                <section>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                    მიმდინარე / დაგეგმილი
                  </h3>
                  <div className="flex flex-col gap-2">
                    {data.scheduledMatches?.length > 0 ? (
                      data.scheduledMatches.map((m: any) => <MatchCard key={m.id} match={m} type="scheduled" />)
                    ) : (
                      <div className="p-8 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl text-white/20 text-xs font-bold uppercase tracking-widest">
                        დაგეგმილი მატჩები არ არის
                      </div>
                    )}
                  </div>
                </section>
                <section>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                    დასრულებული
                  </h3>
                  <div className="flex flex-col gap-2">
                    {data.finishedMatches?.length > 0 ? (
                      data.finishedMatches.map((m: any) => <MatchCard key={m.id} match={m} type="finished" />)
                    ) : (
                      <div className="p-8 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl text-white/20 text-xs font-bold uppercase tracking-widest">
                        დასრულებული მატჩები არ არის
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ═══ TABLE TAB ═══ */}
            {activeTab === "table" && (
              <div className="animate-fade-in min-h-[40vh]">
                {data.format === "LEAGUE" && data.standings && (
                  <StandingsTable standings={data.standings} />
                )}
                {(data.format === "GROUP_KNOCKOUT" || data.format === "KNOCKOUT") && data.groups && data.groups.map((group: any) => (
                  <div key={group.id} className="mb-10">
                    <h3 className="text-lg font-black text-white mb-5 pl-4 border-l-[3px] border-emerald-500 flex items-center gap-3">
                      {group.name}
                    </h3>
                    <StandingsTable standings={group.standings} />
                  </div>
                ))}
              </div>
            )}

            {/* ═══ TEAMS TAB ═══ */}
            {activeTab === "teams" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in min-h-[40vh]">
                {data.teams && data.teams.map((t: any, idx: number) => (
                  <Link href={`/teams/${t.id}`} key={t.id} className="group block animate-reveal-up" style={{ animationDelay: `${idx * 40}ms` }}>
                    <div className="bg-[#0a0a0a] border border-white/5 hover:border-white/15 rounded-2xl p-6 flex flex-col items-center gap-4 text-center transition-all hover:bg-[#0e0e0e] hover:-translate-y-1">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {t.logo ? (
                          <img src={t.logo} alt="" className="w-full h-full object-contain drop-shadow-lg relative z-10" />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-[#080808] border border-white/10 flex items-center justify-center relative z-10">
                            <GiShield size={32} className="text-white/10 group-hover:text-emerald-500/30 transition-colors" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">{t.coach || "—"}</p>
                      </div>
                      <div className="w-full pt-3 mt-1 border-t border-white/5 flex justify-between items-center">
                        <div className="text-white/20 text-[9px] font-bold uppercase tracking-wider">შემადგენლობა</div>
                        <div className="text-white text-sm font-black tabular-nums">{t.playerCount}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {(!data.teams || data.teams.length === 0) && (
                  <div className="col-span-full py-16 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl">
                    <FiUsers size={40} className="text-white/10 mx-auto mb-4" />
                    <div className="text-xs font-bold uppercase tracking-widest text-white/20">გუნდები არ არის</div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ STATS TAB ═══ */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in min-h-[40vh]">
                {data.topScorers && data.topScorers.length > 0 ? (
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                      <GiSoccerBall className="text-amber-500" size={20} />
                      ლიდერი ბომბარდირები
                    </h3>
                    <div className="flex flex-col gap-1">
                      {data.topScorers.map((s: any) => (
                        <Link href={`/players/${s.player.id}`} key={s.rank} className="group flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-white/5 transition-colors">
                          <span className={`text-base font-black w-6 text-center ${
                            s.rank === 1 ? "text-amber-500" : s.rank === 2 ? "text-slate-300" : s.rank === 3 ? "text-orange-700/80" : "text-white/20"
                          }`}>
                            {s.rank}
                          </span>
                          {s.player.photoUrl ? (
                            <img src={s.player.photoUrl} alt="" className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-md group-hover:border-emerald-500/30 transition-colors" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-[#080808] border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                              <FiUser size={16} className="text-white/30" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors truncate">{s.player.name}</div>
                            <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest truncate mt-0.5">{s.team.name}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-emerald-400 font-black text-xl tabular-nums leading-none">{s.goals}</div>
                            <div className="text-[8px] uppercase tracking-wider font-bold text-white/20 mt-0.5">გოლი</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="col-span-full py-16 text-center bg-[#0a0a0a] border border-white/5 rounded-2xl">
                    <FiBarChart2 size={40} className="text-white/10 mx-auto mb-4" />
                    <div className="text-xs font-bold uppercase tracking-widest text-white/20">სტატისტიკა ჯერ არ არის</div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
