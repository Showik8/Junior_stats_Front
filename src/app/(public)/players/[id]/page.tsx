import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { GiSoccerBall, GiShield } from "react-icons/gi";
import { TbRulerMeasure, TbWeight } from "react-icons/tb";
import { MdSportsSoccer, MdAssistant } from "react-icons/md";
import { BASE_URL, API_PATHS } from "@/app/utils/apiPaths";
import { PublicPlayer } from "@/types/public";
import PlayerViewTracker from "@/app/components/public/PlayerViewTracker";

interface PlayerDetail extends PublicPlayer {
  careerStats?: {
    totalGoals?: number;
    totalAssists?: number;
    totalMatches?: number;
    totalYellowCards?: number;
    totalRedCards?: number;
  };
  nationality?: string;
  age?: number;
  height?: number;
  weight?: number;
  views?: number;
  preferredFoot?: string;
}

async function getPlayer(id: string): Promise<PlayerDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}${API_PATHS.PUBLIC.PLAYER_DETAIL(id)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    return json.data;
  } catch (error) {
    console.error("Failed to fetch player:", error);
    return null;
  }
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPlayer(id);

  if (!data) {
    notFound();
  }

  const stats = data.careerStats || {};
  const goals = stats.totalGoals ?? 0;
  const assists = stats.totalAssists ?? 0;
  const matches = stats.totalMatches ?? 0;
  const yellowCards = stats.totalYellowCards ?? 0;
  const redCards = stats.totalRedCards ?? 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <PlayerViewTracker playerId={data.id} />

      {/* Back button */}
      <Link
        href={data.teamId ? `/teams/${data.teamId}` : "/players"}
        className="fixed top-24 left-4 md:left-8 z-50 w-9 h-9 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
      >
        <FiArrowLeft size={16} />
      </Link>

      {/* ── HERO ── */}
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-end pb-10 pt-16" style={{ minHeight: "340px" }}>

        {/* Player photo as blurred bg */}
        {data.photoUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={data.photoUrl}
              alt=""
              fill
              unoptimized
              priority
              className="object-cover object-top opacity-15 blur-sm scale-105"
            />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0e1a]/30 via-[#0a0e1a]/50 to-[#0a0e1a] pointer-events-none" />

        {/* Shirt number watermark */}
        {data.shirtNumber && (
          <div
            className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
            aria-hidden
          >
            <span
              className="font-black leading-none text-transparent bg-clip-text"
              style={{
                fontSize: "clamp(160px, 40vw, 380px)",
                letterSpacing: "-0.05em",
                backgroundImage: "linear-gradient(180deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.12) 50%, transparent 100%)",
              }}
            >
              {data.shirtNumber}
            </span>
          </div>
        )}

        {/* Player photo (portrait) */}
        {data.photoUrl && (
          <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl mb-4">
            <Image
              src={data.photoUrl}
              alt={data.name}
              fill
              unoptimized
              priority
              className="object-cover object-top"
            />
          </div>
        )}

        {/* Name */}
        <h1 className="relative z-10 text-3xl md:text-5xl font-black text-center text-white tracking-tight drop-shadow-xl px-4 mb-3">
          {data.name}
        </h1>

        {/* Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
          {data.position && (
            <span className="px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              {data.position}
            </span>
          )}
          {data.nationality && (
            <span className="px-4 py-1 rounded-full bg-[#111827] border border-white/10 text-[11px] font-bold tracking-widest text-white/60">
              {data.nationality}
            </span>
          )}
          {data.teamName && (
            <Link
              href={data.teamId ? `/teams/${data.teamId}` : "#"}
              className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold tracking-widest text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              {data.teamName}
            </Link>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 pb-20 mt-6 flex flex-col gap-6">

        {/* Career Statistics title */}
        <h2 className="text-white font-bold text-base">Career Statistics</h2>

        {/* Stats grid — 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: <GiSoccerBall size={22} className="text-emerald-400" />,
              value: goals,
              label: "Goals",
              bg: "bg-[#0d1f18]",
              border: "border-emerald-900/40",
            },
            {
              icon: <MdAssistant size={22} className="text-emerald-300" />,
              value: assists,
              label: "Assists",
              bg: "bg-[#0d1f18]",
              border: "border-emerald-900/40",
            },
            {
              icon: <FiUsers size={22} className="text-emerald-400" />,
              value: matches,
              label: "Matches",
              bg: "bg-[#0d1f18]",
              border: "border-emerald-900/40",
            },
            {
              icon: <FiCalendar size={22} className="text-emerald-300" />,
              value: data.age ?? "—",
              label: "Age",
              bg: "bg-[#0d1f18]",
              border: "border-emerald-900/40",
            },
            {
              icon: (
                <div className="w-5 h-7 rounded-sm bg-yellow-400 shadow shadow-yellow-500/30" />
              ),
              value: yellowCards,
              label: "Yellow Cards",
              bg: "bg-[#1a1a0d]",
              border: "border-yellow-900/30",
            },
            {
              icon: (
                <div className="w-5 h-7 rounded-sm bg-red-500 shadow shadow-red-500/30" />
              ),
              value: redCards,
              label: "Red Cards",
              bg: "bg-[#1a0d0d]",
              border: "border-red-900/30",
            },
            {
              icon: <TbRulerMeasure size={22} className="text-emerald-400" />,
              value: data.height ? (
                <span>
                  {data.height}
                  <span className="text-base font-semibold text-white/50 ml-0.5">სმ</span>
                </span>
              ) : "—",
              label: "Height",
              bg: "bg-[#0d1f18]",
              border: "border-emerald-900/40",
            },
            {
              icon: <TbWeight size={22} className="text-emerald-400" />,
              value: data.weight ? (
                <span>
                  {data.weight}
                  <span className="text-base font-semibold text-white/50 ml-0.5">კგ</span>
                </span>
              ) : "—",
              label: "Weight",
              bg: "bg-[#0d1f18]",
              border: "border-emerald-900/40",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.bg} border ${s.border} rounded-2xl p-5 flex flex-col items-center gap-3 hover:brightness-110 transition-all`}
            >
              {s.icon}
              <div className="text-2xl font-black text-white tabular-nums leading-none">{s.value}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Info panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Personal Information */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-5">Personal Information</h3>
            <div className="flex flex-col gap-0">
              {[
                { label: "სრული სახელი", value: data.name, green: false },
                { label: "მაისურის ნომერი", value: data.shirtNumber ? `#${data.shirtNumber}` : "—", green: true },
                { label: "პოზიცია", value: data.position || "—", green: true },
                { label: "მიმდინარე გუნდი", value: data.teamName || "—", green: false },
                { label: "ქვეყანა", value: data.nationality || "—", green: true },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <span className="text-xs text-white/40">{row.label}</span>
                  <span className={`text-sm font-bold ${row.green ? "text-emerald-400" : "text-white"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Data */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-5">Physical Data</h3>
            <div className="flex flex-col gap-0">
              {[
                { label: "ასაკი", value: data.age ? `${data.age} წელი` : "—", green: true },
                { label: "სიმაღლე", value: data.height ? `${data.height} სმ` : "—", green: true },
                { label: "წონა", value: data.weight ? `${data.weight} კგ` : "—", green: true },
                { label: "საუკეთესო ფეხი", value: data.preferredFoot || "—", green: false },
                {
                  label: "პროფილის ნახვები",
                  value: (data.views ?? 0).toString(),
                  green: false,
                },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <span className="text-xs text-white/40">{row.label}</span>
                  <span className={`text-sm font-bold ${row.green ? "text-emerald-400" : "text-white"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
