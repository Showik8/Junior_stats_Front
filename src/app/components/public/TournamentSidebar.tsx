"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicService } from "@/services/public.service";
import { GiTrophy, GiShield } from "react-icons/gi";
import { FiChevronRight, FiMenu, FiX, FiSearch, FiUser, FiX as FiClear } from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TournamentSidebar() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tournRes, allTeams, allPlayers] = await Promise.all([
          publicService.getTournaments({ limit: 50 }),
          publicService.getAllTeams(),
          publicService.getAllPlayers(),
        ]);
        setTournaments(tournRes.tournaments);
        setTeams(allTeams);
        setPlayers(allPlayers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const statusDot: Record<string, string> = {
    ACTIVE: "bg-emerald-500",
    FINISHED: "bg-blue-500",
    INACTIVE: "bg-slate-600",
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: "მიმდინარე",
    FINISHED: "დასრულებული",
    INACTIVE: "არააქტიური",
  };

  const q = search.toLowerCase().trim();
  const isSearching = q.length > 0;

  // ── Search results ──
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

  // ── Group tournaments by status (when not searching) ──
  const active = filteredTournaments.filter((t) => t.status === "ACTIVE");
  const finished = filteredTournaments.filter((t) => t.status === "FINISHED");
  const inactive = filteredTournaments.filter((t) => t.status === "INACTIVE");

  // ── Components ──
  const TournamentItem = ({ t, idx = 0 }: { t: any; idx?: number }) => {
    const isActive = pathname === `/tournaments/${t.id}` || pathname.startsWith(`/tournaments/${t.id}/`);
    return (
      <Link
        key={t.id}
        href={`/tournaments/${t.id}`}
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
          {t.logoUrl ? (
            <img src={t.logoUrl} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <GiTrophy size={16} className={isActive ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400 transition-colors"} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate ${isActive ? "text-emerald-400" : "group-hover:text-white"}`}>
            {t.name}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[t.status] || statusDot.INACTIVE}`} />
            {t.ageCategories?.[0] || "U-??"} • {t.teamCount} გუნდი
          </div>
        </div>
        {isActive && <FiChevronRight size={14} className="text-emerald-500 shrink-0" />}
      </Link>
    );
  };

  const TeamItem = ({ t, idx = 0 }: { t: any; idx?: number }) => (
    <Link
      href={`/teams/${t.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/4 border border-transparent transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
        {t.logoUrl ? (
          <img src={t.logoUrl} alt="" className="w-6 h-6 object-contain" />
        ) : (
          <GiShield size={16} className="text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate group-hover:text-white">{t.name}</div>
        <div className="text-[10px] text-slate-500">{t.city || "გუნდი"}</div>
      </div>
    </Link>
  );

  const PlayerItem = ({ p, idx = 0 }: { p: any; idx?: number }) => (
    <Link
      href={`/players/${p.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/4 border border-transparent transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0 overflow-hidden">
        {p.photoUrl ? (
          <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <FiUser size={16} className="text-purple-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate group-hover:text-white">{p.name}</div>
        <div className="text-[10px] text-slate-500">{p.teamName || "მოთამაშე"} • {p.position}</div>
      </div>
    </Link>
  );

  const SectionHeader = ({ label, count, color = "slate" }: { label: string; count: number; color?: string }) => (
    <div className="flex items-center gap-2 px-3 pt-4 pb-2">
      <span className={`text-[10px] font-bold text-${color}-500 uppercase tracking-[0.15em]`}>{label}</span>
      <span className="text-[10px] font-bold text-slate-700 bg-white/3 px-1.5 py-0.5 rounded">{count}</span>
    </div>
  );

  const noResults = isSearching && filteredTournaments.length === 0 && filteredTeams.length === 0 && filteredPlayers.length === 0;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white hover:bg-emerald-400 transition-colors active:scale-95"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#0a1228]/98 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:static lg:h-[calc(100vh-80px)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full overflow-y-auto p-4 flex flex-col">
          {/* Header */}
          <div className="mb-4 px-3 pt-2">
            <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiSearch className="text-emerald-500" size={12} />
              ძებნა
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-4 px-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input
              type="text"
              placeholder="ტურნირი, გუნდი, მოთამაშე..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/3 border border-white/5 focus:border-emerald-500/30 text-white text-sm pl-9 pr-8 py-2.5 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-600 focus:bg-white/5"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <FiClear size={14} />
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
                      {filteredTournaments.map((t, idx) => <TournamentItem key={t.id} t={t} idx={idx} />)}
                    </>
                  )}
                  {filteredTeams.length > 0 && (
                    <>
                      <SectionHeader label="გუნდები" count={filteredTeams.length} color="blue" />
                      {filteredTeams.slice(0, 8).map((t, idx) => <TeamItem key={t.id} t={t} idx={idx} />)}
                    </>
                  )}
                  {filteredPlayers.length > 0 && (
                    <>
                      <SectionHeader label="მოთამაშეები" count={filteredPlayers.length} color="purple" />
                      {filteredPlayers.slice(0, 8).map((p, idx) => <PlayerItem key={p.id} p={p} idx={idx} />)}
                    </>
                  )}
                </>
              ) : (
                /* ── Default: tournaments grouped by status ── */
                <>
                  {active.length > 0 && (
                    <>
                      <SectionHeader label={statusLabel.ACTIVE} count={active.length} color="emerald" />
                      {active.map((t, idx) => <TournamentItem key={t.id} t={t} idx={idx} />)}
                    </>
                  )}
                  {finished.length > 0 && (
                    <>
                      <SectionHeader label={statusLabel.FINISHED} count={finished.length} color="blue" />
                      {finished.map((t, idx) => <TournamentItem key={t.id} t={t} idx={idx} />)}
                    </>
                  )}
                  {inactive.length > 0 && (
                    <>
                      <SectionHeader label={statusLabel.INACTIVE} count={inactive.length} />
                      {inactive.map((t, idx) => <TournamentItem key={t.id} t={t} idx={idx} />)}
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
