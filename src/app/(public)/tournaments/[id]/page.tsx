import { notFound } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import {
  FiCalendar, FiMapPin, FiUsers, FiClock, FiBarChart2,
  FiGrid, FiList, FiChevronRight, FiUser
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
/* ── SUB-COMPONENTS ── */
const MatchesList = ({ matches }: { matches: any[] }) => (
  <div className="flex flex-col gap-3">
    {matches.length === 0 ? (
      <div className="p-10 text-center bg-[#030303] border border-white/5 rounded-2xl text-white/30 text-xs font-bold uppercase tracking-widest">
        მატჩები არ არის
      </div>
    ) : (
      matches.map((m, idx) => (
        <Link
          href={`/matches/${m.id}`}
          key={m.id}
          className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#030303] border border-white/5 rounded-2xl transition-all hover:bg-white/5 animate-reveal-up gap-4 md:gap-0"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          {/* Date Mobile Header */}
          <div className="flex justify-between items-center md:w-[90px] border-b border-white/5 pb-3 md:pb-0 md:border-0 md:block">
            <div className="text-white/40 text-[10px] uppercase font-black tracking-widest flex md:flex-col gap-2 md:gap-1 items-center md:items-start">
              <span>{formatShortDate(m.date)}</span>
              <span className="text-[9px] text-white/20">
                {new Date(m.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <FiChevronRight size={16} className="md:hidden text-white/20" />
          </div>

          {/* Teams */}
          <div className="flex-1 flex items-center justify-between md:justify-center gap-2 md:gap-6 w-full">
            {/* Home */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 justify-end">
              <span className="text-white font-bold text-xs md:text-sm text-right truncate whitespace-nowrap overflow-hidden block min-w-0 w-full group-hover:text-emerald-400 transition-colors">{m.homeTeam.name}</span>
              {m.homeTeam.logo ? (
                <img src={m.homeTeam.logo} alt="" className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-contain shrink-0 drop-shadow-md" />
              ) : (
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#080808] border border-white/10 flex items-center justify-center shrink-0">
                  <GiShield size={16} className="text-white/20" />
                </div>
              )}
            </div>

            {/* Score */}
            <div className={`px-3 md:px-5 py-2 bg-[#050505] rounded-xl min-w-[70px] md:min-w-[90px] text-center border shadow-inner ${
              m.status === 'FINISHED' ? 'border-white/10' : 'border-emerald-500/20 bg-emerald-500/5'
            }`}>
              <span className={`font-black text-base md:text-xl tracking-wider tabular-nums ${
                m.status === 'FINISHED' ? 'text-white' : 'text-emerald-400'
              }`}>
                {m.status === "FINISHED" ? `${m.homeScore}-${m.awayScore}` : "VS"}
              </span>
            </div>

            {/* Away */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              {m.awayTeam.logo ? (
                <img src={m.awayTeam.logo} alt="" className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-contain shrink-0 drop-shadow-md" />
              ) : (
                 <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#080808] border border-white/10 flex items-center justify-center shrink-0">
                  <GiShield size={16} className="text-white/20" />
                </div>
              )}
              <span className="text-white font-bold text-xs md:text-sm text-left truncate whitespace-nowrap overflow-hidden block min-w-0 w-full group-hover:text-emerald-400 transition-colors">{m.awayTeam.name}</span>
            </div>
          </div>

          <div className="hidden md:flex w-8 justify-end">
            <FiChevronRight size={18} className="text-white/10 group-hover:text-emerald-400 transition-colors" />
          </div>
        </Link>
      ))
    )}
  </div>
);

const StandingsTable = ({ standings }: { standings: any[] }) => (
  <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#030303]">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#080808] text-white/30 text-[10px] uppercase font-black tracking-widest text-left border-b border-white/5">
          <th className="p-5 w-14 rounded-tl-3xl">#</th>
          <th className="p-5">გუნდი</th>
          <th className="p-5 text-center">თ</th>
          <th className="p-5 text-center">მ</th>
          <th className="p-5 text-center">ფ</th>
          <th className="p-5 text-center">წ</th>
          <th className="p-5 text-center">ბ</th>
          <th className="p-5 text-center text-white/50 rounded-tr-3xl">ქულა</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, idx) => (
          <tr
            key={s.id}
            className="border-b border-white/5 hover:bg-white/5 transition-colors group last:border-0"
          >
            <td className="p-5">
              <span className={`
                text-sm font-black
                ${idx === 0 ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-orange-700/80" : "text-white/20"}
              `}>
                {idx + 1}
              </span>
            </td>
            <td className="p-4">
              <Link href={`/teams/${s.team.id}`} className="flex items-center gap-4 group/team">
                <div className="w-10 h-10 rounded-xl bg-[#080808] border border-white/10 flex items-center justify-center p-1.5 shadow-md group-hover/team:border-emerald-500/30 transition-colors">
                   {s.team.logo ? (
                      <img src={s.team.logo} alt="" className="w-full h-full object-contain drop-shadow-md" />
                    ) : (
                       <GiShield size={16} className="text-white/20" />
                    )}
                </div>
                <span className="text-white text-sm font-bold tracking-wide group-hover/team:text-emerald-400 transition-colors">
                  {s.team.name}
                </span>
              </Link>
            </td>
            <td className="p-5 text-center text-white/40 text-sm font-bold tabular-nums">{s.played}</td>
            <td className="p-5 text-center text-emerald-400 text-sm font-bold tabular-nums">{s.wins}</td>
            <td className="p-5 text-center text-white/60 text-sm font-bold tabular-nums">{s.draws}</td>
            <td className="p-5 text-center text-red-400/80 text-sm font-bold tabular-nums">{s.losses}</td>
            <td className="p-5 text-center text-white/30 text-xs font-black tabular-nums">{s.goalsFor - s.goalsAgainst}</td>
            <td className="p-5 text-center text-white font-black text-lg tabular-nums drop-shadow-md">{s.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
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
    { id: "overview", label: "მიმოხილვა", icon: FiGrid },
    { id: "matches", label: "მატჩები", icon: FiClock },
    { id: "table", label: "ცხრილი", icon: FiList },
    { id: "teams", label: "გუნდები", icon: FiUsers },
    { id: "stats", label: "სტატისტიკა", icon: FiBarChart2 },
  ];

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* ──────────── BANNER (CINEMATIC) ──────────── */}
      <div className="relative py-16 px-6 border-b border-white/5 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-[#080808] via-[#050505] to-[#050505] pointer-events-none" />
        <div className="absolute top-0 left-[20%] w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto flex gap-10 items-center flex-wrap animate-fade-in-up mt-10">
          {/* Logo */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#030303] border border-white/10 p-5 flex items-center justify-center shadow-2xl glass-card">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
              ) : (
                <GiTrophy size={64} className="text-emerald-500/30" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-[300px]">
            <div className="flex gap-3 mb-4 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] shadow-inner ${statusColors[data.status] || statusColors.INACTIVE}`}>
                {data.status === "FINISHED" ? "დასრულებული" : data.status === "SCHEDULED" ? "დაგეგმილი" : data.status}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                {data.format === "LEAGUE" ? "ლიგა" : data.format === "KNOCKOUT" ? "პლეი-ოფი" : "ჯგუფური + პლეი-ოფი"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
              {data.name}
            </h1>

            <div className="flex flex-wrap gap-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">
              {data.location && (
                <div className="flex items-center gap-2 bg-[#080808] border border-white/5 px-4 py-2 rounded-xl">
                  <FiMapPin size={14} className="text-emerald-500" />
                  {data.location}
                </div>
              )}
              {data.startDate && (
                <div className="flex items-center gap-2 bg-[#080808] border border-white/5 px-4 py-2 rounded-xl">
                  <FiCalendar size={14} className="text-emerald-500" />
                  {formatShortDate(data.startDate)} — {formatShortDate(data.endDate)}
                </div>
              )}
              <div className="flex items-center gap-2 bg-[#080808] border border-white/5 px-4 py-2 rounded-xl">
                <FiUsers size={14} className="text-emerald-500" />
                {data.ageCategories.join(" / ")}
              </div>
            </div>
          </div>
        </div>

        {/* Sponsors */}
        {data.sponsors && data.sponsors.length > 0 && (
          <div className="relative max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/5">
            <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black block mb-6">
              ოფიციალური პარტნიორები
            </span>
            <div className="flex gap-8 items-center flex-wrap opacity-60 hover:opacity-100 transition-opacity duration-500">
              {data.sponsors.map((s: any) => (
                <a
                  key={s.id}
                  href={s.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                >
                  <img
                    src={s.logoUrl}
                    alt={s.name}
                    title={s.name}
                    className={`object-contain grayscale hover:grayscale-0 transition-all duration-300 ${s.tier === "MAIN" ? "h-14" : s.tier === "GOLD" ? "h-10" : "h-8"}`}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────── CONTENT ──────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 min-h-[50vh]">
        {/* Tabs */}
        <div className="flex gap-1 mb-12 overflow-x-auto pb-1 border-b border-white/5 no-scrollbar">
          {tabs.map((t) => {
             const isActive = activeTab === t.id;
             return (
              <Link
                key={t.id}
                href={`/tournaments/${data.id}?tab=${t.id}`}
                replace
                scroll={false}
                className={`
                  flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-t-xl transition-all duration-300 whitespace-nowrap border-b-2
                  ${isActive
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 shadow-[inset_0_-10px_20px_-10px_rgba(16,185,129,0.1)]"
                    : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
                  }
                `}
              >
                <t.icon size={16} />
                {t.label}
              </Link>
             );
          })}
        </div>

        {/* ── VIEW: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
            <div className="flex flex-col gap-10">
              {/* Scheduled Matches */}
               {data.scheduledMatches?.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     განრიგი
                  </h3>
                  <MatchesList matches={data.scheduledMatches.slice(0, 3)} />
                </section>
               )}

              {/* Latest Matches */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-serif font-bold text-white tracking-wide">ბოლო მატჩები</h3>
                  <Link
                    href={`/tournaments/${data.id}?tab=matches`}
                    replace
                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
                  >
                    ყველას ნახვა →
                  </Link>
                </div>
                <MatchesList matches={data.finishedMatches.slice(0, 5)} />
              </section>
            </div>

            {/* Sidebar Stats */}
            <div className="flex flex-col gap-8">
              {/* Top Scorers Widget */}
              <div className="bg-[#030303] border border-white/5 rounded-3xl p-6 md:p-8 animate-slide-in-right">
                <h3 className="text-base font-serif font-bold text-white mb-8 flex items-center gap-3">
                  <GiSoccerBall className="text-amber-500" size={20} />
                  ბომბარდირები
                </h3>
                {data.topScorers && data.topScorers.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {data.topScorers.slice(0, 5).map((s: any) => (
                      <Link href={`/players/${s.player.id}`} key={s.rank} className="group flex items-center gap-4 py-2 border-b border-transparent hover:border-white/5 transition-colors">
                        <span className={`text-sm font-black w-5 text-center ${
                          s.rank === 1 ? "text-amber-500 drop-shadow-md" : s.rank === 2 ? "text-slate-300" : s.rank === 3 ? "text-orange-700/80" : "text-white/20"
                        }`}>
                          {s.rank}
                        </span>
                        {s.player.photoUrl ? (
                          <img src={s.player.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-md group-hover:border-emerald-500/50 transition-colors" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black uppercase text-white/30 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                            <FiUser />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-bold block truncate group-hover:text-emerald-400 transition-colors tracking-wide">
                            {s.player.name}
                          </div>
                          <span className="text-white/40 text-[10px] uppercase font-black tracking-widest block truncate mt-0.5">{s.team.name}</span>
                        </div>
                        <div className="text-emerald-400 font-black text-lg tabular-nums">
                            {s.goals}
                            <span className="text-[9px] text-white/20 block text-right mt-0.5 leading-none">გოლი</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest text-center py-6">მონაცემები არ არის</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW: MATCHES ── */}
        {activeTab === "matches" && (
          <div className="grid lg:grid-cols-2 gap-10 animate-fade-in">
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                 მიმდინარე / დაგეგმილი
              </h3>
              <MatchesList matches={data.scheduledMatches} />
            </section>
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                 დასრულებული
              </h3>
              <MatchesList matches={data.finishedMatches} />
            </section>
          </div>
        )}

        {/* ── VIEW: TABLE ── */}
        {activeTab === "table" && (
          <div className="animate-fade-in min-h-[40vh]">
            {data.format === "LEAGUE" && data.standings && (
              <StandingsTable standings={data.standings} />
            )}

            {(data.format === "GROUP_KNOCKOUT" || data.format === "KNOCKOUT") && data.groups && data.groups.map((group: any) => (
              <div key={group.id} className="mb-12">
                <h3 className="text-xl font-black text-white mb-6 pl-4 border-l-[3px] border-emerald-500 flex items-center gap-3 tracking-wide">
                  {group.name}
                </h3>
                <StandingsTable standings={group.standings} />
              </div>
            ))}
          </div>
        )}

        {/* ── VIEW: TEAMS ── */}
        {activeTab === "teams" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 animate-fade-in min-h-[40vh]">
            {data.teams && data.teams.map((t: any, idx: number) => (
              <Link href={`/teams/${t.id}`} key={t.id} className="group block animate-reveal-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="bg-[#030303] border border-white/5 hover:border-white/15 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-5 text-center transition-all duration-300 hover:bg-[#080808] hover:-translate-y-1 shadow-lg">
                  <div className="relative w-24 h-24 mb-2">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {t.logo ? (
                      <img src={t.logo} alt="" className="w-full h-full object-contain drop-shadow-lg relative z-10" />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center relative z-10">
                        <GiShield size={40} className="text-white/10 group-hover:text-emerald-500/30 transition-colors" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-[13px] md:text-sm font-bold group-hover:text-emerald-400 transition-colors tracking-wide leading-tight">{t.name}</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">{t.coach || "მწვრთნელის გარეშე"}</p>
                  </div>
                  <div className="w-full pt-4 mt-2 border-t border-white/5 flex justify-between items-center">
                    <div className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">შემადგენლობა</div>
                    <div className="text-white text-base font-black tabular-nums">{t.playerCount}</div>
                  </div>
                </div>
              </Link>
            ))}
            
            {(!data.teams || data.teams.length === 0) && (
               <div className="col-span-full py-20 text-center bg-[#030303] border border-white/5 rounded-3xl">
                  <FiUsers size={48} className="text-white/10 mx-auto mb-5" />
                  <div className="text-xs font-black uppercase tracking-widest text-white/30">გუნდები არ არის დამატებული</div>
               </div>
            )}
          </div>
        )}

        {/* ── VIEW: STATS ── */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in min-h-[40vh]">
            {/* Scorers */}
             {data.topScorers && data.topScorers.length > 0 ? (
              <div className="bg-[#030303] border border-white/5 rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-serif font-bold text-white mb-8 flex items-center gap-3">
                  <GiSoccerBall className="text-amber-500" size={24} />
                  ლიდერი ბომბარდირები
                </h3>
                <div className="flex flex-col gap-2">
                  {data.topScorers.map((s: any) => (
                    <Link href={`/players/${s.player.id}`} key={s.rank} className="group flex items-center gap-5 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
                      <span className={`text-base font-black w-6 text-center ${
                        s.rank === 1 ? "text-amber-500 drop-shadow-md" : s.rank === 2 ? "text-slate-300" : s.rank === 3 ? "text-orange-700/80" : "text-white/20"
                      }`}>
                        {s.rank}
                      </span>
                      {s.player.photoUrl ? (
                         <img src={s.player.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-md group-hover:border-emerald-500/50 transition-colors" />
                      ) : (
                         <div className="w-12 h-12 rounded-full bg-[#080808] border-2 border-white/10 flex items-center justify-center text-white/30 group-hover:border-emerald-500/50 transition-colors">
                            <FiUser size={20} />
                         </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm tracking-wide group-hover:text-emerald-400 transition-colors truncate">{s.player.name}</div>
                        <div className="text-white/40 text-[10px] uppercase font-black tracking-widest truncate mt-1">{s.team.name}</div>
                      </div>
                      <div className="text-center">
                         <div className="text-emerald-400 font-black text-xl tabular-nums leading-none mb-1">{s.goals}</div>
                         <div className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">გოლი</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
             ) : (
               <div className="col-span-full py-20 text-center bg-[#030303] border border-white/5 rounded-3xl">
                  <FiBarChart2 size={48} className="text-white/10 mx-auto mb-5" />
                  <div className="text-xs font-black uppercase tracking-widest text-white/30">სტატისტიკა ჯერ არ არის გენერირებული</div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
