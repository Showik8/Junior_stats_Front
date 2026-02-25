"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiSearch, FiFilter } from "react-icons/fi";
import { GiSoccerBall, GiRunningShoe, GiShield } from "react-icons/gi";
import TopPerformers from "@/app/components/public/landing/TopPerformers";

/* eslint-disable @typescript-eslint/no-explicit-any */

const POSITIONS = ["ყველა", "Forward", "Midfielder", "Defender", "Goalkeeper", "Winger"];

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("ყველა");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await publicService.getAllPlayers();
        setPlayers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

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
          <FiUser className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={20} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ═══ TOP PLAYERS (reused from landing) ═══ */}
      <TopPerformers mode="players" />

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
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="მოძებნე მოთამაშე ან გუნდი..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/4er border-white/8-white placeholder-white/30 text-sm focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-xl bg-white/4er border-white/8 text-white text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer transition-colors"
            >
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos} className="bg-[#0a1120] text-white">
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
              className="group glass-card rounded-xl p-5 flex items-center gap-4 animate-reveal-up hover:border-white/15 transition-all"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {player.photoUrl ? (
                <img
                  src={player.photoUrl}
                  alt={player.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/8 group-hover:border-emerald-500/30 transition-colors shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/4 items-center justify-center border-2 border-white/5 group-hover:border-emerald-500/20 transition-colors shrink-0">
                  <FiUser size={20} className="text-white/20" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate group-hover:text-emerald-400 transition-colors">
                      {player.name}
                    </div>
                    <div className="text-(--text-secondary) text-xs mt-0.5">
                      {player.position || "—"}
                      {player.teamName && <span className="text-white/20 mx-1">•</span>}
                      {player.teamName && <span className="text-white/30">{player.teamName}</span>}
                    </div>
                  </div>
                  {player.shirtNumber && (
                    <span className="text-xs font-bold text-white/20 shrink-0">#{player.shirtNumber}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2.5">
                  <div className="flex items-center gap-1.5">
                    <GiSoccerBall className="text-white/25" size={11} />
                    <span className="text-xs font-bold text-white/60">{player.stats?.goals || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GiRunningShoe className="text-white/25" size={11} />
                    <span className="text-xs font-bold text-white/60">{player.stats?.assists || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GiShield className="text-white/25" size={11} />
                    <span className="text-xs font-bold text-white/60">{player.stats?.matches || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <FiUser size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-(--text-secondary)-sm">მოთამაშე ვერ მოიძებნა</p>
          </div>
        )}
      </div>
    </div>
  );
}
