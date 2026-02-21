"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
      <div className="fixed inset-0 bg-gradient-to-b from-[#060c1a]/80 via-[#060c1a]/90 to-[#060c1a]/98 z-0" />

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
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-14 max-w-6xl mx-auto px-6 pt-12 pb-8 lg:pt-16 lg:pb-0">

          {/* Player Image */}
          <div className="relative w-64 lg:w-[380px] shrink-0 animate-slide-in-left">
            {/* Giant Number */}
            <div className="absolute -top-4 -left-2 text-[200px] lg:text-[380px] font-black text-white/[0.2] leading-none select-none z-0 tracking-tighter pointer-events-none">
              {data.shirtNumber}
            </div>
            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] bg-emerald-500/8 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(16,185,129,0.12)]"
                />
              ) : (
                <div className="flex flex-col items-center py-16">
                  <div className="w-36 h-36 rounded-full bg-slate-800/60 flex items-center justify-center border-2 border-white/5 mb-4">
                    <FiUser size={56} className="text-slate-700" />
                  </div>
                  <span className="text-6xl font-black text-white/10">#{data.shirtNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1 pb-6 lg:pb-14 text-center lg:text-left animate-fade-in-up">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start flex-wrap">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                {data.position}
              </span>
              {data.nationality && (
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <FiMapPin size={10} />
                  {data.nationality}
                </span>
              )}
              {data.stats?.mom > 0 && (
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <FiAward size={11} /> MOM ×{data.stats.mom}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] mb-5">
              {data.name}
            </h1>

            {/* Team & Bio info */}
            <div className="flex items-center gap-4 justify-center lg:justify-start flex-wrap text-sm mb-6">
              <Link
                href={`/teams/${data.teamId}`}
                className="flex items-center gap-2 bg-white/[0.04] px-4 py-2.5 rounded-xl border border-white/8 hover:border-emerald-500/30 transition-all group"
              >
                <GiShield className="text-emerald-500" size={16} />
                <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{data.teamName}</span>
                {data.age && (
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-bold">
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
        <div className="max-w-6xl mx-auto px-6 pb-8">

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "გოლი", value: data.stats?.goals || 0, icon: GiSoccerBall },
              { label: "ასისტი", value: data.stats?.assists || 0, icon: GiRunningShoe },
              { label: "მატჩი", value: data.stats?.matches || 0, icon: GiShield },
              { label: "წუთი", value: `${data.stats?.minutes || 0}'`, icon: FiAward },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="relative rounded-xl px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm group hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 animate-reveal-up flex items-center gap-4"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-white/40" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-2xl font-black text-white tabular-nums leading-tight">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── Attributes ── */}
            {data.attributes && (
              <div className="rounded-2xl p-7 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm animate-reveal-up delay-300">
                <div className="flex items-center justify-between mb-7">
                  <h3 className="text-base font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <GiSoccerBall className="text-white/40" size={14} />
                    </div>
                    მონაცემები
                  </h3>
                  {overallRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">OVR</span>
                      <span className="text-2xl font-black text-white tabular-nums">{overallRating}</span>
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
                      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full animate-bar-fill bg-gradient-to-r from-white/20 to-white/40"
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
            <div className="rounded-2xl p-7 bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm animate-reveal-up delay-500 flex flex-col">
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <FiUser className="text-white/40" size={14} />
                </div>
                ბიოგრაფია
              </h3>

              <p className="text-slate-400 leading-relaxed text-sm flex-1">
                {data.bio || "ინფორმაცია მოთამაშის შესახებ არ არის ხელმისაწვდომი."}
              </p>

              {/* Quick Facts */}
              <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-4">
                {[
                  { label: "პოზიცია", value: data.position },
                  { label: "ნომერი", value: `#${data.shirtNumber}` },
                  { label: "ასაკი", value: data.age ? `${data.age} წელი` : "—" },
                  { label: "ფეხი", value: data.preferredFoot || "—" },
                ].map((fact) => (
                  <div key={fact.label}>
                    <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">{fact.label}</div>
                    <div className="text-sm font-semibold text-white">{fact.value}</div>
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
