"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { FiX, FiSearch, FiChevronDown } from "react-icons/fi";
import { GiShield, GiSoccerBall } from "react-icons/gi";
import Image from "next/image";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  teams: any[];
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
        <span className={`w-10 text-right text-sm font-black tabular-nums ${aWins ? "text-emerald-400" : "text-white/40"}`}>
          {valueA}
        </span>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden rotate-180">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${aWins ? "bg-emerald-500" : "bg-white/15"}`}
            style={{ width: `${pctA}%` }}
          />
        </div>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${bWins ? "bg-emerald-500" : "bg-white/15"}`}
            style={{ width: `${pctB}%` }}
          />
        </div>
        <span className={`w-10 text-left text-sm font-black tabular-nums ${bWins ? "text-emerald-400" : "text-white/40"}`}>
          {valueB}
        </span>
      </div>
    </div>
  );
}

function TeamSelector({ teams, selected, onSelect, label }: {
  teams: any[];
  selected: any | null;
  onSelect: (t: any) => void;
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
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter(
      (t) => t.name.toLowerCase().includes(q) || t.coach?.toLowerCase().includes(q)
    );
  }, [teams, search]);

  return (
    <div className="relative" ref={ref}>
      <div className="text-[9px] text-white/20 uppercase tracking-widest font-bold mb-2">{label}</div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors text-left"
      >
        {selected ? (
          <>
            <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {selected.logo ? (
                <div className="relative w-6 h-6">
                  <Image src={selected.logo} alt="" fill unoptimized className="object-contain" />
                </div>
              ) : (
                <GiShield size={14} className="text-white/20" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{selected.name}</div>
              <div className="text-[10px] text-white/30 truncate">{selected.ageCategory?.replace("_", "-") || "—"}</div>
            </div>
          </>
        ) : (
          <span className="text-white/30 text-sm">აირჩიე გუნდი...</span>
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
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => { onSelect(t); setOpen(false); setSearch(""); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {t.logo ? (
                    <div className="relative w-5 h-5">
                      <Image src={t.logo} alt="" fill unoptimized className="object-contain" />
                    </div>
                  ) : (
                    <GiShield size={12} className="text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{t.name}</div>
                  <div className="text-[9px] text-white/30 truncate">{t.ageCategory?.replace("_", "-")} • {t.coach || "—"}</div>
                </div>
                <div className="text-[10px] text-emerald-400/60 font-bold tabular-nums">{t.stats?.points || 0} pts</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-6 text-center text-white/20 text-xs">გუნდი ვერ მოიძებნა</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamCompareModal({ teams, onClose }: Props) {
  const [teamA, setTeamA] = useState<any | null>(null);
  const [teamB, setTeamB] = useState<any | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const statsA = teamA?.stats || {};
  const statsB = teamB?.stats || {};

  const bothSelected = teamA && teamB;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <GiShield className="text-emerald-500" size={20} />
            <h2 className="text-lg font-black text-white tracking-tight">გუნდების შედარება</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <TeamSelector teams={teams} selected={teamA} onSelect={setTeamA} label="გუნდი A" />
            <TeamSelector teams={teams} selected={teamB} onSelect={setTeamB} label="გუნდი B" />
          </div>

          {bothSelected ? (
            <div className="space-y-3">
              {/* Logos */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                    {teamA.logo ? (
                      <div className="relative w-[70%] h-[70%]">
                        <Image src={teamA.logo} alt="" fill unoptimized className="object-contain" />
                      </div>
                    ) : (
                      <GiShield size={28} className="text-white/10" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">{teamA.name}</span>
                </div>
                <div className="text-white/10 font-black text-2xl">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                    {teamB.logo ? (
                      <div className="relative w-[70%] h-[70%]">
                        <Image src={teamB.logo} alt="" fill unoptimized className="object-contain" />
                      </div>
                    ) : (
                      <GiShield size={28} className="text-white/10" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">{teamB.name}</span>
                </div>
              </div>

              {/* Stat Bars */}
              <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
                <StatBar label="ქულები" valueA={statsA.points || 0} valueB={statsB.points || 0} />
                <StatBar label="მოგება" valueA={statsA.wins || 0} valueB={statsB.wins || 0} />
                <StatBar label="ფრე" valueA={statsA.draws || 0} valueB={statsB.draws || 0} />
                <StatBar label="წაგება" valueA={statsA.losses || 0} valueB={statsB.losses || 0} />
                <StatBar label="გატანილი გოლი" valueA={statsA.goalsFor || 0} valueB={statsB.goalsFor || 0} />
                <StatBar label="გაშვებული გოლი" valueA={statsA.goalsAgainst || 0} valueB={statsB.goalsAgainst || 0} />
              </div>

              {/* Extra info */}
              <div className="bg-white/2 border border-white/5 rounded-2xl p-5">
                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-center mb-3">დეტალები</div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "კატეგორია", a: teamA.ageCategory?.replace("_", "-") || "—", b: teamB.ageCategory?.replace("_", "-") || "—" },
                    { label: "მწვრთნელი", a: teamA.coach || "—", b: teamB.coach || "—" },
                    { label: "გოლ. სხვაობა", a: `${(statsA.goalsFor || 0) - (statsA.goalsAgainst || 0)}`, b: `${(statsB.goalsFor || 0) - (statsB.goalsAgainst || 0)}` },
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
              <GiShield size={48} className="text-white/5 mx-auto mb-4" />
              <p className="text-white/20 text-sm font-bold">აირჩიე ორი გუნდი შედარებისთვის</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
