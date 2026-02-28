import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiChevronRight,
  FiGrid,
  FiUsers,
  FiClock,
  FiBarChart2,
  FiArrowLeft,
  FiTrendingDown,
} from "react-icons/fi";
import { GiSoccerBall, GiWhistle, GiShield, GiTrophy } from "react-icons/gi";
import { publicService } from "@/services/public.service";
import EmptyState from "@/app/components/public/shared/EmptyState";
import { PublicTeam } from "@/types/public";

interface TeamMatch {
  id: string;
  date: string;
  status: string;
  homeScore: number;
  awayScore: number;
  homeTeam: { id: string; name: string; logo?: string };
  awayTeam: { id: string; name: string; logo?: string };
  tournament?: { name: string };
}

interface TeamPlayer {
  id: string;
  name: string;
  photoUrl?: string;
  shirtNumber?: number;
  position?: string;
  age?: number;
  stats?: {
    goals?: number;
    assists?: number;
  };
}

// Extended interface because some fields might be injected dynamically by API
interface TeamDetail extends PublicTeam {
  stats?: {
    wins?: number;
    draws?: number;
    losses?: number;
    winRate?: number;
    totalPlayers?: number;
    matchesPlayed?: number;
    goalsFor?: number;
    goalsAgainst?: number;
    points?: number;
    goalDifference?: number;
  };
  finishedMatches?: TeamMatch[];
  scheduledMatches?: TeamMatch[];
  players?: TeamPlayer[];
  coach?: string;
  logo?: string;
}

export default async function TeamDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab || "overview";

  let data: TeamDetail | null = null;
  try {
    // The publicService uses axios internally. For SSR caching benefits, 
    // it's usually better to use raw fetch. Let's stick to the existing axios service since it returns the full team detail.
    data = (await publicService.getTeamDetail(id)) as TeamDetail;
  } catch (error) {
    console.error("Failed to fetch team details");
  }

  if (!data) {
    return <EmptyState icon={GiShield} title="გუნდი არ მოიძებნა" />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ka-GE", {
      day: "numeric",
      month: "short",
    });
  };

  const tabs = [
    { id: "overview", label: "მიმოხილვა", icon: FiGrid },
    { id: "squad", label: "შემადგენლობა", icon: FiUsers },
    { id: "matches", label: "მატჩები", icon: FiClock },
    { id: "stats", label: "სტატისტიკა", icon: FiBarChart2 },
  ];

  const MatchItem = ({ match, delay = 0 }: { match: TeamMatch; delay?: number }) => {
    const isHome = match.homeTeam.id === data.id;
    const opponent = isHome ? match.awayTeam : match.homeTeam;

    let resultColor = "bg-[#050505] text-white/40 border border-white/10";
    let resultText = "VS";

    if (match.status === "FINISHED") {
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const oppScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > oppScore) {
        resultColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        resultText = "W";
      } else if (teamScore < oppScore) {
        resultColor = "bg-red-500/10 text-red-400 border border-red-500/20";
        resultText = "L";
      } else {
        resultColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        resultText = "D";
      }
    }

    return (
      <Link
        href={`/matches/${match.id}`}
        className="group flex items-center p-4 bg-[#030303] border border-white/5 rounded-xl hover:bg-white/5 transition-all mb-3 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="w-[60px] text-center text-xs text-white/50">
          <div className="font-semibold text-white/80">{formatDate(match.date)}</div>
          <div className="text-[11px]">
            {new Date(match.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/10">
          {opponent.logo ? (
            <div className="relative w-8 h-8">
              <Image src={opponent.logo} alt="" fill unoptimized priority className="object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <GiShield size={14} className="text-white/40" />
            </div>
          )}
          <div>
            <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors">{opponent.name}</div>
            <div className="text-white/40 text-[11px] uppercase tracking-widest mt-0.5">
              {isHome ? "(შინ)" : "(გასვლა)"} • {match.tournament?.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {match.status === "FINISHED" ? (
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${resultColor} flex items-center justify-center text-[10px] font-black`}>
                {resultText}
              </div>
              <div className="text-white font-extrabold text-base min-w-[45px] text-right tabular-nums">
                {match.homeScore} - {match.awayScore}
              </div>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/50 text-[10px] uppercase tracking-widest font-semibold border border-white/5">
              {match.status}
            </span>
          )}
          <FiChevronRight className="text-white/20 group-hover:text-emerald-400 transition-colors" size={16} />
        </div>
      </Link>
    );
  };

  const winRate = data.stats?.winRate || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      
      {/* ── BACK BUTTON ── */}
      <Link
        href="/teams"
        className="fixed top-24 left-6 md:left-10 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg"
      >
        <FiArrowLeft size={20} />
      </Link>

      {/* ── CINEMATIC HERO SECTION ── */}
      <div className="relative w-full h-[55vh] md:h-[65vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Abstract Glowing Background from Logo */}
        {data.logo ? (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none blur-[100px]">
             <Image src={data.logo} alt="" fill unoptimized priority className="object-cover scale-150" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-[#050505] opacity-50" />
        )}

        {/* Gradient Fades */}
        <div className="absolute inset-0 bg-linear-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505]" />
        
        {/* Giant Watermark Letter / Name */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-black leading-none select-none z-0 tracking-tighter pointer-events-none drop-shadow-2xl text-transparent bg-clip-text bg-linear-to-b from-blue-500/10 via-emerald-500/5 to-transparent whitespace-nowrap overflow-hidden max-w-[100vw] text-center opacity-50">
          {data.name.substring(0, 4).toUpperCase()}
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 animate-fade-in-up mt-10">
          
          <div className="relative group mb-6">
            <div className="absolute -inset-2 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0a0a0a] border border-white/10 p-4 flex items-center justify-center overflow-hidden shadow-2xl glass-card">
              {data.logo ? (
                <div className="relative w-full h-full">
                   <Image src={data.logo} alt={data.name} fill unoptimized priority className="object-contain drop-shadow-lg" />
                </div>
              ) : (
                <GiShield size={64} className="text-white/20" />
              )}
            </div>
          </div>

          <div className="flex gap-2 items-center justify-center mb-3">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[10px] font-bold text-white/50 uppercase tracking-widest">
              {data.ageCategory}
            </span>
            {winRate > 0 && (
              <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
                {winRate}% მოგება
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-center tracking-tight mb-4 drop-shadow-lg text-white">
            {data.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-widest text-white/40">
            {data.coach && (
              <span className="flex items-center gap-1.5 border border-white/5 px-4 py-1.5 rounded-full bg-black/40">
                <GiWhistle size={14} className="text-white/30" />
                {data.coach}
              </span>
            )}
            <span className="flex items-center gap-1.5 border border-white/5 px-4 py-1.5 rounded-full bg-black/40">
              <FiUsers size={14} className="text-white/30" />
              {data.stats?.totalPlayers || 0} მოთამაშე
            </span>
          </div>

        </div>
      </div>

      {/* ── TABS NAV ── */}
      <div className="sticky top-[80px] z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/teams/${data.id}?tab=${t.id}`}
                  replace
                  scroll={false}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap border-b-2
                    ${isActive
                      ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                      : "border-transparent text-white/40 hover:text-white/80 hover:bg-white/5"
                    }
                  `}
                >
                  <t.icon size={15} />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="max-w-5xl mx-auto px-6 py-12 relative z-20 min-h-[50vh]">
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8">
          
          {/* LEFT (Dynamic Based on Tab) */}
          <div className="flex flex-col gap-10">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "მოგება", value: data.stats?.wins || 0, color: "emerald", icon: GiTrophy },
                    { label: "ფრე", value: data.stats?.draws || 0, color: "slate", icon: FiGrid },
                    { label: "წაგება", value: data.stats?.losses || 0, color: "red", icon: FiTrendingDown },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-5 md:p-6 text-center bg-[#030303] border border-white/5 flex flex-col items-center justify-center animate-reveal-up hover:border-white/15 transition-all"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <s.icon size={20} className={`text-${s.color}-500/50 mb-3`} />
                      <div className="text-white text-3xl font-bold tabular-nums leading-none mb-1.5">{s.value}</div>
                      <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="animate-fade-in-up delay-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-serif font-bold text-white tracking-wide">ბოლო მატჩები</h3>
                    <Link href={`/teams/${data.id}?tab=matches`} className="text-xs font-bold uppercase tracking-widest text-[#6ee7b7] hover:text-white transition-colors">
                      ყველას ნახვა
                    </Link>
                  </div>
                  {data.finishedMatches?.length ? (
                    <div>
                      {data.finishedMatches.slice(0, 3).map((m: TeamMatch, i: number) => (
                        <MatchItem key={m.id} match={m} delay={100 + i * 80} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#030303] border border-white/5 rounded-xl p-8 text-center text-sm text-white/40">ატვირთული მატჩები არ არის.</div>
                  )}
                </div>
              </>
            )}

            {/* SQUAD TAB */}
            {(activeTab === "squad" || activeTab === "overview") && (
              <section className={activeTab === 'overview' ? 'animate-fade-in-up delay-300' : 'animate-fade-in'}>
                {activeTab === 'overview' && (
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-serif font-bold text-white tracking-wide">შემადგენლობა</h3>
                    <Link href={`/teams/${data.id}?tab=squad`} className="text-xs font-bold uppercase tracking-widest text-[#6ee7b7] hover:text-white transition-colors">
                      სრული სია
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(activeTab === 'overview' ? (data.players || []).slice(0, 6) : (data.players || [])).map((p: TeamPlayer, idx: number) => (
                    <Link href={`/players/${p.id}`} key={p.id} className="group block">
                      <div
                        className="bg-[#030303] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/15 hover:bg-white/5 transition-all animate-reveal-up"
                        style={activeTab === 'squad' ? { animationDelay: `${idx * 50}ms` } : undefined}
                      >
                        {p.photoUrl ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                            <Image src={p.photoUrl} alt="" fill unoptimized className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-white/30 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                            {p.shirtNumber || <FiUser size={16} />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="text-white text-sm font-semibold truncate group-hover:text-[#6ee7b7] transition-colors tracking-wide">
                              {p.name}
                            </div>
                            {p.shirtNumber && <span className="text-xs text-white/30 font-bold ml-2">#{p.shirtNumber}</span>}
                          </div>
                          <div className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
                            {p.position || "—"}
                            {p.age && <span className="opacity-50"> • {p.age} წლის</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* MATCHES TAB */}
            {activeTab === "matches" && (
              <div className="flex flex-col gap-10 animate-fade-in">
                {data.scheduledMatches?.length ? (
                  <section>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-5 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      დაგეგმილი
                    </h3>
                    <div className="flex flex-col gap-2">
                      {data.scheduledMatches.map((m: TeamMatch, i: number) => <MatchItem key={m.id} match={m} delay={i * 60} />)}
                    </div>
                  </section>
                ) : null}

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-5">დასრულებული</h3>
                   {data.finishedMatches?.length ? (
                      <div className="flex flex-col gap-2">
                        {data.finishedMatches.map((m: TeamMatch, i: number) => <MatchItem key={m.id} match={m} delay={i * 60} />)}
                      </div>
                   ) : <div className="text-sm text-white/40">მატჩები არ მოიძებნა.</div>}
                </section>
              </div>
            )}

            {/* STATS TAB */}
            {activeTab === "stats" && (
              <div className="animate-fade-in flex flex-col gap-10">
                
                {/* 8-Card Pure Black Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "მოგება", value: data.stats?.wins || 0, icon: GiTrophy },
                    { label: "ფრე", value: data.stats?.draws || 0, icon: FiGrid },
                    { label: "წაგება", value: data.stats?.losses || 0, icon: FiTrendingDown },
                    { label: "ჯამში", value: data.stats?.matchesPlayed || 0, icon: GiWhistle },
                    { label: "გატანილი", value: data.stats?.goalsFor || 0, icon: GiSoccerBall },
                    { label: "გაშვებული", value: data.stats?.goalsAgainst || 0, icon: GiShield },
                    { label: "ქულა", value: data.stats?.points || 0, icon: FiBarChart2 },
                    { label: "მოთამაშე", value: data.stats?.totalPlayers || 0, icon: FiUsers },
                  ].map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="rounded-xl p-5 bg-[#030303] border border-white/5 flex flex-col items-center justify-center animate-reveal-up hover:border-white/15 transition-all duration-300 gap-3 text-center"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <stat.icon className="text-white/30" size={20} />
                      <div className="text-2xl font-bold text-white tabular-nums leading-none">{stat.value}</div>
                      <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top Scorers Board */}
                <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-serif font-bold text-white tracking-wide mb-6 flex items-center gap-3">
                    <GiSoccerBall className="text-amber-500/80" />
                    ბომბარდირები
                  </h3>
                  <div className="flex flex-col gap-2">
                    {(data.players || [])
                      .filter((p: TeamPlayer) => (p.stats?.goals || 0) > 0)
                      .sort((a: TeamPlayer, b: TeamPlayer) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
                      .map((p: TeamPlayer, idx: number) => (
                        <Link key={p.id} href={`/players/${p.id}`} className="group flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                          <span className={`text-sm font-black w-5 text-center ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-orange-700/80" : "text-white/20"}`}>
                            {idx + 1}
                          </span>
                          {p.photoUrl ? (
                            <div className="relative w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                              <Image src={p.photoUrl} alt="" fill unoptimized className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/30 border border-white/5">
                              {p.shirtNumber || <FiUser />}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors truncate tracking-wide">{p.name}</div>
                            <div className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{p.position || "—"}</div>
                          </div>
                          <div className="flex items-center gap-5 md:gap-8 pr-2">
                            <div className="text-center">
                              <div className="text-emerald-400 font-extrabold text-lg tabular-nums leading-none mb-1">{p.stats?.goals || 0}</div>
                              <div className="text-[8px] text-white/40 uppercase font-black tracking-widest">გოლი</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400/80 font-extrabold text-lg tabular-nums leading-none mb-1">{p.stats?.assists || 0}</div>
                              <div className="text-[8px] text-white/40 uppercase font-black tracking-widest">ასისტი</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col gap-6">
            
            {/* Goal Difference & Ratios */}
            <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 flex justify-between items-center animate-slide-in-right">
              <div>
                <div className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1.5">გატანილი / გაშვებული</div>
                <div className="text-white text-2xl font-extrabold tabular-nums flex items-center gap-3">
                  <span className="text-[#6ee7b7]">{data.stats?.goalsFor || 0}</span>
                  <span className="text-white/10 text-xl font-light">|</span>
                  <span className="text-red-400/80">{data.stats?.goalsAgainst || 0}</span>
                </div>
              </div>
              <div className="text-right border-l border-white/5 pl-5">
                <div className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1.5">სხვაობა</div>
                <div className={`text-xl md:text-2xl font-black tabular-nums ${
                  (data.stats?.goalDifference || 0) > 0 ? "text-[#6ee7b7]" :
                  (data.stats?.goalDifference || 0) < 0 ? "text-red-400/80" : "text-white/50"
                }`}>
                  {(data.stats?.goalDifference || 0) > 0 ? "+" : ""}{data.stats?.goalDifference || 0}
                </div>
              </div>
            </div>

            {/* Win Rate Circle */}
            <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 text-center animate-slide-in-right flex flex-col items-center">
              <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">მოგების პროცენტი</div>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="rgb(52, 211, 153)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${winRate * 2.64} ${264 - winRate * 2.64}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{winRate}%</span>
                </div>
              </div>
            </div>

            {/* Next Match Mini Widget */}
            {data.scheduledMatches && data.scheduledMatches.length > 0 && (
              <div className="rounded-2xl p-6 bg-[#030303] border border-white/5 animate-slide-in-right relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-[9px] font-black uppercase tracking-widest text-[#93c5fd] mb-6 flex items-center gap-2 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  მომავალი შეხვედრა
                </h3>
                {(() => {
                  const match = data.scheduledMatches[0];
                  const opponent = match.homeTeam.id === data.id ? match.awayTeam : match.homeTeam;

                  return (
                    <div className="text-center relative z-10">
                      <div className="flex justify-center items-center gap-6 mb-5">
                         <div className="relative w-10 h-10 drop-shadow-lg">
                           {data.logo ? <Image src={data.logo} alt="" fill unoptimized className="object-contain" /> : <GiShield size={40} className="text-white/20"/>}
                         </div>
                        <span className="text-[10px] font-black text-white/20">VS</span>
                        <div className="relative w-10 h-10 drop-shadow-lg">
                           {opponent.logo ? <Image src={opponent.logo} alt="" fill unoptimized className="object-contain" /> : <GiShield size={40} className="text-white/20"/>}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-3 border border-white/5 rounded-full px-4 py-2 bg-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors">
                        <span className="text-white font-bold text-xs tracking-wide">{formatDate(match.date)}</span>
                        <span className="text-white/10 text-[10px]">|</span>
                        <span className="text-[#6ee7b7] text-xs font-bold tabular-nums">
                          {new Date(match.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
