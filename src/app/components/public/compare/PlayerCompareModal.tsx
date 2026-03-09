"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { FiX, FiSearch, FiUser, FiChevronDown } from "react-icons/fi";
import { GiSoccerBall } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  players: any[];
  onClose: () => void;
}

function StatBar({ label, valueA, valueB }: { label: string; valueA: number; valueB: number }) {
  const max = Math.max(valueA, valueB, 1);
  const pctA = (valueA / max) * 100;
  const pctB = (valueB / max) * 100;
  const aWins = valueA > valueB;
  const bWins = valueB > valueA;

  return (
    <div className="py-3">
      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest text-center mb-2">{label}</div>
      <div className="flex items-center gap-3">
        {/* Value A */}
        <span className={`w-10 text-right text-sm font-black tabular-nums ${aWins ? "text-emerald-400" : "text-white/40"}`}>
          {valueA}
        </span>
        {/* Bar A (right-to-left) */}
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden rotate-180">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${aWins ? "bg-emerald-500" : "bg-white/15"}`}
            style={{ width: `${pctA}%` }}
          />
        </div>
        {/* Bar B (left-to-right) */}
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${bWins ? "bg-emerald-500" : "bg-white/15"}`}
            style={{ width: `${pctB}%` }}
          />
        </div>
        {/* Value B */}
        <span className={`w-10 text-left text-sm font-black tabular-nums ${bWins ? "text-emerald-400" : "text-white/40"}`}>
          {valueB}
        </span>
      </div>
    </div>
  );
}

function PlayerSelector({ players, selected, onSelect, label }: {
  players: any[];
  selected: any | null;
  onSelect: (p: any) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return players;
    const q = search.toLowerCase();
    return players.filter(
      (p) => p.name.toLowerCase().includes(q) || p.teamName?.toLowerCase().includes(q)
    );
  }, [players, search]);

  return (
    <div className="relative" ref={ref}>
      <div className="text-[9px] text-white/20 uppercase tracking-widest font-bold mb-2">{label}</div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors text-left"
      >
        {selected ? (
          <>
            {selected.photoUrl ? (
              <img src={selected.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <FiUser size={14} className="text-white/30" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{selected.name}</div>
              <div className="text-[10px] text-white/30 truncate">{selected.teamName || "—"}</div>
            </div>
          </>
        ) : (
          <span className="text-white/30 text-sm">აირჩიე მოთამაშე...</span>
        )}
        <FiChevronDown size={14} className={`text-white/20 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[300px] overflow-hidden flex flex-col">
          <div className="p-2 border-b border-white/5">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={12} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ძებნა..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/5 border border-white/5 text-white text-xs placeholder-white/20 focus:outline-none focus:border-emerald-500/30"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p); setOpen(false); setSearch(""); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
                    <FiUser size={12} className="text-white/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{p.name}</div>
                  <div className="text-[9px] text-white/30 truncate">{p.position} • {p.teamName || "—"}</div>
                </div>
                <div className="text-[10px] text-emerald-400/60 font-bold tabular-nums">{p.stats?.goals || 0} ⚽</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-6 text-center text-white/20 text-xs">მოთამაშე ვერ მოიძებნა</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayerCompareModal({ players, onClose }: Props) {
  const [playerA, setPlayerA] = useState<any | null>(null);
  const [playerB, setPlayerB] = useState<any | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const statsA = playerA?.stats || {};
  const statsB = playerB?.stats || {};

  const bothSelected = playerA && playerB;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <GiSoccerBall className="text-emerald-500" size={20} />
            <h2 className="text-lg font-black text-white tracking-tight">მოთამაშეების შედარება</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <PlayerSelector players={players} selected={playerA} onSelect={setPlayerA} label="მოთამაშე A" />
            <PlayerSelector players={players} selected={playerB} onSelect={setPlayerB} label="მოთამაშე B" />
          </div>

          {bothSelected ? (
            <div className="space-y-1">
              {/* Photos */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  {playerA.photoUrl ? (
                    <img src={playerA.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10">
                      <FiUser size={24} className="text-white/30" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">{playerA.name}</span>
                </div>
                <div className="text-white/10 font-black text-2xl">VS</div>
                <div className="flex flex-col items-center gap-2">
                  {playerB.photoUrl ? (
                    <img src={playerB.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10">
                      <FiUser size={24} className="text-white/30" />
                    </div>
                  )}
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">{playerB.name}</span>
                </div>
              </div>

              {/* Stat Bars */}
              <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
                <StatBar label="გოლი" valueA={statsA.goals || 0} valueB={statsB.goals || 0} />
                <StatBar label="ასისტი" valueA={statsA.assists || 0} valueB={statsB.assists || 0} />
                <StatBar label="მატჩი" valueA={statsA.matches || 0} valueB={statsB.matches || 0} />
                <StatBar label="ყვითელი ბარათი" valueA={statsA.yellowCards || 0} valueB={statsB.yellowCards || 0} />
                <StatBar label="წითელი ბარათი" valueA={statsA.redCards || 0} valueB={statsB.redCards || 0} />
              </div>

              {/* Physical comparison */}
              <div className="bg-white/2 border border-white/5 rounded-2xl p-5 mt-3">
                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center mb-3">ფიზიკური მონაცემები</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "სიმაღლე", a: playerA.height ? `${playerA.height} სმ` : "—", b: playerB.height ? `${playerB.height} სმ` : "—" },
                    { label: "წონა", a: playerA.weight ? `${playerA.weight} კგ` : "—", b: playerB.weight ? `${playerB.weight} კგ` : "—" },
                    { label: "ფეხი", a: playerA.preferredFoot || "—", b: playerB.preferredFoot || "—" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-[9px] text-white/20 uppercase tracking-wider font-bold mb-2">{item.label}</div>
                      <div className="flex justify-between px-2">
                        <span className="text-xs font-bold text-white/60">{item.a}</span>
                        <span className="text-xs font-bold text-white/60">{item.b}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <GiSoccerBall size={48} className="text-white/5 mx-auto mb-4" />
              <p className="text-white/20 text-sm font-bold">აირჩიე ორი მოთამაშე შედარებისთვის</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
