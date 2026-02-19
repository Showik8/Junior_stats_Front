"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import {
  FiCalendar,
  FiMapPin,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { GiSoccerBall, GiTrophy } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function HomePage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await publicService.getTournaments({
          page,
          limit: 9,
          search: search || undefined,
          status: statusFilter || undefined,
        });
        setTournaments(res.tournaments);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      } catch {
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [page, search, statusFilter]);

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("ka-GE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusConfig: Record<
    string,
    { bg: string; text: string; dot: string; label: string; border: string }
  > = {
    ACTIVE: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      dot: "bg-emerald-500",
      label: "მიმდინარე",
      border: "border-emerald-500/20",
    },
    FINISHED: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      dot: "bg-blue-500",
      label: "დასრულებული",
      border: "border-blue-500/20",
    },
    INACTIVE: {
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      dot: "bg-slate-500",
      label: "არააქტიური",
      border: "border-slate-500/20",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      {/* ──────────── HERO SECTION ──────────── */}
      <div className="relative pt-20 pb-16 text-center overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-[15%] w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-32 left-[10%] w-[200px] h-[200px] bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Floating football icons */}
        <div className="absolute top-16 left-[15%] animate-float opacity-10">
          <GiSoccerBall size={48} className="text-emerald-400" />
        </div>
        <div className="absolute top-40 right-[12%] animate-float opacity-5" style={{ animationDelay: "2s" }}>
          <GiTrophy size={40} className="text-amber-400" />
        </div>
        <div className="absolute bottom-8 left-[25%] animate-float opacity-5" style={{ animationDelay: "4s" }}>
          <GiSoccerBall size={32} className="text-blue-400" />
        </div>

        <div className="relative z-10">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-900/25 border border-emerald-500/20 mb-8 backdrop-blur-sm">
            <GiSoccerBall className="text-emerald-400 animate-spin-slow" size={14} />
            <span className="text-xs font-bold text-emerald-400 tracking-[0.15em] uppercase">
              ახალგაზრდული ფეხბურთი
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight text-gradient-hero leading-[0.9]">
            ტურნირები
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200 text-base md:text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
            აღმოაჩინე ახალგაზრდული ფეხბურთის ტურნირები, გუნდები და მომავალი ვარსკვლავები.
          </p>

          {/* Stats ribbon */}
          {total > 0 && (
            <div className="animate-fade-in-up delay-300 mt-8 inline-flex items-center gap-6 px-6 py-2.5 rounded-full bg-white/3 border border-white/5">
              <div className="text-center">
                <div className="text-lg font-extrabold text-white">{total}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ტურნირი</div>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="text-center">
                <div className="text-lg font-extrabold text-emerald-400">LIVE</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">პლატფორმა</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ──────────── FILTERS ──────────── */}
      <div className="animate-scale-in delay-300 glass rounded-2xl p-2.5 mb-12 flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
          <input
            type="text"
            placeholder="ტურნირის ძებნა..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/3 border border-transparent focus:border-emerald-500/30 text-white pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-300 placeholder:text-slate-600 focus:bg-white/5 focus:shadow-lg focus:shadow-emerald-900/10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 bg-white/3 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {["", "ACTIVE", "FINISHED", "INACTIVE"].map((s) => {
            const label = s === "" ? "ყველა" : statusConfig[s]?.label;
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`
                  px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap
                  ${isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────── CONTENT GRID ──────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[340px] rounded-2xl bg-white/3 border border-white/5 overflow-hidden"
            >
              <div className="h-full animate-shimmer" />
            </div>
          ))}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div className="relative mb-6">
            <GiTrophy size={72} className="text-slate-800" />
            <div className="absolute inset-0 bg-slate-700/20 blur-2xl rounded-full" />
          </div>
          <p className="text-lg font-semibold text-slate-500 mb-2">
            ტურნირები ვერ მოიძებნა
          </p>
          <p className="text-sm text-slate-600">
            სცადეთ ძებნის პარამეტრების შეცვლა
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t, idx) => {
              const config = statusConfig[t.status] || statusConfig.INACTIVE;
              return (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className="group block relative animate-reveal-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Hover glow */}
                  <div className="absolute -inset-1 bg-linear-to-br from-emerald-500/20 via-transparent to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  <div className="relative h-full glass-card rounded-2xl p-6 overflow-hidden">
                    {/* Decorative corner gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

                    {/* Header: Status & Location */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-2.5 py-1 rounded-full ${config.border} border flex items-center gap-1.5 ${config.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
                        <span className={`text-[10px] font-bold tracking-wider uppercase ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                      {t.location && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium bg-white/3 px-2.5 py-1 rounded-lg">
                          <FiMapPin size={10} />
                          {t.location}
                        </div>
                      )}
                    </div>

                    {/* Logo & Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-700/50 to-slate-800/80 p-0.5 shadow-lg group-hover:shadow-emerald-900/20 transition-all duration-500">
                          <div className="w-full h-full rounded-[14px] bg-slate-900/80 flex items-center justify-center overflow-hidden border border-white/5">
                            {t.logoUrl ? (
                              <img src={t.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <GiTrophy className="text-emerald-500/40 group-hover:text-emerald-500/60 transition-colors" size={28} />
                            )}
                          </div>
                        </div>
                        {/* Logo glow on hover */}
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-emerald-400 transition-colors duration-300">
                          {t.name}
                        </h3>
                        {t.startDate && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <FiCalendar className="text-emerald-600" size={12} />
                            <span>{formatDate(t.startDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                      <div className="bg-slate-900/40 p-3.5 text-center group-hover:bg-slate-800/40 transition-colors duration-300">
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">
                          გუნდები
                        </div>
                        <div className="text-xl font-extrabold text-white tabular-nums">
                          {t.teamCount}
                        </div>
                      </div>
                      <div className="bg-slate-900/40 p-3.5 text-center group-hover:bg-slate-800/40 transition-colors duration-300">
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">
                          მატჩები
                        </div>
                        <div className="text-xl font-extrabold text-white tabular-nums">
                          {t.matchCount}
                        </div>
                      </div>
                      <div className="bg-slate-900/40 p-3.5 text-center group-hover:bg-slate-800/40 transition-colors duration-300">
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">
                          ასაკი
                        </div>
                        <div className="text-sm font-bold text-emerald-400 pt-0.5">
                          {t.ageCategories?.[0] || "U-??"}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {t.description && (
                      <p className="mt-4 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    )}

                    {/* Arrow indicator */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <FiChevronRight className="text-emerald-400" size={18} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 animate-fade-in">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-11 h-11 rounded-xl border border-white/8 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:border-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <FiChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1 px-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`
                      w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-300
                      ${page === p
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                        : "text-slate-500 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-11 h-11 rounded-xl border border-white/8 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:border-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
