"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiChevronRight, FiCalendar } from "react-icons/fi";
import { GiSoccerBall, GiShield } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PlayerDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPlayer = async () => {
      try {
        const res = await publicService.getPlayerDetail(id as string);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="w-10 h-10 border-[3px] border-white/10 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <FiUser size={64} className="text-slate-800 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-3">მოთამაშე არ მოიძებნა</h2>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
          ← მთავარზე დაბრუნება
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ka-GE", {
      day: "numeric",
      month: "short",
    });
  };

  const statCards = [
    { label: "გოლი", value: data.stats?.goals ?? 0, color: "emerald", icon: "⚽" },
    { label: "ასისტი", value: data.stats?.assists ?? 0, color: "blue", icon: "👟" },
    { label: "ყვითელი", value: data.stats?.yellowCards ?? 0, color: "amber", icon: "🟨" },
    { label: "წითელი", value: data.stats?.redCards ?? 0, color: "red", icon: "🟥" },
    { label: "მატჩები", value: data.stats?.matchesPlayed ?? 0, color: "slate", icon: "📊" },
    { label: "წუთი", value: data.stats?.minutesPlayed ?? 0, color: "slate", icon: "⏱" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/15 text-blue-400",
    amber: "bg-amber-500/10 border-amber-500/15 text-amber-400",
    red: "bg-red-500/10 border-red-500/15 text-red-400",
    slate: "bg-slate-500/10 border-slate-500/15 text-slate-300",
  };

  return (
    <div>
      {/* ──────────── HEADER ──────────── */}
      <div className="relative py-16 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-[40%] w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto flex items-center gap-8 flex-wrap animate-fade-in-up">
          {/* Photo */}
          <div className="relative">
            <div className="w-[130px] h-[130px] rounded-full overflow-hidden border-4 border-white/8 shadow-2xl shadow-black/40 bg-slate-900">
              {data.photoUrl ? (
                <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
                  <FiUser size={48} className="text-slate-600" />
                </div>
              )}
            </div>
            {data.shirtNumber && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-base font-extrabold shadow-lg shadow-emerald-900/30 border-2 border-emerald-500/50">
                {data.shirtNumber}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex gap-3 mb-2 items-center flex-wrap">
              {data.position && (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {data.position}
                </span>
              )}
              {data.age && (
                <span className="text-slate-500 text-sm">{data.age} წლის</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              {data.name}
            </h1>

            <div className="flex gap-4 flex-wrap items-center">
              {data.team && (
                <Link
                  href={`/teams/${data.team.id}`}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  {data.team.logo ? (
                    <img src={data.team.logo} alt="" className="w-6 h-6 rounded-md object-contain" />
                  ) : (
                    <GiShield size={16} className="text-slate-500" />
                  )}
                  {data.team.name}
                </Link>
              )}
              {data.birthDate && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <FiCalendar size={14} />
                  {new Date(data.birthDate).toLocaleDateString("ka-GE")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── CONTENT ──────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-12 animate-fade-in-up">
          {statCards.map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-5 text-center border ${colorMap[stat.color]}`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider mt-1 opacity-60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Match History */}
        <section className="animate-fade-in-up delay-200">
          <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <GiSoccerBall className="text-emerald-500" size={18} />
            მატჩების ისტორია
          </h3>

          {data.matches && data.matches.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-slate-600 text-xs uppercase tracking-wider text-left border-b border-white/5">
                    <th className="p-3.5">თარიღი</th>
                    <th className="p-3.5">ტურნირი</th>
                    <th className="p-3.5">მოწინააღმდეგე</th>
                    <th className="p-3.5 text-center">ანგარიში</th>
                    <th className="p-3.5 text-center">⚽</th>
                    <th className="p-3.5 text-center">👟</th>
                    <th className="p-3.5 text-center">წუთი</th>
                  </tr>
                </thead>
                <tbody>
                  {data.matches.map((m: any) => {
                    const isHome = m.homeTeam.id === data.team?.id;
                    const opponent = isHome ? m.awayTeam : m.homeTeam;
                    const playerStats = m.playerStats;

                    return (
                      <tr key={m.id} className="border-b border-white/3 hover:bg-white/3 transition-colors group">
                        <td className="p-3.5 text-sm text-slate-500 font-medium">{formatDate(m.date)}</td>
                        <td className="p-3.5 text-sm text-slate-500">{m.tournament?.name || "—"}</td>
                        <td className="p-3.5">
                          <Link
                            href={`/teams/${opponent.id}`}
                            className="flex items-center gap-2 text-sm text-white font-semibold hover:text-emerald-400 transition-colors"
                          >
                            {opponent.logo ? (
                              <img src={opponent.logo} alt="" className="w-6 h-6 rounded object-contain" />
                            ) : (
                              <GiShield size={12} className="text-slate-600" />
                            )}
                            {opponent.name}
                          </Link>
                        </td>
                        <td className="p-3.5 text-center">
                          <Link href={`/matches/${m.id}`} className="text-white font-extrabold text-sm hover:text-emerald-400 transition-colors">
                            {m.homeScore} - {m.awayScore}
                          </Link>
                        </td>
                        <td className="p-3.5 text-center text-emerald-400 font-bold text-sm">{playerStats?.goals || 0}</td>
                        <td className="p-3.5 text-center text-blue-400 font-bold text-sm">{playerStats?.assists || 0}</td>
                        <td className="p-3.5 text-center text-slate-500 text-sm">{playerStats?.minutesPlayed || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="glass-card transform-none! rounded-xl p-8 text-center text-slate-600">
              მატჩების ისტორია არ არის
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
