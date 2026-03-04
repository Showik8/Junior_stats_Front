"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { FiSearch, FiChevronRight, FiFilter, FiChevronDown } from "react-icons/fi";
import { GiShield, GiWhistle, GiSoccerBall } from "react-icons/gi";
import { HiOutlineScale } from "react-icons/hi";
import { AGE_CATEGORIES } from "@/types/admin";
import LoadingSpinner from "@/app/components/public/shared/LoadingSpinner";
import TeamCompareModal from "@/app/components/public/compare/TeamCompareModal";

/* eslint-disable @typescript-eslint/no-explicit-any */

type SortOption = "points" | "wins" | "goals" | "name";

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("points");
  const [showFilters, setShowFilters] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const { data: teams = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["all-teams"],
    queryFn: () => publicService.getAllTeams(),
  });

  // Extract unique categories from the data
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    teams.forEach((t) => {
      if (t.ageCategory) cats.add(t.ageCategory);
    });
    // Sort by the predefined order
    return AGE_CATEGORIES.filter((c) => cats.has(c));
  }, [teams]);

  // Filter + Sort
  const processed = useMemo(() => {
    let result = [...teams];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.coach?.toLowerCase().includes(q)
      );
    }

    // Age category filter
    if (selectedCategory !== "ALL") {
      result = result.filter((t) => t.ageCategory === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "wins":
          return (b.stats?.wins || 0) - (a.stats?.wins || 0);
        case "goals":
          return (b.stats?.goalsFor || 0) - (a.stats?.goalsFor || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "points":
        default:
          return (b.stats?.points || 0) - (a.stats?.points || 0);
      }
    });

    return result;
  }, [teams, search, selectedCategory, sortBy]);

  if (loading) {
    return <LoadingSpinner icon={GiShield} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg [text-shadow:0_4px_24px_rgb(0_0_0/50%)]">
              ყველა <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6ee7b7] to-blue-400">გუნდი</span>
            </h2>
            <p className="text-white/40 text-sm mt-3 font-medium tracking-wide">
              მოძებნე, გაფილტრე ასაკობრივი კატეგორიით ან დაალაგე შედეგების მიხედვით
            </p>
          </div>

          {/* Compare Button */}
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_-4px_rgba(110,231,183,0.15)] whitespace-nowrap"
          >
            <HiOutlineScale size={18} />
            შედარება
          </button>

          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="მოძებნე გუნდი ან მწვრთნელი..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#080808] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 space-y-4">
          {/* Toggle filters on mobile + Sort dropdown */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-all md:hidden"
            >
              <FiFilter size={14} />
              ფილტრი
              <FiChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest hidden sm:inline">დალაგება:</span>
              <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                {([
                  { key: "points", label: "ქულები" },
                  { key: "wins", label: "მოგებები" },
                  { key: "goals", label: "გოლები" },
                  { key: "name", label: "სახელი" },
                ] as { key: SortOption; label: string }[]).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      sortBy === opt.key
                        ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Age Category Pills — always visible on desktop, toggleable on mobile */}
          <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden md:flex"}`}>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                selectedCategory === "ALL"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_-4px_rgba(110,231,183,0.2)]"
                  : "bg-white/5 border-white/5 text-white/30 hover:text-white/60 hover:bg-white/10"
              }`}
            >
              ყველა
            </button>
            {availableCategories.map((cat) => {
              const count = teams.filter((t) => t.ageCategory === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                    selectedCategory === cat
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_-4px_rgba(110,231,183,0.2)]"
                      : "bg-white/5 border-white/5 text-white/30 hover:text-white/60 hover:bg-white/10"
                  }`}
                >
                  {cat.replace("_", "-")}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/20"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-3 text-xs text-white/30 font-bold uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          {processed.length} გუნდი ნაპოვნია
          {selectedCategory !== "ALL" && (
            <span className="text-emerald-400/60 ml-1">
              • {selectedCategory.replace("_", "-")}
            </span>
          )}
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processed.map((team, idx) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group relative bg-[#030303] border border-white/5 rounded-3xl p-6 hover:border-white/10 hover:bg-[#080808] transition-all duration-300 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-linear-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start gap-5 relative z-10">
                {/* Logo */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/30 transition-colors shadow-xl">
                    {team.logo ? (
                      <div className="relative w-[70%] h-[70%] drop-shadow-md">
                        <Image src={team.logo} alt="" fill unoptimized className="object-contain" />
                      </div>
                    ) : (
                      <GiShield size={28} className="text-white/10" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#6ee7b7] transition-colors truncate tracking-wide">
                      {team.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                      <FiChevronRight className="text-white/20 group-hover:text-emerald-400 transition-colors" size={16} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {team.ageCategory && (
                      <span className="px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[9px] font-black uppercase text-white/50 tracking-widest backdrop-blur-sm">
                        {team.ageCategory.replace("_", "-")}
                      </span>
                    )}
                    {team.coach && (
                      <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/40 tracking-wider">
                        <GiWhistle size={12} className="text-white/20" />
                        {team.coach}
                      </span>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <StatPill label="W" value={team.stats?.wins || 0} variant="emerald" />
                      <StatPill label="D" value={team.stats?.draws || 0} variant="default" />
                      <StatPill label="L" value={team.stats?.losses || 0} variant="red" />
                    </div>

                    <div className="flex items-center gap-4 border-l border-white/5 pl-4">
                      <div className="flex items-center gap-1.5">
                        <GiSoccerBall size={12} className="text-white/20" />
                        <span className="text-[11px] font-bold tabular-nums">
                          <span className="text-white/80">{team.stats?.goalsFor || 0}</span>
                          <span className="text-white/20 mx-1">/</span>
                          <span className="text-white/40">{team.stats?.goalsAgainst || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

        {processed.length === 0 && (
          <div className="text-center py-24 bg-[#030303] border border-white/5 rounded-3xl mt-6">
            <GiShield size={64} className="text-white/5 mx-auto mb-6" />
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest">დაემთხვევა ვერ მოიძებნა</p>
            {selectedCategory !== "ALL" && (
              <button
                onClick={() => setSelectedCategory("ALL")}
                className="mt-4 text-xs text-emerald-400/60 hover:text-emerald-400 font-semibold transition-colors"
              >
                ყველა კატეგორიის ჩვენება →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Compare Modal */}
      {showCompare && (
        <TeamCompareModal teams={teams} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}

function StatPill({ label, value, variant }: { label: string; value: number; variant: "emerald" | "red" | "default" }) {
  const colors = {
    emerald: "text-[#6ee7b7]",
    red: "text-red-400/80",
    default: "text-white/40",
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-black tabular-nums ${colors[variant]}`}>{value}</span>
    </div>
  );
}
