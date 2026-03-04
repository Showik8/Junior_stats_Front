"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
    queryFn: () => publicService.getAllMatches({ limit: 6 }).then((data) => data.slice(0, 6)),
  });

  useGSAP(() => {
    if (loading || matches.length === 0) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    tl.fromTo(
      ".matches-header",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    ).fromTo(
      ".match-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      "-=0.3"
    );
  }, { dependencies: [loading, matches.length], scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 relative overflow-hidden bg-[#060c1a]">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="matches-header mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            კვირის <span className="text-[#10b981]">მატჩები</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10b981]" />
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-white/40 py-8 text-sm">
            ამჟამად მატჩები არ მოიძებნა
          </div>
        ) : (
          // Horizontal scrollable row of match cards
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {matches.map((match) => {
              const isLive =
                match.status === ("LIVE" as string) ||
                match.status === ("IN_PROGRESS" as string);
              const formattedTime = formatTime(match.date);
              const formattedDate = formatShortDate(match.date);

              const homeLogo = match.homeTeam?.logo;
              const awayLogo = match.awayTeam?.logo;

              return (
                <Link
                  href={`/matches/${match.id}`}
                  key={match.id}
                  className="match-card shrink-0 bg-[#0d1623] border border-white/8 hover:border-[#10b981]/40 rounded-3xl px-6 py-5 flex items-center gap-5 min-w-[250px] max-w-[300px] transition-all duration-300 hover:bg-[#0f1d2e] cursor-pointer group hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]"
                >
                  {/* Home team logo */}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/10 group-hover:border-[#10b981]/50 transition-colors duration-300 flex items-center justify-center overflow-hidden">
                    {homeLogo && (homeLogo.startsWith("http") || homeLogo.startsWith("/")) ? (
                      <Image
                        src={homeLogo}
                        alt={match.homeTeam?.name || "Home"}
                        width={44}
                        height={44}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl">{homeLogo || "🛡️"}</span>
                    )}
                  </div>

                  {/* Time & Date */}
                  <div className="flex flex-col items-center flex-1">
                    {isLive ? (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <span className="text-xs font-black text-red-500 tracking-wider">LIVE</span>
                      </div>
                    ) : (
                      <span className="text-base font-black text-white leading-none">
                        {formattedTime}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-white/40 mt-1 uppercase">{formattedDate}</span>
                  </div>

                  {/* Away team logo */}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/10 group-hover:border-[#10b981]/50 transition-colors duration-300 flex items-center justify-center overflow-hidden">
                    {awayLogo && (awayLogo.startsWith("http") || awayLogo.startsWith("/")) ? (
                      <Image
                        src={awayLogo}
                        alt={match.awayTeam?.name || "Away"}
                        width={44}
                        height={44}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl">{awayLogo || "🦅"}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
