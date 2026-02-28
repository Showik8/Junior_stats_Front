"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { FiUser, FiSearch, FiFilter } from "react-icons/fi";
import { GiSoccerBall, GiRunningShoe, GiShield } from "react-icons/gi";
import TopPerformers from "@/app/components/public/landing/TopPerformers";

/* eslint-disable @typescript-eslint/no-explicit-any */

const POSITIONS = [
  "ყველა",
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
  "Winger",
];

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("ყველა");

  const { data: players = [], isLoading: loading } = useQuery<any[]>({
    queryKey: ["all-players"],
    queryFn: () => publicService.getAllPlayers(),
  });

  const filtered = players.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.teamName?.toLowerCase().includes(search.toLowerCase());
    const matchPos = posFilter === "ყველა" || p.position === posFilter;
    return matchSearch && matchPos;
  });

  const sorted = [...filtered].sort(
    (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-white/5 border-t-emerald-500 rounded-full animate-spin" />
          <FiUser
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
            size={20}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ═══ TOP PLAYERS (reused from landing) ═══ */}
      <TopPerformers />

      {/* ═══ ALL PLAYERS ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
          ყველა <span className="text-(--emerald-glow)">მოთამაშე</span>
        </h2>
        <p className="text-(--text-secondary) text-sm mb-8">
          მოძებნე და გაფილტრე მოთამაშეები პოზიციის მიხედვით
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="მოძებნე მოთამაშე ან გუნდი..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 placeholder-white/40 text-sm focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-colors"
            />
          </div>
          <div className="relative">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              size={14}
            />
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 appearance-none cursor-pointer transition-colors"
            >
              {POSITIONS.map((pos) => (
                <option
                  key={pos}
                  value={pos}
                  className="bg-[#0a1120] text-white"
                >
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-(--text-secondary) mb-6 font-semibold uppercase tracking-wider">
          {sorted.length} მოთამაშე ნაპოვნია
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((player, idx) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="group glass-card rounded-2xl p-5 flex items-stretch gap-4 animate-reveal-up hover:border-emerald-400/40 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="relative shrink-0">
                {player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-emerald-400/60 transition-all duration-300 shadow-md shadow-black/40"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:border-emerald-400/40 transition-all duration-300 shadow-inner">
                    <FiUser size={22} className="text-white/30" />
                  </div>
                )}
                {player.shirtNumber && (
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-black text-black shadow-lg shadow-emerald-900/40">
                    #{player.shirtNumber}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {player.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-(--text-secondary)">
                        {player.position || "პოზიცია მითითებული არ არის"}
                      </span>
                      {player.teamName && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/70">
                          {player.teamName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <GiSoccerBall className="text-emerald-400" size={11} />
                    <span className="font-semibold tabular-nums">
                      {player.stats?.goals || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-white/40">
                      გოლი
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <GiRunningShoe className="text-blue-400" size={11} />
                    <span className="font-semibold tabular-nums">
                      {player.stats?.assists || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-white/40">
                      ასისტი
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <GiShield className="text-violet-400" size={11} />
                    <span className="font-semibold tabular-nums">
                      {player.stats?.matches || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-white/40">
                      მატჩი
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <FiUser size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-(--text-secondary) text-sm">
              მოთამაშე ვერ მოიძებნა
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
