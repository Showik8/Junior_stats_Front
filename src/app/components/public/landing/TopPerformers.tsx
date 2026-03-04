"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserShield, FaFutbol, FaHandsHelping, FaRunning } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const AGE_GROUPS = ["U12", "U14", "U15", "U16", "U17"];

const CATEGORIES = [
  { id: "scorers" as const, label: "ბომბარდირები", icon: FaFutbol },
  { id: "assists" as const, label: "საგოლე გადაცემა", icon: FaHandsHelping },
  { id: "matches" as const, label: "მატჩები", icon: FaRunning },
];

interface PerformerStat {
  player: { id: string; name: string; photoUrl?: string };
  team?: { name: string; logo?: string; ageCategory?: string };
  statistics?: {
    goals?: number;
    assists?: number;
    matchesPlayed?: number;
    minutesPlayed?: number;
  };
}

const RANK_STYLES: Record<number, { border: string; badge: string }> = {
  1: {
    border: "border-[#10b981] shadow-[0_0_20px_-4px_rgba(16,185,129,0.5)]",
    badge: "bg-[#10b981] text-white",
  },
  2: {
    border: "border-white/20",
    badge: "bg-white/20 text-white",
  },
  3: {
    border: "border-[#cd7f32]/40",
    badge: "bg-[#cd7f32]/30 text-[#cd7f32]",
  },
};

type CategoryId = "scorers" | "assists" | "matches";

export default function TopPerformers() {
  const [activeAge, setActiveAge] = useState("U16");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("scorers");
  const containerRef = useRef<HTMLElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  const ageCategoryFilter = "U_" + activeAge.replace("U", "");

  const { data: globalStats, isLoading } = useQuery({
    queryKey: ["global-stats", ageCategoryFilter],
    queryFn: () =>
      publicService.getGlobalStatistics({ ageCategory: ageCategoryFilter, limit: 6 }),
  });

  // Select items based on active category
  let activeItems: PerformerStat[] = [];
  if (globalStats) {
    const stats = globalStats as Record<string, PerformerStat[]>;
    if (activeCategory === "scorers") activeItems = stats.topScorers || [];
    else if (activeCategory === "assists") activeItems = stats.topAssists || [];
    else if (activeCategory === "matches") activeItems = stats.mostMatchesPlayed || [];
  }

  // Get the stat value to display based on category
  const getStatValue = (statistics: PerformerStat["statistics"]) => {
    if (activeCategory === "scorers") return statistics?.goals ?? 0;
    if (activeCategory === "assists") return statistics?.assists ?? 0;
    return statistics?.matchesPlayed ?? 0;
  };

  const getStatLabel = () => {
    if (activeCategory === "scorers") return "გოლები";
    if (activeCategory === "assists") return "ასისტები";
    return "მატჩები";
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
    
    tl.fromTo(
      ".top-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
    );

    const cards = gsap.utils.toArray(".performer-card");
    if (cards.length > 0) {
      tl.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.93 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.4)" },
        "-=0.3"
      );
    }
  }, { scope: containerRef });

  useGSAP(() => {
    if (isLoading || activeItems.length === 0) return;
    gsap.fromTo(
      ".performer-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", clearProps: "all" }
    );
  }, { dependencies: [activeAge, activeCategory, isLoading, activeItems.length], scope: cardsWrapperRef });

  const handleAgeChange = useCallback((age: string) => setActiveAge(age), []);
  const handleCategoryChange = useCallback((cat: CategoryId) => setActiveCategory(cat), []);

  return (
    <section ref={containerRef} className="py-20 relative overflow-hidden bg-[#060c1a]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#10b981]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header row: title + age tabs */}
        <div className="top-header flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            ტოპ <span className="text-[#10b981]">შემსრულებლები</span>
          </h2>

          {/* Age Group Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-[#0d1623] border border-white/10 rounded-full">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeChange(age)}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-250 ${
                  activeAge === age
                    ? "bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "border-[#10b981]/50 bg-[#10b981]/10 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : "border-white/10 text-white/40 hover:border-white/25 hover:text-white"
                }`}
              >
                <Icon className={activeCategory === cat.id ? "text-[#10b981]" : ""} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div ref={cardsWrapperRef} className="relative min-h-[360px]">
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10b981]" />
            </div>
          ) : activeItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <span className="text-4xl mb-3">🏆</span>
              <p className="text-sm">მონაცემები ჯერ არ არის</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {activeItems.slice(0, 4).map((item, index) => {
                const { player, team, statistics } = item;
                const rank = index + 1;
                const style = RANK_STYLES[rank] || { border: "border-white/10", badge: "bg-white/10 text-white/60" };

                return (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className={`performer-card w-full relative rounded-2xl overflow-hidden flex flex-col border-2 transition-all duration-300 hover:-translate-y-1 bg-[#0d1623] ${style.border}`}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${style.badge}`}>
                        #{rank}
                      </span>
                    </div>

                    {/* Player Photo */}
                    <div className="relative w-full h-48 bg-[#0a1628] flex items-end justify-center overflow-hidden">
                      {player.photoUrl ? (
                        <Image
                          src={player.photoUrl}
                          alt={player.name}
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserShield className="text-5xl text-white/10" />
                        </div>
                      )}
                      {/* Bottom gradient on photo */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#0d1623] via-transparent to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1 flex-1">
                      <h3 className="font-bold text-white text-sm leading-tight line-clamp-1">
                        {player.name}
                      </h3>
                      <p className="text-white/40 text-xs line-clamp-1">
                        {team?.name || "უცნობი გუნდი"} · {team?.ageCategory?.replace("U_", "U") || activeAge}
                      </p>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/8">
                        <span className="text-xs text-white/40">
                          {getStatLabel()}:{" "}
                          <span className="font-bold text-[#10b981]">{getStatValue(statistics)}</span>
                        </span>
                        <span className="text-xs text-white/40">
                          {activeCategory === "matches" ? "წუთები" : "მატჩები"}:{" "}
                          <span className="font-bold text-white/70">
                            {activeCategory === "matches"
                              ? (statistics?.minutesPlayed ?? 0)
                              : (statistics?.matchesPlayed ?? 0)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
