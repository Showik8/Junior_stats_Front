"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { GiSoccerBall, GiTrophy } from "react-icons/gi";
import TeamLogo from "@/app/components/public/shared/TeamLogo";
import { formatFullDate, formatTime, isSameDay } from "@/app/utils/format";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DashboardClient({ allMatches }: { allMatches: any[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // ── Date helpers (using shared utilities, with SSR guard) ──
  const safeDateLabel = (d: Date) => mounted ? formatFullDate(d.toISOString()) : "";
  const safeTimeLabel = (dateStr: string) => mounted ? formatTime(dateStr) : "";

  // ── Calendar logic ──
  const [calMonth, setCalMonth] = useState(selectedDate.getMonth());
  const [calYear, setCalYear] = useState(selectedDate.getFullYear());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon start
    const days: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [calMonth, calYear]);

  const monthLabel = mounted
    ? new Date(calYear, calMonth).toLocaleDateString("ka-GE", { month: "long", year: "numeric" })
    : "";

  // Dates that have matches
  const matchDates = useMemo(() => {
    const set = new Set<string>();
    allMatches.forEach((m) => {
      const d = new Date(m.date);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return set;
  }, [allMatches]);

  const hasMatches = (day: number) => matchDates.has(`${calYear}-${calMonth}-${day}`);

  // ── Filter matches by selected date ──
  const todayMatches = useMemo(
    () => allMatches.filter((m) => isSameDay(new Date(m.date), selectedDate)),
    [allMatches, selectedDate]
  );

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <div className="relative z-10 px-6 lg:px-10 py-10 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <GiSoccerBall className="text-emerald-400 animate-spin-slow" size={22} />
            <span className="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">
              ახალგაზრდული ფეხბურთი
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            დღის მატჩები
          </h1>
          <p className="text-base text-slate-400 mt-3">
             {mounted ? safeDateLabel(selectedDate) : <span className="opacity-0">Loading...</span>}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT: Matches ── */}
          <div className="flex-1 animate-fade-in-up delay-100">
            {todayMatches.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-white/10">
                <GiSoccerBall size={48} className="text-slate-700 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-slate-500 mb-2">
                  მატჩები არ არის
                </h2>
                <p className="text-sm text-slate-600">
                  ამ თარიღზე დაგეგმილი მატჩი არ არის. აირჩიე სხვა თარიღი კალენდარიდან.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayMatches.map((match, idx) => (
                  <Link
                    key={match.id}
                    href={`/matches/${match.id}`}
                    className="group block glass-card rounded-2xl p-5 animate-reveal-up hover:border-emerald-500/20 transition-all duration-300"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    {/* Tournament badge */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3 md:pb-0 md:mb-4 md:border-0">
                      <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-0 pr-2">
                        <GiTrophy size={14} className="text-amber-400/60 shrink-0" />
                        <span className="truncate">{match.tournament?.name || "ტურნირი"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-slate-600 shrink-0">
                        <FiClock size={12} />
                        {safeTimeLabel(match.date)}
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center gap-2 md:gap-4 w-full">
                      {/* Home */}
                      <div className="flex-1 min-w-0 flex items-center gap-2 md:gap-3 justify-end text-right">
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] md:text-sm font-bold text-white truncate whitespace-nowrap block group-hover:text-emerald-400 transition-colors">
                            {match.homeTeam?.name || "Home"}
                          </div>
                        </div>
                        <div className="shrink-0 md:w-auto flex justify-center">
                          <TeamLogo src={match.homeTeam?.logoUrl || match.homeTeam?.logo} alt={match.homeTeam?.name} size="md" />
                        </div>
                      </div>

                      {/* Score / VS */}
                      <div className="shrink-0 px-2 md:px-4">
                        {match.status === "FINISHED" ? (
                           <div className="px-2 md:px-4 py-1 bg-black/30 rounded-lg min-w-[65px] md:min-w-[80px] text-center border shadow-inner border-white/10">
                            <span className="font-black text-sm md:text-lg tracking-wider text-white">
                               {match.homeScore}-{match.awayScore}
                            </span>
                          </div>
                        ) : (
                          <div className="px-3 md:px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] md:text-xs font-bold text-emerald-400">VS</span>
                          </div>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex-1 min-w-0 flex items-center gap-2 md:gap-3">
                        <div className="shrink-0 md:w-auto flex justify-center">
                          <TeamLogo src={match.awayTeam?.logoUrl || match.awayTeam?.logo} alt={match.awayTeam?.name} size="md" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] md:text-sm font-bold text-white truncate whitespace-nowrap block group-hover:text-emerald-400 transition-colors text-left">
                            {match.awayTeam?.name || "Away"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="mt-3 flex justify-center">
                      {match.status === "FINISHED" ? (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/15">
                          დასრულებული
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          დაგეგმილი
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Calendar ── */}
          <div className="w-full sm:max-w-[340px] lg:w-[340px] mx-auto lg:mx-0 shrink-0 animate-fade-in-up delay-300">
            <div className="glass-card rounded-2xl p-5 sticky top-28">
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  aria-label="წინა თვე"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-white capitalize">{monthLabel}</span>
                <button
                  onClick={nextMonth}
                  aria-label="შემდეგი თვე"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["ორ", "სა", "ოთ", "ხუ", "პა", "შა", "კვ"].map((d) => (
                  <div key={d} className="text-[10px] font-bold text-slate-600 text-center uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;

                  const dateObj = new Date(calYear, calMonth, day);
                  const isToday = isSameDay(dateObj, new Date());
                  const isSelected = isSameDay(dateObj, selectedDate);
                  const hasMatch = hasMatches(day);

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateObj)}
                      aria-label={`${day} ${monthLabel}`}
                      className={`
                        relative w-full aspect-square rounded-lg text-sm font-semibold transition-all duration-200
                        ${isSelected
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                          : isToday
                            ? "bg-white/8 text-emerald-400 border border-emerald-500/30"
                            : hasMatch
                              ? "text-white hover:bg-white/8"
                              : "text-slate-600 hover:text-slate-400 hover:bg-white/3"
                        }
                      `}
                    >
                      {day}
                      {hasMatch && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-5 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>მატჩის დღე</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded border border-emerald-500/30" />
                  <span>დღეს</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
