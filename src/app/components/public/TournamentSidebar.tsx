"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import type { PublicTournament, PublicTeam, PublicPlayer } from "@/types/public";
import { GiTrophy, GiShield } from "react-icons/gi";
import { FiChevronRight, FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_DOT_COLOR: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  FINISHED: "bg-blue-500",
  INACTIVE: "bg-slate-600",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "მიმდინარე",
  FINISHED: "დასრულებული",
  INACTIVE: "არააქტიური",
};

const SECTION_COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-500",
  blue: "text-blue-500",
  amber: "text-amber-500",
  purple: "text-purple-500",
  slate: "text-slate-500",
};

// ─── Sub-Components (module-level for stable references) ─────────────────────

function SectionHeader({ label, count, color = "slate" }: { label: string; count: number; color?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-4 pb-2">
      <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${SECTION_COLOR_MAP[color] || SECTION_COLOR_MAP.slate}`}>
        {label}
      </span>
      <span className="text-[10px] font-bold text-slate-700 bg-white/3 px-1.5 py-0.5 rounded">{count}</span>
    </div>
  );
}

function TournamentItem({ tournament, idx = 0, pathname }: { tournament: PublicTournament; idx?: number; pathname: string }) {
  const isActive = pathname === `/tournaments/${tournament.id}` || pathname.startsWith(`/tournaments/${tournament.id}/`);

  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className={`
        group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 animate-fade-in-up
        ${isActive
          ? "bg-emerald-500/8 text-white border border-emerald-500/15"
          : "text-slate-400 hover:text-white hover:bg-white/4 border border-transparent"
        }
      `}
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/50" />
      )}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
        ${isActive
          ? "bg-emerald-500/15 border border-emerald-500/25"
          : "bg-white/3 border border-white/5 group-hover:border-white/10"
        }
      `}>
        {tournament.logoUrl ? (
          <Image src={tournament.logoUrl} alt={tournament.name || "Tournament"} width={24} height={24} className="w-6 h-6 object-contain" />
        ) : (
          <GiTrophy size={16} className={isActive ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400 transition-colors"} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold truncate ${isActive ? "text-emerald-400" : "group-hover:text-white"}`}>
          {tournament.name}
        </div>
        <div className="text-[10px] text-slate-500 flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_COLOR[tournament.status] || STATUS_DOT_COLOR.INACTIVE}`} />
          {tournament.ageCategories?.[0] || "U-??"} • {tournament.teamCount} გუნდი
        </div>
      </div>
      {isActive && <FiChevronRight size={14} className="text-emerald-500 shrink-0" />}
    </Link>
  );
}

function TeamItem({ team, idx = 0 }: { team: PublicTeam; idx?: number }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/4 border border-transparent transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
        {team.logo ? (
          <Image src={team.logo} alt={team.name || "Team"} width={24} height={24} className="w-6 h-6 object-contain" />
        ) : (
          <GiShield size={16} className="text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate group-hover:text-white">{team.name}</div>
        <div className="text-[10px] text-slate-500">{team.city || "გუნდი"}</div>
      </div>
    </Link>
  );
}

function PlayerItem({ player, idx = 0 }: { player: PublicPlayer; idx?: number }) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/4 border border-transparent transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0 overflow-hidden">
        {player.photoUrl ? (
          <Image src={player.photoUrl} alt={player.name || "Player"} width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          <FiUser size={16} className="text-purple-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate group-hover:text-white">{player.name}</div>
        <div className="text-[10px] text-slate-500">{player.teamName || "მოთამაშე"} • {player.position}</div>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TournamentSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  const { data: tournaments = [], isLoading: loadingTournaments } = useQuery({
    queryKey: ["sidebar-tournaments"],
    queryFn: () => publicService.getTournaments({ limit: 50 }).then((r) => r.tournaments),
  });

  const { data: teams = [], isLoading: loadingTeams } = useQuery({
    queryKey: ["sidebar-teams"],
    queryFn: () => publicService.getAllTeams(),
  });

  const { data: players = [], isLoading: loadingPlayers } = useQuery({
    queryKey: ["sidebar-players"],
    queryFn: () => publicService.getAllPlayers(),
  });

  const loading = loadingTournaments || loadingTeams || loadingPlayers;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const q = search.toLowerCase().trim();
  const isSearching = q.length > 0;

  // ── Search results (memoized) ──
  const filteredTournaments = useMemo(
    () => tournaments.filter((t) => t.name.toLowerCase().includes(q)),
    [tournaments, q]
  );
  const filteredTeams = useMemo(
    () => (isSearching ? teams.filter((t) => t.name.toLowerCase().includes(q)) : []),
    [teams, q, isSearching]
  );
  const filteredPlayers = useMemo(
    () => (isSearching ? players.filter((p) => p.name.toLowerCase().includes(q)) : []),
    [players, q, isSearching]
  );

  // ── Group tournaments by status (memoized) ──
  const { active, finished, inactive } = useMemo(() => ({
    active: filteredTournaments.filter((t) => t.status === "ACTIVE"),
    finished: filteredTournaments.filter((t) => t.status === "FINISHED"),
    inactive: filteredTournaments.filter((t) => t.status === "INACTIVE"),
  }), [filteredTournaments]);

  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleClearSearch = useCallback(() => setSearch(""), []);

  const noResults = isSearching && filteredTournaments.length === 0 && filteredTeams.length === 0 && filteredPlayers.length === 0;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={handleToggle}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white hover:bg-emerald-400 transition-colors active:scale-95"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#0a1228]/98 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:static lg:h-[calc(100vh-80px)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full overflow-y-auto p-4 flex flex-col">
          {/* Search */}
          <div className="relative mb-4 px-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input
              type="text"
              placeholder="ძიება..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/3 border border-white/5 focus:border-emerald-500/30 text-white text-sm pl-9 pr-8 py-2.5 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-600 focus:bg-white/5"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3 px-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-white/3 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : noResults ? (
            <div className="text-center py-8 px-4">
              <FiSearch size={32} className="text-slate-800 mx-auto mb-3" />
              <p className="text-xs text-slate-600">
                &quot;{search}&quot; — ვერ მოიძებნა
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto">

              {/* ── Search results mode ── */}
              {isSearching ? (
                <>
                  {filteredTournaments.length > 0 && (
                    <>
                      <SectionHeader label="ტურნირები" count={filteredTournaments.length} color="amber" />
                      {filteredTournaments.map((t, idx) => <TournamentItem key={t.id} tournament={t} idx={idx} pathname={pathname} />)}
                    </>
                  )}
                  {filteredTeams.length > 0 && (
                    <>
                      <SectionHeader label="გუნდები" count={filteredTeams.length} color="blue" />
                      {filteredTeams.slice(0, 8).map((t, idx) => <TeamItem key={t.id} team={t} idx={idx} />)}
                    </>
                  )}
                  {filteredPlayers.length > 0 && (
                    <>
                      <SectionHeader label="მოთამაშეები" count={filteredPlayers.length} color="purple" />
                      {filteredPlayers.slice(0, 8).map((p, idx) => <PlayerItem key={p.id} player={p} idx={idx} />)}
                    </>
                  )}
                </>
              ) : (
                /* ── Default: tournaments grouped by status ── */
                <>
                  {active.length > 0 && (
                    <>
                      <SectionHeader label={STATUS_LABEL.ACTIVE} count={active.length} color="emerald" />
                      {active.map((t, idx) => <TournamentItem key={t.id} tournament={t} idx={idx} pathname={pathname} />)}
                    </>
                  )}
                  {finished.length > 0 && (
                    <>
                      <SectionHeader label={STATUS_LABEL.FINISHED} count={finished.length} color="blue" />
                      {finished.map((t, idx) => <TournamentItem key={t.id} tournament={t} idx={idx} pathname={pathname} />)}
                    </>
                  )}
                  {inactive.length > 0 && (
                    <>
                      <SectionHeader label={STATUS_LABEL.INACTIVE} count={inactive.length} />
                      {inactive.map((t, idx) => <TournamentItem key={t.id} tournament={t} idx={idx} pathname={pathname} />)}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
