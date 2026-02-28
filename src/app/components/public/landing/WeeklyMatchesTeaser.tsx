"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronRight, FaClock } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { formatTime, formatShortDate } from "@/app/utils/format";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function WeeklyMatchesTeaser() {
  const containerRef = useRef<HTMLElement>(null);

  const { data: matches = [], isLoading: loading } = useQuery({
    queryKey: ["weekly-matches"],
    queryFn: () => publicService.getAllMatches({ limit: 3 }).then((data) => data.slice(0, 3)),
  });

  useGSAP(() => {
    if (loading || matches.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      ".matches-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".match-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        stagger: 0.15,
        ease: "back.out(1.2)"
      },
      "-=0.3"
    );
  }, { dependencies: [loading, matches.length], scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--emerald-glow)/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="matches-header flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3">
              კვირის <span className="text-gradient-primary">მატჩები</span>
            </h2>
            <p className="text-(--text-secondary) max-w-md">მიმდინარე და მომავალი დაპირისპირებები ტოპ ლიგებიდან</p>
          </div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-(--emerald-glow) bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all font-semibold group"
          >
            ყველა მატჩი 
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--emerald-glow)"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-white/50 py-10">ამჟამად მატჩები არ მოიძებნა</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const isLive = match.status === "LIVE" as string || match.status === "IN_PROGRESS" as string;
              const formattedTime = formatTime(match.date);
              const formattedDate = formatShortDate(match.date);
              const score = match.status === "FINISHED" || isLive 
                ? `${match.homeScore ?? '-'} : ${match.awayScore ?? '-'}`
                : "- : -";

              return (
                <div key={match.id} className="match-card glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  
                  {/* Hover effect highlight */}
                  <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* League & Status Header */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 tracking-wider">
                       {match.tournament?.name?.substring(0,25) || match.ageCategory?.replace("U_", "U") || "მატჩი"}
                    </span>
                    {isLive ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <span className="text-[10px] font-black tracking-widest text-red-500">LIVE</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-(--text-secondary) text-sm font-medium">
                        <FaClock className="text-[10px]" />
                        <span>{formattedTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Match Content */}
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <div className="w-16 h-16 rounded-full bg-linear-to-b from-white/10 to-white/5 flex items-center justify-center text-3xl border border-white/10 group-hover:border-(--emerald-glow)/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all overflow-hidden p-2">
                        {match.homeTeam?.logo?.startsWith("http") || match.homeTeam?.logo?.startsWith("/") ? (
                          <Image src={match.homeTeam.logo!} alt={match.homeTeam.name || "Home team"} width={48} height={48} className="w-full h-full object-contain" />
                        ) : (
                          <span>{match.homeTeam?.logo || "🛡️"}</span>
                        )}
                      </div>
                      <span className="font-bold text-sm text-center leading-tight line-clamp-2 min-h-10 flex items-center">{match.homeTeam?.name || "უცნობი"}</span>
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center justify-center px-4">
                      <div className={`text-3xl font-black tracking-widest drop-shadow-md ${isLive ? 'text-gradient-primary' : 'text-white'}`}>
                        {score}
                      </div>
                      <span className="text-xs font-bold text-white/40 mt-2 tracking-wider bg-white/5 px-2 py-0.5 rounded-md">{formattedDate}</span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <div className="w-16 h-16 rounded-full bg-linear-to-b from-white/10 to-white/5 flex items-center justify-center text-3xl border border-white/10 group-hover:border-(--emerald-glow)/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all overflow-hidden p-2">
                        {match.awayTeam?.logo?.startsWith("http") || match.awayTeam?.logo?.startsWith("/") ? (
                          <Image src={match.awayTeam.logo!} alt={match.awayTeam.name || "Away team"} width={48} height={48} className="w-full h-full object-contain" />
                        ) : (
                          <span>{match.awayTeam?.logo || "🦅"}</span>
                        )}
                      </div>
                      <span className="font-bold text-sm text-center leading-tight line-clamp-2 min-h-10 flex items-center">{match.awayTeam?.name || "უცნობი"}</span>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
