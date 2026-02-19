"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { GiSoccerBall, GiTrophy } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DashboardPage() {
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matches = await publicService.getAllMatches();
        setAllMatches(matches);
      } catch {
        setAllMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Date helpers ──
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const formatDate = (d: Date) => {
    if (!mounted) return "";
    return d.toLocaleDateString("ka-GE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    if (!mounted) return "";
    return new Date(dateStr).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" });
  };

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

  const monthLabel = new Date(calYear, calMonth).toLocaleDateString("ka-GE", { month: "long", year: "numeric" });

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
            {formatDate(selectedDate)}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT: Matches ── */}
          <div className="flex-1 animate-fade-in-up delay-100">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white/3 border border-white/5 animate-shimmer" />
                ))}
              </div>
            ) : todayMatches.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-white/10">
                <GiSoccerBall size={48} className="text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-500 mb-2">
                  მატჩები არ არის
                </h3>
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <GiTrophy size={12} className="text-amber-400/60" />
                        {match.tournament?.name || "ტურნირი"}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <FiClock size={11} />
                        {formatTime(match.date)}
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center gap-4">
                      {/* Home */}
                      <div className="flex-1 flex items-center gap-3 justify-end text-right">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {match.homeTeam?.name || "Home"}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 overflow-hidden">
                          {match.homeTeam?.logoUrl ? (
                            <img src={match.homeTeam.logoUrl} alt="" className="w-7 h-7 object-contain" />
                          ) : (
                            <span className="text-lg">⚽</span>
                          )}
                        </div>
                      </div>

                      {/* Score / VS */}
                      <div className="shrink-0 px-4">
                        {match.status === "FINISHED" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-white tabular-nums">{match.homeScore}</span>
                            <span className="text-sm font-bold text-slate-600">-</span>
                            <span className="text-2xl font-black text-white tabular-nums">{match.awayScore}</span>
                          </div>
                        ) : (
                          <div className="px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-xs font-bold text-emerald-400">VS</span>
                          </div>
                        )}
                      </div>

                      {/* Away */}
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 overflow-hidden">
                          {match.awayTeam?.logoUrl ? (
                            <img src={match.awayTeam.logoUrl} alt="" className="w-7 h-7 object-contain" />
                          ) : (
                            <span className="text-lg">⚽</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
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
          <div className="lg:w-[340px] shrink-0 animate-fade-in-up delay-300">
            <div className="glass-card rounded-2xl p-5 sticky top-28">
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-white capitalize">{monthLabel}</span>
                <button
                  onClick={nextMonth}
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
