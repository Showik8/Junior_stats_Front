"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import {
  FiUser, FiArrowLeft, FiAward, FiMapPin
} from "react-icons/fi";
import { GiSoccerBall, GiRunningShoe, GiShield } from "react-icons/gi";
import LoadingSpinner from "@/app/components/public/shared/LoadingSpinner";
import EmptyState from "@/app/components/public/shared/EmptyState";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PlayerProfilePage() {
  const { id } = useParams();

  const { data, isLoading: loading } = useQuery<any>({
    queryKey: ["player-detail", id],
    queryFn: () => publicService.getPlayerDetail(id as string),
    enabled: !!id,
  });

  if (loading) return <LoadingSpinner icon={GiSoccerBall} />;

  if (!data) {
    return <EmptyState icon={FiUser} title="მოთამაშე არ მოიძებნა" />;
  }

  const overallRating = data.attributes
    ? Math.round(
        (data.attributes.pace +
          data.attributes.shooting +
          data.attributes.passing +
          data.attributes.dribbling +
          data.attributes.defense +
          data.attributes.physical) / 6
      )
    : null;

  const attributes = data.attributes
    ? [
        { label: "სისწრაფე", key: "pace", value: data.attributes.pace },
        { label: "დარტყმა", key: "shooting", value: data.attributes.shooting },
        { label: "პასი", key: "passing", value: data.attributes.passing },
        { label: "დრიბლინგი", key: "dribbling", value: data.attributes.dribbling },
        { label: "დაცვა", key: "defense", value: data.attributes.defense },
        { label: "ფიზიკური", key: "physical", value: data.attributes.physical },
      ]
    : [];

  return (
    <div className="relative overflow-hidden">
      {/* ── Background ── */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/player_bg.jpeg')" }}
      />
      <div className="fixed inset-0 bg-linear-to-b from-[#060c1a]/80 via-[#060c1a]/90 to-[#060c1a]/98 z-0" />

      {/* ── Content ── */}
      <div className="relative z-10">

        {/* ── Back Button ── */}
        <Link
          href={data.teamId ? `/teams/${data.teamId}` : "/"}
          className="fixed top-24 left-6 z-30 w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <FiArrowLeft size={18} />
        </Link>

        {/* ── HERO SECTION ── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10 lg:gap-16 max-w-6xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-0">

          {/* Player Image - Redesigned to be properly contained and stylish */}
          <div className="relative w-72 lg:w-[420px] shrink-0 animate-slide-in-left group">
            {/* Giant Background Number */}
            <div className="absolute -top-10 -left-10 text-[240px] lg:text-[450px] font-black text-white/20 leading-none select-none z-20 tracking-tighter pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:text-white/30 drop-shadow-2xl">
              {data.shirtNumber}
            </div>
            
            {/* Vibrant Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-70" />

            {/* Profile Image Container */}
            <div className="relative z-10 w-full aspect-4/5 lg:aspect-3/4 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a1122] transition-colors duration-500 group-hover:border-emerald-500/30">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
                  <FiUser size={80} className="text-white/10 mb-6" />
                  <span className="text-8xl font-black text-white/5">#{data.shirtNumber}</span>
                </div>
              )}
              {/* Image bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[#0a1122] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Player Info - Enhanced Typography and Spacing */}
          <div className="flex-1 pb-4 lg:pb-12 text-center lg:text-left animate-fade-in-up w-full">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start flex-wrap">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                {data.position}
              </span>
              {data.nationality && (
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <FiMapPin size={11} className="text-emerald-400" />
                  {data.nationality}
                </span>
              )}
              {data.stats?.mom > 0 && (
                <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <FiAward size={13} /> MOM ×{data.stats.mom}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-linear-to-br from-white via-white to-white/40 uppercase tracking-tight leading-none mb-6 drop-shadow-sm">
              {data.name}
            </h1>

            {/* Team & Bio info */}
            <div className="flex items-center gap-5 justify-center lg:justify-start flex-wrap text-base mb-8">
              <Link
                href={`/teams/${data.teamId}`}
                className="flex items-center gap-2.5 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group shadow-lg shadow-black/20"
              >
                <GiShield className="text-emerald-500 group-hover:scale-110 transition-transform duration-300" size={20} />
                <span className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wide text-sm">{data.teamName}</span>
                {data.age && (
                  <span className="text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded uppercase text-emerald-300 font-extrabold ml-1">
                    U-{data.age}
                  </span>
                )}
              </Link>
              {data.height && (
                <span className="text-slate-500 text-sm">
                  {data.height} სმ {data.weight ? `/ ${data.weight} კგ` : ""}
                </span>
              )}
              {data.preferredFoot && (
                <span className="text-slate-500 text-sm">
                  {data.preferredFoot} ფეხი
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── STATS SECTION ── */}
        <div className="max-w-6xl mx-auto px-6 pb-16">

          {/* Key Stats Row - Enhanced Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "გოლი", value: data.stats?.goals || 0, icon: GiSoccerBall, color: "text-emerald-400" },
              { label: "ასისტი", value: data.stats?.assists || 0, icon: GiRunningShoe, color: "text-blue-400" },
              { label: "მატჩი", value: data.stats?.matches || 0, icon: GiShield, color: "text-violet-400" },
              { label: "წუთი", value: `${data.stats?.minutes || 0}'`, icon: FiAward, color: "text-amber-400" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="relative rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 animate-reveal-up flex flex-col items-center sm:items-start lg:flex-row lg:items-center gap-5 overflow-hidden shadow-xl shadow-black/20"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Glow behind icon */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-16 h-16 bg-white/5 blur-xl group-hover:bg-white/10 transition-colors rounded-full pointer-events-none" />
                
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <stat.icon className={stat.color} size={22} />
                </div>
                
                <div className="flex-1 text-center sm:text-left lg:text-left w-full sm:w-auto">
                  <div className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className={`text-3xl font-black tabular-nums leading-none drop-shadow-md text-transparent bg-clip-text bg-linear-to-br from-white to-white/60`}>
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── Attributes ── */}
            {data.attributes && (
              <div className="lg:col-span-2 rounded-3xl p-8.5 bg-[#0a1122]/80 border border-white/10 backdrop-blur-xl animate-reveal-up delay-300 shadow-2xl shadow-black/50 group hover:border-white/20 transition-colors duration-500">
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/10 group-hover:border-white/20 transition-colors duration-500">
                  <h3 className="text-lg font-black text-white flex items-center gap-3 uppercase tracking-wide">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <GiSoccerBall className="text-emerald-400" size={20} />
                    </div>
                    მონაცემები
                  </h3>
                  {overallRating && (
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">OVR</span>
                      <span className="text-3xl font-black text-white tabular-nums leading-none">{overallRating}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {attributes.map((attr, idx) => (
                    <div key={attr.key} className="animate-slide-in-right" style={{ animationDelay: `${500 + idx * 60}ms` }}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{attr.label}</span>
                        <span className="text-white font-bold text-sm tabular-nums">{attr.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/4 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full animate-bar-fill bg-linear-to-r from-white/20 to-white/40"
                          style={{
                            width: `${attr.value}%`,
                            animationDelay: `${600 + idx * 60}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Bio ── */}
            <div className="lg:col-span-3 rounded-3xl p-8.5 bg-linear-to-b from-[#0a1122]/90 to-[#070c17]/90 border border-white/10 backdrop-blur-xl animate-reveal-up delay-500 flex flex-col shadow-2xl shadow-black/50 group hover:border-white/20 transition-colors duration-500">
              <h3 className="text-lg font-black text-white mb-6 pb-5 border-b border-white/10 group-hover:border-white/20 transition-colors duration-500 flex items-center gap-3 uppercase tracking-wide">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <FiUser className="text-blue-400" size={20} />
                </div>
                ბიოგრაფია
              </h3>

              <p className="text-slate-300 leading-[1.8] text-[15px] flex-1 font-medium bg-white/5 p-6 rounded-2xl border border-white/5">
                {data.bio || "ინფორმაცია მოთამაშის შესახებ არ არის ხელმისაწვდომი."}
              </p>

              {/* Quick Facts */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "პოზიცია", value: data.position },
                  { label: "ნომერი", value: `#${data.shirtNumber}` },
                  { label: "ასაკი", value: data.age ? `${data.age} წელი` : "—" },
                  { label: "ფეხი", value: data.preferredFoot || "—" },
                ].map((fact) => (
                  <div key={fact.label} className="bg-[#050912]/50 p-4 rounded-xl border border-white/5 text-center">
                    <div className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">{fact.label}</div>
                    <div className="text-sm font-bold text-white uppercase">{fact.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
