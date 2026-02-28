import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiAward,
  FiTarget,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiBookmark,
} from "react-icons/fi";
import { TbRulerMeasure, TbWeight } from "react-icons/tb";
import { BASE_URL, API_PATHS } from "@/app/utils/apiPaths";
import { PublicPlayer } from "@/types/public";
import PlayerViewTracker from "@/app/components/public/PlayerViewTracker";

interface PlayerDetail extends PublicPlayer {
  stats?: {
    goals?: number;
    assists?: number;
    matches?: number;
    yellowCards?: number;
    redCards?: number;
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
      next: { revalidate: 60 } // cache for 60 seconds
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

  // Fallbacks
  const stats = data.stats || {};
  const goals = stats.goals || 0;
  const assists = stats.assists || 0;
  const matches = stats.matches || 0;
  const yellowCards = stats.yellowCards || 0;
  const redCards = stats.redCards || 0;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <PlayerViewTracker playerId={data.id} />
      
      {/* ── BACK BUTTON ── */}
      <Link
        href={data.teamId ? `/teams/${data.teamId}` : "/"}
        className="fixed top-24 left-6 md:left-10 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-lg"
      >
        <FiArrowLeft size={20} />
      </Link>

      {/* ── HERO SECTION ── */}
      <div className="relative w-full h-[65vh] md:h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Image Setup using Next/Image for LCP Optimization */}
        {data.photoUrl ? (
          <Image 
            src={data.photoUrl}
            alt={data.name}
            fill
            priority
            unoptimized
            className="object-cover object-center opacity-40 mix-blend-luminosity"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-slate-800 to-[#050505] opacity-50" />
        )}

        {/* Gradient Fades to mesh into black background */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050505]/60 to-[#050505]" />
        
        {/* Giant Watermark Number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-[200px] md:text-[350px] lg:text-[450px] font-black leading-none select-none z-0 tracking-tighter pointer-events-none drop-shadow-2xl text-transparent bg-clip-text bg-linear-to-b from-blue-500/40 via-purple-500/20 to-transparent">
          {data.shirtNumber}
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center mt-auto pb-12 w-full px-4 animate-fade-in-up">
          
          {/* Player Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight mb-6 drop-shadow-lg [text-shadow:0_4px_24px_rgb(0_0_0/50%)]">
            {data.name}
          </h1>

          {/* Badges / Information Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-5">
            {data.position && (
              <span className="px-5 py-1.5 rounded-full border border-white/20 bg-transparent backdrop-blur-md text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#9ca3af]">
                {data.position}
              </span>
            )}
            {data.teamName && (
              <span className="px-5 py-1.5 rounded-full border border-blue-500/50 bg-transparent backdrop-blur-md text-[10px] md:text-xs font-semibold tracking-widest text-[#93c5fd]">
                {data.teamName}
              </span>
            )}
            {data.nationality && (
              <span className="px-5 py-1.5 rounded-full border border-emerald-500/50 bg-transparent backdrop-blur-md text-[10px] md:text-xs font-semibold tracking-widest text-[#6ee7b7]">
                {data.nationality}
              </span>
            )}
          </div>

          <div className="text-xs font-medium text-white/40 tracking-widest uppercase">
            {data.views || 0} ნახვა
          </div>
        </div>
      </div>

      {/* ── STATISTICS & INFO SECTION ── */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-6 pb-24 relative z-20 mt-10">
        
        <h2 className="text-2xl md:text-[28px] font-serif font-bold text-center mb-10 text-white tracking-wide">კარიერული სტატისტიკა</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          
          {/* Goal */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <FiAward className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums">{goals}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">გოლი</div>
            </div>
          </div>

          {/* Assists */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
             <FiTarget className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums">{assists}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">ასისტი</div>
            </div>
          </div>

          {/* Matches */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <FiUsers className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums">{matches}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">მატჩი</div>
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <FiCalendar className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums">{data.age || "—"}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">ასაკი</div>
            </div>
          </div>

          {/* Yellow Cards */}
           <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <FiAlertTriangle className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums">{yellowCards}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">ყვითელი<br/>ბარათი</div>
            </div>
          </div>

          {/* Red Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <FiBookmark className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums">{redCards}</div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">წითელი<br/>ბარათი</div>
            </div>
          </div>

          {/* Height */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <TbRulerMeasure className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums inline-flex items-baseline gap-1">
                {data.height ? data.height : "—"}
                {data.height && <span className="text-sm font-semibold">სმ</span>}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">სიმაღლე</div>
            </div>
          </div>

          {/* Weight */}
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:justify-center gap-3 md:gap-6 border border-white/5 bg-[#030303] rounded-xl p-6 md:px-8 hover:border-white/15 transition-all duration-300">
            <TbWeight className="text-white shrink-0" size={20} />
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="text-2xl font-bold leading-none mb-1.5 text-white tabular-nums inline-flex items-baseline gap-1">
                 {data.weight ? data.weight : "—"}
                 {data.weight && <span className="text-sm font-semibold">კგ</span>}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">წონა</div>
            </div>
          </div>

        </div>

        {/* Lower Info Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Player Information */}
          <div className="border border-white/5 bg-[#080808] rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
            <h3 className="text-lg font-serif font-bold mb-6 text-white tracking-wide">პირადი ინფორმაცია</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">სრული სახელი:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">მაისურის ნომერი:</span>
                <span className="text-sm font-bold text-blue-400">#{data.shirtNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">პოზიცია:</span>
                <span className="text-sm font-bold text-white tracking-wide uppercase">{data.position}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">მიმდინარე გუნდი:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.teamName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">ქვეყანა:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.nationality || "—"}</span>
              </div>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="border border-white/5 bg-[#080808] rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
            <h3 className="text-lg font-serif font-bold mb-6 text-white tracking-wide">ფიზიკური მონაცემები</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">ასაკი:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.age ? `${data.age} წელი` : "—"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">სიმაღლე:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.height ? `${data.height} სმ` : "—"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">წონა:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.weight ? `${data.weight} კგ` : "—"}</span>
              </div>
               <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">საუკეთესო ფეხი:</span>
                <span className="text-sm font-bold text-white tracking-wide">{data.preferredFoot || "—"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-white/40 tracking-wide">პროფილის ნახვები:</span>
                <span className="text-sm font-bold text-blue-400">{data.views || 0}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
