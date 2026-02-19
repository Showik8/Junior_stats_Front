"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import {
  FiUser, FiActivity, FiTarget, FiClock,
  FiInfo, FiTrendingUp, FiArrowLeft, FiAward
} from "react-icons/fi";
import { GiSoccerBall, GiRunningShoe, GiShield } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PlayerProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPlayer = async () => {
      try {
        const res = await publicService.getPlayerDetail(id as string);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-white/5 border-t-emerald-500 rounded-full animate-spin" />
          <GiSoccerBall className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={20} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <FiUser size={64} className="text-slate-800 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-3">მოთამაშე არ მოიძებნა</h2>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
          ← მთავარზე დაბრუნება
        </Link>
      </div>
    );
  }

  const AttributeBar = ({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) => {
    const colorMap: Record<string, { bar: string; text: string; glow: string }> = {
      emerald: { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/30" },
      blue:    { bar: "bg-blue-500",    text: "text-blue-400",    glow: "shadow-blue-500/30" },
      amber:   { bar: "bg-amber-500",   text: "text-amber-400",   glow: "shadow-amber-500/30" },
      purple:  { bar: "bg-purple-500",  text: "text-purple-400",  glow: "shadow-purple-500/30" },
      red:     { bar: "bg-red-500",     text: "text-red-400",     glow: "shadow-red-500/30" },
      slate:   { bar: "bg-slate-500",   text: "text-slate-400",   glow: "shadow-slate-500/30" },
    };
    const c = colorMap[color] || colorMap.emerald;

    return (
      <div className="mb-5 animate-slide-in-right" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-end mb-2">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{label}</span>
          <span className={`${c.text} font-black text-sm tabular-nums`}>{value}</span>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full ${c.bar} rounded-full animate-bar-fill shadow-lg ${c.glow}`}
            style={{ width: `${value}%`, animationDelay: `${delay + 200}ms` }}
          />
        </div>
      </div>
    );
  };

  const statItems = [
    { label: "გოლი", value: data.stats?.goals || 0, icon: GiSoccerBall, gradient: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", border: "border-emerald-500/15" },
    { label: "ასისტი", value: data.stats?.assists || 0, icon: GiRunningShoe, gradient: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400", border: "border-blue-500/15" },
    { label: "მატჩი", value: data.stats?.matches || 0, icon: FiActivity, gradient: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400", border: "border-amber-500/15" },
    { label: "წუთი", value: `${data.stats?.minutes || 0}'`, icon: FiClock, gradient: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400", border: "border-purple-500/15" },
  ];

  return (
    <div className="min-h-screen lg:h-[calc(100vh-80px)] overflow-hidden flex flex-col lg:flex-row">

      {/* ──────── LEFT: FULL-BODY IMAGE ──────── */}
      <div className="w-full lg:w-[38%] lg:h-full relative overflow-hidden bg-[#070e1f] flex items-end justify-center">
        {/* Ambient glow */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-[#070e1f] to-transparent z-10 pointer-events-none" />

        {/* Giant number watermark */}
        <div className="absolute top-6 left-6 text-[280px] font-black text-white/[0.03] leading-none select-none z-0 tracking-tighter">
          {data.shirtNumber}
        </div>

        {/* Player Image — full body */}
        <div className="relative z-[5] h-[100%] w-full flex items-end justify-center animate-slide-in-left">
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt={data.name}
              className="h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(16,185,129,0.15)]"
            />
          ) : (
            <div className="flex flex-col items-center mb-20 animate-fade-in">
              <div className="w-40 h-40 rounded-full bg-slate-800/60 flex items-center justify-center border-2 border-white/5 mb-4">
                <FiUser size={64} className="text-slate-700" />
              </div>
              <span className="text-7xl font-black text-white/10">#{data.shirtNumber}</span>
            </div>
          )}
        </div>

        {/* Mobile name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 lg:hidden bg-linear-to-t from-[#070e1f] via-[#070e1f]/95 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              {data.position}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white text-xs font-bold flex items-center gap-1.5">
              <GiShield className="text-emerald-500" size={12} />
              {data.teamName}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">{data.name}</h1>
        </div>

        {/* Back button */}
        <Link
          href={data.teamId ? `/teams/${data.teamId}` : '/'}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <FiArrowLeft size={18} />
        </Link>
      </div>

      {/* ──────── RIGHT: STATS & INFO ──────── */}
      <div className="flex-1 lg:h-full lg:overflow-y-auto relative">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="relative px-6 py-10 lg:px-14 lg:py-14 max-w-3xl mx-auto">

          {/* ── HEADER (Desktop) ── */}
          <div className="hidden lg:block mb-14 animate-slide-in-right">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                {data.position}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                {data.nationality}
              </span>
              {data.stats?.mom > 0 && (
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <FiAward size={12} /> MOM ×{data.stats.mom}
                </span>
              )}
            </div>
            <h1 className="text-5xl xl:text-6xl font-black text-white mb-3 uppercase tracking-tight leading-[0.95] text-gradient-hero">
              {data.name}
            </h1>
            <div className="flex items-center gap-5 text-sm mt-5 flex-wrap">
              <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5">
                <GiShield className="text-emerald-500" size={16} />
                <span className="font-bold text-white">{data.teamName}</span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-bold">U-{data.age}</span>
              </div>
              {data.height && (
                <div className="flex items-center gap-2 text-slate-400">
                  <FiUser className="text-slate-500" size={14} />
                  <span className="font-semibold text-slate-300">{data.height} სმ</span>
                  {data.weight && <span className="text-slate-600">/ {data.weight} კგ</span>}
                </div>
              )}
              {data.preferredFoot && (
                <div className="flex items-center gap-2 text-slate-400">
                  <FiTrendingUp className="text-slate-500" size={14} />
                  <span className="font-semibold text-slate-300">{data.preferredFoot} ფეხი</span>
                </div>
              )}
            </div>
          </div>

          {/* ── KEY STATS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {statItems.map((stat, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl p-5 text-center bg-linear-to-b ${stat.gradient} border ${stat.border} animate-reveal-up group`}
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={stat.iconColor} size={20} />
                </div>
                <div className="text-3xl font-black text-white mb-1 tabular-nums">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── ATTRIBUTES ── */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden mb-10 animate-reveal-up delay-500">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.03] rounded-bl-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/[0.02] rounded-tr-[80px] pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <FiTarget className="text-emerald-400" size={16} />
              </div>
              მონაცემები
            </h3>

            {data.attributes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
                <AttributeBar label="სისწრაფე" value={data.attributes.pace} color="emerald" delay={600} />
                <AttributeBar label="პასი" value={data.attributes.passing} color="amber" delay={650} />
                <AttributeBar label="დარტყმა" value={data.attributes.shooting} color="blue" delay={700} />
                <AttributeBar label="დრიბლინგი" value={data.attributes.dribbling} color="purple" delay={750} />
                <AttributeBar label="დაცვა" value={data.attributes.defense} color="red" delay={800} />
                <AttributeBar label="ფიზიკური" value={data.attributes.physical} color="slate" delay={850} />
              </div>
            ) : (
              <p className="text-slate-500 text-sm">მონაცემები არ არის</p>
            )}
          </div>

          {/* ── BIO ── */}
          <div className="animate-reveal-up delay-700">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiInfo size={14} />
              ბიოგრაფია
            </h3>
            <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500/40">
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                {data.bio || "ინფორმაცია მოთამაშის შესახებ არ არის ხელმისაწვდომი."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
