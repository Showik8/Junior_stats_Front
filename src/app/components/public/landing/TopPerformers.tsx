"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserShield, FaTrophy, FaArrowRight } from "react-icons/fa";
import { publicService } from "@/services/public.service";
import type { PublicPlayer, PublicTeam } from "@/types/public";

const AGE_GROUPS = ["U10", "U12", "U15", "U17"];
const CATEGORIES = [
  { id: "players", label: "საუკეთესო მოთამაშეები", icon: FaUserShield },
  { id: "teams", label: "ტოპ გუნდები", icon: FaTrophy },
] as const;

interface DisplayPlayer {
  id: string;
  name: string;
  position: string;
  stat: string;
  photoUrl?: string | null;
}

interface DisplayTeam {
  id: string;
  name: string;
  points: string;
  form: string;
  logo: string;
}

interface TopPerformersProps {
  mode?: "all" | "players" | "teams";
}

export default function TopPerformers({ mode = "all" }: TopPerformersProps) {
  const defaultCategory = mode === "teams" ? "teams" : "players";
  const [activeAge, setActiveAge] = useState("U15");
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [animKey, setAnimKey] = useState(0);

  const [players, setPlayers] = useState<DisplayPlayer[]>([]);
  const [teams, setTeams] = useState<DisplayTeam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ageCategoryFilter = "U_" + activeAge.replace("U", "");
        
        let fetchedPlayers: PublicPlayer[] = [];
        let fetchedTeams: PublicTeam[] = [];

        if (activeCategory === "players" || mode === "players") {
          fetchedPlayers = await publicService.getAllPlayers({ ageCategory: ageCategoryFilter });
        }
        
        if (activeCategory === "teams" || mode === "teams") {
          fetchedTeams = await publicService.getAllTeams({ ageCategory: ageCategoryFilter });
        }

        setPlayers(
          fetchedPlayers.slice(0, 3).map((p) => ({
             id: p.id,
             name: p.name,
             position: p.position || "მოთამაშე",
             stat: "სტატისტიკა",
             photoUrl: p.photoUrl,
          }))
        );

        setTeams(
          fetchedTeams.slice(0, 3).map((t) => ({
             id: t.id,
             name: t.name,
             points: "0 ქულა",
             form: "N/A",
             logo: t.logo || "🛡️",
          }))
        );

      } catch (error) {
        console.error("Error fetching top performers data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeAge, activeCategory, mode]);

  const visibleCategories = mode === "all"
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id === mode);

  const handleAgeChange = useCallback((age: string) => {
    setActiveAge(age);
    setAnimKey((k) => k + 1);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setAnimKey((k) => k + 1);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-(--emerald-glow)/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            ტოპ <span className="text-gradient-primary">შემსრულებლები</span>
          </h2>
          <p className="text-(--text-secondary) max-w-lg mx-auto">
            საუკეთესო მოთამაშეები და გუნდები ასაკობრივი კატეგორიების მიხედვით
          </p>
        </div>

        {/* Filters Container */}
        <div className="flex flex-col items-center gap-5 mb-12">
          {/* Main Tabs (Age Groups) */}
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeChange(age)}
                className={`px-5 sm:px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeAge === age
                    ? "bg-(--emerald-glow) text-white shadow-lg shadow-emerald-900/30"
                    : "text-(--text-secondary) hover:text-white hover:bg-white/5"
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Sub-Tabs (Players vs Teams) — hidden when single mode */}
          {visibleCategories.length > 1 && (
            <div className="flex gap-3">
              {visibleCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                      activeCategory === cat.id
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/10 text-(--text-secondary) hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Display */}
        {loading ? (
             <div className="flex justify-center items-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--emerald-glow)"></div>
             </div>
        ) : (
             <div key={animKey} className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {activeCategory === "players" && players.length === 0 && (
                 <div className="col-span-3 text-center text-white/50 py-10">ჩანაწერები არ მოიძებნა</div>
               )}
               {activeCategory === "players" &&
                 players.map((player, i) => (
                   <Link
                     key={player.id}
                     href={`/players/${player.id}`}
                     className="glass-card p-6 rounded-2xl group flex flex-col items-center text-center animate-fade-in-up"
                     style={{ animationDelay: `${i * 100}ms` }}
                   >
                     {/* Player Photo or Fallback */}
                     <div className="w-24 h-24 rounded-full bg-white/4 mb-4 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-white/25 transition-all duration-300">
                       {player.photoUrl ? (
                         <Image
                           src={player.photoUrl}
                           alt={player.name}
                           width={96}
                           height={96}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                         <FaUserShield className="text-white/20 text-3xl" />
                       )}
                     </div>
                     <h3 className="text-lg font-bold mb-1 group-hover:text-(--emerald-glow) transition-colors">
                       {player.name}
                     </h3>
                     <span className="text-(--text-secondary) text-sm mb-4">
                       {player.position}
                     </span>
                     <div className="mt-auto inline-block bg-white/5 text-white/80 px-4 py-1.5 rounded-lg font-black text-lg border border-white/10">
                       {player.stat}
                     </div>
                   </Link>
                 ))}

               {activeCategory === "teams" && teams.length === 0 && (
                 <div className="col-span-3 text-center text-white/50 py-10">გუნდები არ მოიძებნა</div>
               )}
               {activeCategory === "teams" &&
                 teams.map((team, i) => (
                   <Link
                     key={team.id}
                     href={`/teams/${team.id}`}
                     className="glass-card p-6 rounded-2xl group text-center relative overflow-hidden animate-fade-in-up"
                     style={{ animationDelay: `${i * 100}ms` }}
                   >
                     {/* Decorative Side highlight */}
                     <div className="absolute top-0 left-0 w-1 h-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                     <div className="w-20 h-20 mx-auto rounded-full bg-white/5 mb-4 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-105 group-hover:border-white/25 transition-all duration-300 overflow-hidden">
                       {team.logo?.startsWith("http") || team.logo?.startsWith("/") ? (
                         <Image src={team.logo} alt={team.name} width={80} height={80} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-3xl">{team.logo}</span>
                       )}
                     </div>
                     <h3 className="text-lg font-bold mb-2">{team.name}</h3>
                     <p className="font-mono text-xs tracking-widest text-(--text-secondary) mb-4">
                       {team.form}
                     </p>
                     <div className="inline-flex items-center gap-2 text-white/70 font-bold">
                       <span>{team.points}</span>
                       <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                     </div>
                   </Link>
                 ))}
             </div>
        )}
      </div>
    </section>
  );
}
