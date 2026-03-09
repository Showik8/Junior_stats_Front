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
      month: "numeric",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "overview", label: "მიმოხილვა" },
    { id: "squad", label: "შემადგენლობა" },
    { id: "matches", label: "მატჩები" },
    { id: "stats", label: "სტატისტიკა" },
  ];

  const winRate = data.stats?.winRate || 0;
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (winRate / 100) * circumference;

  // Abbreviated team name for watermark (e.g. "FC Jarnali" → "FCJ")
  const watermarkText = data.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 4);

  const MatchRow = ({ match }: { match: TeamMatch }) => {
    const isHome = match.homeTeam.id === data!.id;
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const oppScore = isHome ? match.awayScore : match.homeScore;

    let resultBg = "bg-[#1a2235]";
    let resultDot = "bg-gray-500";
    if (match.status === "FINISHED") {
      if (teamScore > oppScore) { resultBg = "bg-emerald-900/40"; resultDot = "bg-emerald-400"; }
      else if (teamScore < oppScore) { resultBg = "bg-red-900/40"; resultDot = "bg-red-400"; }
      else { resultBg = "bg-amber-900/40"; resultDot = "bg-amber-400"; }
    }

    return (
      <Link
        href={`/matches/${match.id}`}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${resultBg} mb-2 hover:opacity-80 transition-opacity`}
      >
        {/* Team logos + score */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative w-7 h-7 shrink-0">
            {data!.logo ? (
              <Image src={data!.logo} alt="" fill unoptimized className="object-contain" />
            ) : (
              <GiShield size={24} className="text-white/30" />
            )}
          </div>
          <span className="text-white text-sm font-semibold truncate">{data!.name}</span>
          <span className="text-emerald-400 font-black text-base tabular-nums mx-1">
            {match.homeScore} - {match.awayScore}
          </span>
          <div className="relative w-7 h-7 shrink-0">
            {(isHome ? match.awayTeam : match.homeTeam).logo ? (
              <Image src={(isHome ? match.awayTeam : match.homeTeam).logo!} alt="" fill unoptimized className="object-contain" />
            ) : (
              <GiShield size={24} className="text-white/30" />
            )}
          </div>
          <span className="text-white/60 text-sm font-medium truncate">
            {isHome ? match.awayTeam.name : match.homeTeam.name}
          </span>
        </div>
        <span className="text-white/30 text-xs shrink-0">{formatDate(match.date)}</span>
        <FiChevronRight className="text-white/20 shrink-0" size={14} />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Back button */}
      <Link
        href="/teams"
        className="fixed top-24 left-4 md:left-8 z-50 w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
      >
        <FiArrowLeft size={16} />
      </Link>

      {/* ── HERO ── */}
      <div className="relative w-full flex flex-col items-center justify-end pb-8 pt-16 overflow-hidden" style={{ minHeight: "300px" }}>
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
          aria-hidden
        >
          <span
            className="font-black leading-none text-white/6"
            style={{ fontSize: "clamp(120px, 30vw, 260px)", letterSpacing: "-0.05em" }}
          >
            {watermarkText}
          </span>
        </div>

        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0a0e1a] to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-white border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden mb-4">
          {data.logo ? (
            <Image src={data.logo} alt={data.name} fill unoptimized priority className="object-contain p-2" />
          ) : (
            <GiShield size={56} className="text-gray-400" />
          )}
        </div>

        {/* Team name */}
        <h1 className="relative z-10 text-3xl md:text-4xl font-black text-center text-emerald-400 tracking-tight drop-shadow-lg px-4">
          {data.name}
        </h1>

        {data.ageCategory && (
          <span className="relative z-10 mt-2 text-xs text-white/40 uppercase tracking-widest font-semibold">
            {data.ageCategory}
          </span>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-[72px] z-40 bg-[#0a0e1a]/95 backdrop-blur-xl border-b border-white/5 px-4">
        <div className="max-w-4xl mx-auto flex">
          <div className="flex gap-1 p-1 bg-[#111827] rounded-2xl my-3 w-full overflow-x-auto no-scrollbar">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/teams/${data.id}?tab=${t.id}`}
                  replace
                  scroll={false}
                  className={`
                    flex-1 text-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "text-white/40 hover:text-white/70"
                    }
                  `}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ━━ OVERVIEW TAB ━━ */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">

            {/* Top row: stats + win rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Stats column */}
              <div className="flex flex-col gap-3">
                {[
                  { label: "მოგება", value: data.stats?.wins ?? 0, icon: <GiTrophy size={20} className="text-emerald-400" />, bg: "bg-[#111827]" },
                  { label: "ფრე", value: data.stats?.draws ?? 0, icon: <FiGrid size={20} className="text-blue-400" />, bg: "bg-[#111827]" },
                  { label: "წაგება", value: data.stats?.losses ?? 0, icon: <FiTrendingDown size={20} className="text-red-400" />, bg: "bg-[#111827]" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4`}>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-white/50 text-xs font-semibold uppercase tracking-widest">{s.label}</div>
                      <div className="text-white text-2xl font-black tabular-nums">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Win rate donut */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="text-white/60 text-sm font-semibold mb-4">მოგების პროცენტი</div>
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(winRate / 100) * circumference} ${circumference}`}
                      strokeDashoffset="0"
                    />
                    {/* Dot at the tip */}
                    {winRate > 0 && (
                      <circle
                        cx="50"
                        cy="10"
                        r="4"
                        fill="#10b981"
                        transform={`rotate(${(winRate / 100) * 360} 50 50)`}
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-white tabular-nums">{winRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent matches */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-base">ბოლო მატჩები</h3>
                <Link href={`/teams/${data.id}?tab=matches`} className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  ყველას ნახვა
                </Link>
              </div>
              {data.finishedMatches?.length ? (
                <div>
                  {data.finishedMatches.slice(0, 3).map((m) => (
                    <MatchRow key={m.id} match={m} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#111827] border border-white/5 rounded-xl p-6 text-center text-sm text-white/30">
                  ატვირთული მატჩები არ არის.
                </div>
              )}
            </div>

            {/* Sponsors */}
            {data.sponsors && data.sponsors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold text-base">ოფიციალური სპონსორები</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {data.sponsors.map((sp) => (
                    <div
                      key={sp.id}
                      className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-emerald-500/20 transition-all"
                    >
                      <div className="relative w-14 h-10">
                        {sp.logoUrl ? (
                          <Image src={sp.logoUrl} alt={sp.name} fill unoptimized className="object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/40 font-black text-xl">
                            {sp.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-white text-xs font-bold text-center">{sp.name}</div>
                      <div
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          sp.tier?.toLowerCase() === "gold"
                            ? "text-amber-400 bg-amber-500/10"
                            : sp.tier?.toLowerCase() === "silver"
                            ? "text-slate-300 bg-slate-500/10"
                            : "text-emerald-300 bg-emerald-500/10"
                        }`}
                      >
                        {sp.tier} TIER
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Squad preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-base">შემადგენლობა</h3>
                <Link href={`/teams/${data.id}?tab=squad`} className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  სრელი სია
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {(data.players || []).slice(0, 6).map((p) => (
                  <Link
                    key={p.id}
                    href={`/players/${p.id}`}
                    className="flex items-center gap-3 bg-[#111827] border border-white/5 rounded-xl px-4 py-3 hover:border-emerald-500/20 hover:bg-[#131d2e] transition-all group"
                  >
                    {p.photoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <Image src={p.photoUrl} alt="" fill unoptimized className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <FiUser size={16} className="text-white/30" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors truncate">
                        {p.name}
                      </div>
                      <div className="text-white/40 text-[11px]">{p.position || "—"}</div>
                    </div>
                    {p.shirtNumber && (
                      <span className="text-white/50 text-sm font-black tabular-nums">#{p.shirtNumber}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ━━ SQUAD TAB ━━ */}
        {activeTab === "squad" && (
          <div className="flex flex-col gap-2">
            {(data.players || []).length === 0 ? (
              <div className="bg-[#111827] border border-white/5 rounded-xl p-8 text-center text-sm text-white/30">
                შემადგენლობა ცარიელია.
              </div>
            ) : (
              (data.players || []).map((p, idx) => (
                <Link
                  key={p.id}
                  href={`/players/${p.id}`}
                  className="flex items-center gap-3 bg-[#111827] border border-white/5 rounded-xl px-4 py-3 hover:border-emerald-500/20 hover:bg-[#131d2e] transition-all group"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {p.photoUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image src={p.photoUrl} alt="" fill unoptimized className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <FiUser size={18} className="text-white/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-white/40 text-[11px]">
                      {p.position || "—"}
                      {p.age && <span className="opacity-60"> • {p.age} წ</span>}
                    </div>
                  </div>
                  {p.shirtNumber && (
                    <span className="text-white/50 text-sm font-black tabular-nums">#{p.shirtNumber}</span>
                  )}
                </Link>
              ))
            )}
          </div>
        )}

        {/* ━━ MATCHES TAB ━━ */}
        {activeTab === "matches" && (
          <div className="flex flex-col gap-8">
            {data.scheduledMatches?.length ? (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">დაგეგმილი</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {data.scheduledMatches.map((m) => <MatchRow key={m.id} match={m} />)}
                </div>
              </section>
            ) : null}

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-3">დასრულებული</h3>
              {data.finishedMatches?.length ? (
                <div className="flex flex-col gap-2">
                  {data.finishedMatches.map((m) => <MatchRow key={m.id} match={m} />)}
                </div>
              ) : (
                <div className="bg-[#111827] border border-white/5 rounded-xl p-6 text-center text-sm text-white/30">
                  მატჩები არ მოიძებნა.
                </div>
              )}
            </section>
          </div>
        )}

        {/* ━━ STATS TAB ━━ */}
        {activeTab === "stats" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "მოგება", value: data.stats?.wins ?? 0, icon: <GiTrophy size={22} className="text-emerald-400" /> },
                { label: "ფრე", value: data.stats?.draws ?? 0, icon: <FiGrid size={22} className="text-blue-400" /> },
                { label: "წაგება", value: data.stats?.losses ?? 0, icon: <FiTrendingDown size={22} className="text-red-400" /> },
                { label: "მატჩი", value: data.stats?.matchesPlayed ?? 0, icon: <GiWhistle size={22} className="text-white/40" /> },
                { label: "გატანილი", value: data.stats?.goalsFor ?? 0, icon: <GiSoccerBall size={22} className="text-amber-400" /> },
                { label: "გაშვებული", value: data.stats?.goalsAgainst ?? 0, icon: <GiShield size={22} className="text-red-300/70" /> },
                { label: "ქულა", value: data.stats?.points ?? 0, icon: <FiBarChart2 size={22} className="text-purple-400" /> },
                { label: "მოთამაშე", value: data.stats?.totalPlayers ?? 0, icon: <FiUsers size={22} className="text-cyan-400" /> },
              ].map((s) => (
                <div key={s.label} className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-2 hover:border-white/10 transition-all">
                  {s.icon}
                  <div className="text-2xl font-black text-white tabular-nums">{s.value}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Top scorers */}
            {(data.players || []).filter((p) => (p.stats?.goals || 0) > 0).length > 0 && (
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <GiSoccerBall className="text-amber-400" />
                  ბომბარდირები
                </h3>
                <div className="flex flex-col gap-1">
                  {(data.players || [])
                    .filter((p) => (p.stats?.goals || 0) > 0)
                    .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
                    .map((p, idx) => (
                      <Link
                        key={p.id}
                        href={`/players/${p.id}`}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <span className={`text-xs font-black w-4 text-center ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-orange-600" : "text-white/20"}`}>
                          {idx + 1}
                        </span>
                        {p.photoUrl ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
                            <Image src={p.photoUrl} alt="" fill unoptimized className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                            <FiUser size={14} className="text-white/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors truncate">{p.name}</div>
                          <div className="text-white/40 text-[10px]">{p.position || "—"}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-emerald-400 font-extrabold text-base tabular-nums">{p.stats?.goals || 0}</div>
                            <div className="text-[8px] text-white/30 uppercase">გოლი</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400/80 font-extrabold text-base tabular-nums">{p.stats?.assists || 0}</div>
                            <div className="text-[8px] text-white/30 uppercase">ასისტი</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
