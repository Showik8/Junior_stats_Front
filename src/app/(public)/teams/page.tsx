"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { FiUsers, FiSearch, FiChevronRight } from "react-icons/fi";
import { GiShield, GiWhistle, GiSoccerBall } from "react-icons/gi";
import TopPerformers from "@/app/components/public/landing/TopPerformers";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TeamsPage() {
  const [search, setSearch] = useState("");

  const { data: teams = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["all-teams"],
    queryFn: () => publicService.getAllTeams(),
  });

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.coach?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort(
    (a, b) => (b.stats?.points || 0) - (a.stats?.points || 0)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-white/5 border-t-emerald-500 rounded-full animate-spin" />
          <GiShield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={20} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ═══ TOP TEAMS (reused from landing) ═══ */}
      <TopPerformers />

      {/* ═══ ALL TEAMS ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
          ყველა <span className="text-(--emerald-glow)">გუნდი</span>
        </h2>
        <p className="text-(--text-secondary) text-sm mb-8">
          მოძებნე გუნდი ან მწვრთნელი სახელით
        </p>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="მოძებნე გუნდი ან მწვრთნელი..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        <div className="text-xs text-(--text-secondary) mb-6 font-semibold uppercase tracking-wider">
          {sorted.length} გუნდი ნაპოვნია
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((team, idx) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group glass-card rounded-2xl p-6 hover:border-white/15 transition-all animate-reveal-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-16 h-16 rounded-full bg-[#0a1228] border-2 border-white/8 flex items-center justify-center overflow-hidden group-hover:border-white/20 transition-colors">
                    {team.logo ? (
                      <img src={team.logo} alt="" className="w-[70%] h-[70%] object-contain" />
                    ) : (
                      <GiShield size={28} className="text-white/20" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {team.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-(--text-secondary)">
                        {team.ageCategory && (
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/8 font-bold">
                            {team.ageCategory}
                          </span>
                        )}
                        {team.coach && (
                          <span className="flex items-center gap-1.5">
                            <GiWhistle size={11} className="text-white/30" />
                            {team.coach}
                          </span>
                        )}
                      </div>
                    </div>
                    <FiChevronRight
                      className="text-white/15 group-hover:text-emerald-400 transition-colors mt-1.5 shrink-0"
                      size={18}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                    <StatPill label="W" value={team.stats?.wins || 0} variant="emerald" />
                    <StatPill label="D" value={team.stats?.draws || 0} variant="default" />
                    <StatPill label="L" value={team.stats?.losses || 0} variant="red" />

                    <div className="ml-auto flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <GiSoccerBall size={11} className="text-white/25" />
                        <span className="font-bold text-white/60">{team.stats?.goalsFor || 0}</span>
                        <span className="text-white/15">/</span>
                        <span className="font-bold text-white/40">{team.stats?.goalsAgainst || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiUsers size={11} className="text-white/25" />
                        <span className="font-bold text-white/60">{team.stats?.totalPlayers || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <GiShield size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-(--text-secondary) text-sm">გუნდი ვერ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, variant }: { label: string; value: number; variant: "emerald" | "red" | "default" }) {
  const colors = {
    emerald: "text-emerald-400",
    red: "text-red-400",
    default: "text-white/50",
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-bold text-white/30 uppercase">{label}</span>
      <span className={`text-sm font-black tabular-nums ${colors[variant]}`}>{value}</span>
    </div>
  );
}
