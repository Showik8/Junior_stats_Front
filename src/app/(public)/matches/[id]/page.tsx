import { notFound } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import { GiSoccerBall, GiShield, GiWhistle } from "react-icons/gi";
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

export default async function MatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab || "timeline";

  let data: any = null;
  try {
    data = await publicService.getMatchDetail(id);
  } catch (error) {
    console.error("Failed to fetch match details", error);
  }

  if (!data) {
    return <EmptyState icon={GiSoccerBall} title="მატჩი არ მოიძებნა" />;
  }

  const sortedEvents = data.events
    ? [...data.events].sort((a: any, b: any) => (a.minute ?? 0) - (b.minute ?? 0))
    : [];

  return (
    <div>
      {/* ──────────── SCOREBOARD ──────────── */}
      <div className="relative py-16 px-6 overflow-hidden border-b border-white/5 bg-[#050505]">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/40 via-[#050505]/80 to-[#050505] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto text-center animate-fade-in-up">
          {/* Tournament name */}
          <div className="mb-8">
            <Link href={`/tournaments/${data.tournament?.id}`} className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1 hover:text-emerald-400 transition-colors inline-block">
              {data.tournament?.name}
            </Link>
            <div className="text-sm text-slate-600">
              <FiCalendar className="inline-block mr-1" size={13} />
              {formatFullDate(data.date)}
            </div>
          </div>

          {/* Score Area */}
          <div className="flex items-center justify-center gap-6 md:gap-16 mb-8">
            {/* Home Team */}
            <Link href={`/teams/${data.homeTeam.id}`} className="group flex flex-col items-center gap-4 flex-1">
              <TeamLogo src={data.homeTeam.logo} alt={data.homeTeam.name} size="xl" rounded="2xl" className="group-hover:border-emerald-500/30 shadow-xl shadow-black/30 bg-[#080808]" />
              <div>
                <div className="text-white font-bold text-sm md:text-base group-hover:text-emerald-400 transition-colors">
                  {data.homeTeam.name}
                </div>
                <div className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mt-1">სახლში</div>
              </div>
            </Link>

            {/* Score */}
            <div className="flex flex-col items-center">
              {data.status === "FINISHED" ? (
                <div className="bg-[#030303] border border-white/5 rounded-2xl px-6 py-4 md:px-8 md:py-5 shadow-2xl shadow-black/50">
                  <div className="text-4xl md:text-6xl font-black text-white tracking-wider tabular-nums">
                    {data.homeScore}
                    <span className="text-white/10 mx-2 md:mx-3">:</span>
                    {data.awayScore}
                  </div>
                </div>
              ) : (
                <div className="bg-[#030303] border border-white/5 rounded-2xl px-6 py-4 md:px-8 md:py-5 shadow-2xl">
                  <div className="text-2xl md:text-3xl font-extrabold text-white/20">VS</div>
                </div>
              )}
              <div className="mt-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] shadow-inner">
                {data.status === "FINISHED" ? "დასრულებული" : data.status === "SCHEDULED" ? "დაგეგმილი" : data.status}
              </div>
            </div>

            {/* Away Team */}
            <Link href={`/teams/${data.awayTeam.id}`} className="group flex flex-col items-center gap-4 flex-1">
              <TeamLogo src={data.awayTeam.logo} alt={data.awayTeam.name} size="xl" rounded="2xl" className="group-hover:border-emerald-500/30 shadow-xl shadow-black/30 bg-[#080808]" />
              <div>
                <div className="text-white font-bold text-sm md:text-base group-hover:text-emerald-400 transition-colors">
                  {data.awayTeam.name}
                </div>
                <div className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mt-1">გასვლით</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────── CONTENT ──────────── */}
      <div className="max-w-[900px] mx-auto px-6 py-10 min-h-[50vh]">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-white/5">
          {[
            { id: "timeline", label: "მოვლენები", icon: FiClock },
            { id: "lineups", label: "შემადგენლობა", icon: FiUser },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/matches/${data.id}?tab=${t.id}`}
              replace
              scroll={false}
              className={`
                flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 border-b-2
                ${activeTab === t.id
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                  : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
                }
              `}
            >
              <t.icon size={15} />
              {t.label}
            </Link>
          ))}
        </div>

        {/* ── TIMELINE ── */}
        {activeTab === "timeline" && (
          <div className="animate-fade-in">
            {sortedEvents.length === 0 ? (
              <div className="bg-[#030303] border border-white/5 rounded-2xl p-12 text-center text-white/30">
                <GiWhistle size={36} className="mx-auto mb-4 opacity-30 text-white/20" />
                <span className="text-xs font-bold uppercase tracking-widest">მოვლენები არ არის მოცემული</span>
              </div>
            ) : (
              <div className="relative pl-2 md:pl-0">
                {/* Connecting line */}
                <div className="absolute left-[20px] md:left-[30px] top-4 bottom-4 w-px bg-linear-to-b from-white/10 via-white/5 to-transparent" />
                
                <div className="flex flex-col gap-4">
                  {sortedEvents.map((event: any, idx: number) => {
                    const config = eventConfig[event.type] || eventConfig.GOAL;
                    const isHome = event.team?.id === data.homeTeam.id;

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 md:gap-5 group animate-reveal-up"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        {/* Minute */}
                        <div className="w-[40px] md:w-[60px] shrink-0 text-right pt-4">
                          <span className="text-sm md:text-base font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{event.minute}&apos;</span>
                        </div>

                        {/* Event Card */}
                        <div className={`flex-1 p-4 rounded-2xl border ${config.bg} bg-[#050505] flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 shadow-md`}>
                          <span className="text-xl md:text-2xl drop-shadow-md">{config.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className={`text-[11px] font-black uppercase tracking-widest ${config.text}`}>
                                {eventLabels[event.type] || event.type}
                              </span>
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 uppercase tracking-widest">
                                {isHome ? data.homeTeam.name : data.awayTeam.name}
                              </span>
                            </div>
                            {event.player && (
                              <Link
                                href={`/players/${event.player.id}`}
                                className="text-white text-sm md:text-base font-bold hover:text-emerald-400 transition-colors block truncate tracking-wide"
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
              isHome={true}
            />
            <LineupList
              teamName={data.awayTeam.name}
              teamLogo={data.awayTeam.logo}
              lineup={data.awayLineup}
              color="blue"
              isHome={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Extracted sub-component for lineup rendering ── */
function LineupList({ teamName, teamLogo, lineup, color, isHome }: { teamName: string; teamLogo?: string; lineup?: any[]; color: "emerald" | "blue", isHome: boolean }) {
  const isBlue = color === "blue";
  const badgeColor = isBlue ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  const hoverBadgeColor = isBlue ? "group-hover:text-blue-300" : "group-hover:text-emerald-300";

  return (
    <div className="bg-[#030303] border border-white/5 rounded-3xl p-5 md:p-6 text-white w-full">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="w-12 h-12 bg-[#080808] border border-white/10 rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-lg">
           <TeamLogo src={teamLogo} alt={teamName} size="sm" className="w-full h-full object-contain" />
        </div>
        <div>
           <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{isHome ? "სახლში" : "გასვლით"}</div>
           <h3 className="text-base font-bold tracking-wide">{teamName}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {lineup && lineup.length > 0 ? lineup.map((p: any, idx) => (
          <Link
            href={`/players/${p.playerId || p.id}`}
            key={p.playerId || p.id}
            className="group flex items-center justify-between p-3.5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-[#080808] transition-all duration-300 animate-reveal-up"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
           <div className="flex items-center gap-3.5 min-w-0">
             <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[11px] font-black tabular-nums transition-colors ${badgeColor} ${hoverBadgeColor}`}>
                {p.shirtNumber || "—"}
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate transition-colors ${isBlue ? 'group-hover:text-blue-400' : 'group-hover:text-emerald-400'}`}>
                  {p.playerName || p.name}
                </div>
                {p.position && (
                  <div className="text-white/40 text-[9px] uppercase tracking-widest font-black mt-0.5">{p.position}</div>
                )}
              </div>
           </div>

            <div className="flex items-center gap-1.5 shrink-0 pl-3">
              {p.goals > 0 && <span className="text-emerald-400 font-bold text-xs">⚽ {p.goals}</span>}
              {p.assists > 0 && <span className="text-blue-400 font-bold text-xs">👟 {p.assists}</span>}
              {p.yellowCards > 0 && <span className="text-xs">🟨</span>}
              {p.redCard && <span className="text-xs">🟥</span>}
            </div>
          </Link>
        )) : (
           <div className="text-xs font-bold uppercase tracking-widest text-center text-white/20 py-10">შემადგენლობა ცნობილი არაა</div>
        )}
      </div>
    </div>
  );
}
