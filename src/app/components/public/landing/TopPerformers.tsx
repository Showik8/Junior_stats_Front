"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFutbol, FaHandsHelping, FaRunning, FaUserShield, FaArrowRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const AGE_GROUPS = ["U12", "U14", "U16", "U17"];
const CATEGORIES = [
  { id: "scorers", label: "ბომბარდირები", icon: FaFutbol },
  { id: "assists", label: "ასისტენტები", icon: FaHandsHelping },
  { id: "matches", label: "ყველაზე მეტი მატჩი", icon: FaRunning },
] as const;

export default function TopPerformers() {
  const [activeAge, setActiveAge] = useState("U16");
  const [activeCategory, setActiveCategory] = useState<"scorers" | "assists" | "matches">("scorers");
  
  const containerRef = useRef<HTMLElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  const ageCategoryFilter = "U_" + activeAge.replace("U", "");

  const { data: globalStats, isLoading } = useQuery({
    queryKey: ["global-stats", ageCategoryFilter],
    queryFn: () => publicService.getGlobalStatistics({ ageCategory: ageCategoryFilter, limit: 3 }),
  });

  // Get active items based on selected category
  let activeItems: any[] = [];
  if (globalStats) {
    if (activeCategory === "scorers") activeItems = globalStats.topScorers || [];
    else if (activeCategory === "assists") activeItems = globalStats.topAssists || [];
    else if (activeCategory === "matches") activeItems = globalStats.mostMatchesPlayed || [];
  }

  // GSAP Animation handling: Section entry
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      ".top-header",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".top-filters",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  // Animate cards on filter change or data load
  useGSAP(() => {
    if (isLoading || activeItems.length === 0) return;
    
    gsap.fromTo(
      ".performer-card",
      { y: 30, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.5, 
        stagger: 0.1,
        ease: "back.out(1.5)",
        clearProps: "all"
      }
    );
  }, { dependencies: [activeCategory, activeAge, isLoading, activeItems.length], scope: cardsWrapperRef });

  const handleAgeChange = useCallback((age: string) => {
    setActiveAge(age);
  }, []);

  const handleCategoryChange = useCallback((cat: "scorers" | "assists" | "matches") => {
    setActiveCategory(cat);
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-black/20">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-(--emerald-glow)/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="top-header text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            ტოპ <span className="text-gradient-primary">შემსრულებლები</span>
          </h2>
          <p className="text-(--text-secondary) max-w-lg mx-auto text-lg">
            საუკეთესო მოთამაშეები ასაკობრივი კატეგორიების მიხედვით
          </p>
        </div>

        {/* Filters Container */}
        <div className="top-filters flex flex-col items-center gap-5 mb-14">
          {/* Main Tabs (Age Groups) */}
          <div className="inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-xl flex-wrap justify-center">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeChange(age)}
                className={`px-6 md:px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeAge === age
                    ? "bg-(--emerald-glow) text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] scale-105"
                    : "text-(--text-secondary) hover:text-white hover:bg-white/5"
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Sub-Tabs (Categories) */}
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "border-(--emerald-glow)/50 bg-(--emerald-glow)/10 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "border-white/10 text-(--text-secondary) hover:border-white/25 hover:text-white"
                  }`}
                >
                  <Icon className={activeCategory === cat.id ? "text-(--emerald-glow)" : ""} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Display */}
        <div ref={cardsWrapperRef} className="min-h-[350px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--emerald-glow)"></div>
            </div>
          ) : activeItems.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 py-10">
              <span className="text-4xl mb-4">🏆</span>
              <p className="text-lg">მონაცემები ჯერ არ არის</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeItems.map((item, index) => {
                const { player, team, statistics } = item;
                const rank = index + 1;
                
                return (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className="performer-card glass-card p-6 rounded-3xl group flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)] bg-white/5 border border-white/10 hover:border-white/20"
                  >
                    {/* Rank Badge */}
                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-3xl flex items-center justify-center text-xl font-black ${rank === 1 ? 'bg-linear-to-bl from-(--gold)/30 to-transparent text-(--gold)' : 'bg-linear-to-bl from-white/10 to-transparent text-white/60'}`}>
                      #{rank}
                    </div>

                    <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="flex items-center gap-5 mb-6 relative z-10">
                      <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-white/5 to-white/10 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-(--emerald-glow)/50 transition-all duration-500 shrink-0 shadow-lg">
                        {player.photoUrl ? (
                          <Image src={player.photoUrl} alt={player.name} width={80} height={80} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <FaUserShield className="text-white/20 text-3xl" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold leading-tight group-hover:text-gradient-primary transition-all line-clamp-2">
                          {player.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-(--text-secondary)">
                          {team?.logo && team.logo.length > 5 ? (
                            <Image src={team.logo} alt={team.name || "Team"} width={16} height={16} className="object-contain" />
                          ) : (
                            <span>🛡️</span>
                          )}
                          <span className="truncate max-w-[120px]">{team?.name || "უცნობი გუნდი"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Display */}
                    <div className="mt-auto bg-black/20 rounded-2xl p-4 border border-white/5 flex items-end justify-between relative z-10 group-hover:bg-black/40 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs text-(--text-secondary) font-bold uppercase tracking-wider mb-1">
                          {activeCategory === "scorers" && "გოლები"}
                          {activeCategory === "assists" && "ასისტები"}
                          {activeCategory === "matches" && "ჩატ. მატჩები"}
                        </span>
                        <span className={`text-4xl font-black leading-none ${activeCategory === 'matches' ? 'text-white' : 'text-(--emerald-glow)'}`}>
                          {activeCategory === "scorers" && (statistics?.goals || 0)}
                          {activeCategory === "assists" && (statistics?.assists || 0)}
                          {activeCategory === "matches" && (statistics?.matchesPlayed || 0)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-(--text-secondary) font-bold uppercase tracking-wider mb-1">
                           {activeCategory === "matches" ? "წუთები" : "მატჩები"}
                        </span>
                        <span className="text-lg font-bold text-white/80">
                           {activeCategory === "matches" ? (statistics?.minutesPlayed || 0) : (statistics?.matchesPlayed || 0)}
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
