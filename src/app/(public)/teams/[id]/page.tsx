"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiChevronRight } from "react-icons/fi";
import { GiSoccerBall, GiWhistle, GiShield } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TeamDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTeam = async () => {
      try {
        const res = await publicService.getTeamDetail(id as string);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
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
        <GiShield size={64} className="text-slate-800 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-3">გუნდი არ მოიძებნა</h2>
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

  const MatchItem = ({ match }: { match: any }) => {
    const isHome = match.homeTeam.id === data.id;
    const opponent = isHome ? match.awayTeam : match.homeTeam;

    let resultColor = "bg-slate-700 text-slate-300";
    let resultText = "VS";

    if (match.status === "FINISHED") {
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const oppScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > oppScore) {
        resultColor = "bg-emerald-500 text-white";
        resultText = "W";
      } else if (teamScore < oppScore) {
        resultColor = "bg-red-500 text-white";
        resultText = "L";
      } else {
        resultColor = "bg-amber-500 text-white";
        resultText = "D";
      }
    }

    return (
      <Link
        href={`/matches/${match.id}`}
        className="group flex items-center p-4 glass-card rounded-xl hover:transform-none! mb-3"
      >
        <div className="w-[60px] text-center text-xs text-slate-500">
          <div className="font-semibold">{formatDate(match.date)}</div>
          <div className="text-[11px] opacity-70">
            {new Date(match.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
          {opponent.logo ? (
            <img src={opponent.logo} alt="" className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <GiShield size={14} className="text-slate-600" />
            </div>
          )}
          <div>
            <div className="text-white text-sm font-semibold">{opponent.name}</div>
            <div className="text-slate-600 text-xs">
              {isHome ? "(შინ)" : "(გასვლა)"} • {match.tournament?.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {match.status === "FINISHED" ? (
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md ${resultColor} flex items-center justify-center text-[11px] font-bold`}>
                {resultText}
              </div>
              <div className="text-white font-extrabold text-base min-w-[45px] text-right">
                {match.homeScore} - {match.awayScore}
              </div>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-500 text-xs font-semibold">
              {match.status}
            </span>
          )}
          <FiChevronRight className="text-slate-700 group-hover:text-emerald-400 transition-colors" size={16} />
        </div>
      </Link>
    );
  };

  return (
    <div>
      {/* ──────────── HEADER ──────────── */}
      <div className="relative py-16 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-[20%] w-[400px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto flex items-center gap-8 flex-wrap animate-fade-in-up">
          {/* Logo */}
          <div className="w-[120px] h-[120px] rounded-full bg-[#0a1228] border-4 border-white/8 flex items-center justify-center overflow-hidden shadow-2xl shadow-black/30">
            {data.logo ? (
              <img src={data.logo} alt="" className="w-[80%] h-[80%] object-contain" />
            ) : (
              <GiShield size={48} className="text-blue-500/50" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex gap-3 mb-2 items-center flex-wrap">
              <span className="text-slate-500 text-sm font-semibold">{data.ageCategory}</span>
              {data.stats.winRate > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {data.stats.winRate}% მოგება
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
              {data.name}
            </h1>

            <div className="flex gap-6 flex-wrap items-center text-sm">
              {data.coach && (
                <div className="flex items-center gap-2 text-slate-300">
                  <GiWhistle size={16} className="text-emerald-500" />
                  <span>მწვრთნელი: <b>{data.coach}</b></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400">
                <FiUser size={14} />
                {data.stats.totalPlayers} მოთამაშე
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── CONTENT ──────────── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

          {/* LEFT */}
          <div className="flex flex-col gap-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 animate-fade-in-up">
              <div className="rounded-2xl p-5 text-center bg-emerald-500/8 border border-emerald-500/15">
                <div className="text-emerald-400 text-3xl font-extrabold">{data.stats.wins}</div>
                <div className="text-emerald-300/70 text-xs font-bold uppercase tracking-wider mt-1">მოგება</div>
              </div>
              <div className="rounded-2xl p-5 text-center bg-amber-500/8 border border-amber-500/15">
                <div className="text-amber-400 text-3xl font-extrabold">{data.stats.draws}</div>
                <div className="text-amber-300/70 text-xs font-bold uppercase tracking-wider mt-1">ფრე</div>
              </div>
              <div className="rounded-2xl p-5 text-center bg-red-500/8 border border-red-500/15">
                <div className="text-red-400 text-3xl font-extrabold">{data.stats.losses}</div>
                <div className="text-red-300/70 text-xs font-bold uppercase tracking-wider mt-1">წაგება</div>
              </div>
            </div>

            {/* Squad */}
            <section className="animate-fade-in-up delay-200">
              <h3 className="text-xl font-bold text-white mb-5">შემადგენლობა</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.players.map((p: any) => (
                  <Link href={`/players/${p.id}`} key={p.id} className="group block">
                    <div className="glass-card rounded-xl p-4 flex items-center gap-4 hover:transform-none!">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt=""
                          className="w-11 h-11 rounded-full object-cover border-2 border-white/8 group-hover:border-emerald-500/30 transition-colors"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-base font-bold text-slate-500 border-2 border-white/5">
                          {p.shirtNumber || <FiUser size={16} />}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate group-hover:text-emerald-400 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-slate-600 text-xs">
                          {p.position || "—"}
                          {p.age && <span className="opacity-70"> • {p.age} წლის</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">
            {/* Next Match */}
            {data.scheduledMatches && data.scheduledMatches.length > 0 && (
              <div className="rounded-2xl p-6 bg-linear-to-br from-blue-950/60 to-blue-900/20 border border-blue-500/20 animate-fade-in-up">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-5">შემდეგი მატჩი</h3>
                {(() => {
                  const match = data.scheduledMatches[data.scheduledMatches.length - 1];
                  const opponent = match.homeTeam.id === data.id ? match.awayTeam : match.homeTeam;

                  return (
                    <div className="text-center">
                      <div className="flex justify-center items-center gap-6 mb-5">
                        <div className="flex flex-col items-center gap-2">
                          {data.logo ? (
                            <img src={data.logo} alt="" className="w-12 h-12 object-contain" />
                          ) : (
                            <GiShield size={32} className="text-blue-400/50" />
                          )}
                          <span className="text-xs font-bold text-white">{data.name}</span>
                        </div>
                        <span className="text-2xl font-extrabold text-slate-600">VS</span>
                        <div className="flex flex-col items-center gap-2">
                          {opponent.logo ? (
                            <img src={opponent.logo} alt="" className="w-12 h-12 object-contain" />
                          ) : (
                            <GiShield size={32} className="text-blue-400/50" />
                          )}
                          <span className="text-xs font-bold text-white">{opponent.name}</span>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg px-4 py-2.5 inline-flex flex-col gap-1">
                        <span className="text-white font-semibold text-sm">{formatDate(match.date)}</span>
                        <span className="text-slate-500 text-xs">
                          {new Date(match.date).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Latest Matches */}
            <div className="glass-card transform-none! rounded-2xl p-5 animate-fade-in-up delay-100">
              <h3 className="text-base font-bold text-white mb-5">ბოლო მატჩები</h3>
              {data.finishedMatches.length > 0 ? (
                <div>
                  {data.finishedMatches.slice(0, 5).map((m: any) => (
                    <MatchItem key={m.id} match={m} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm">მატჩები არ არის</p>
              )}
            </div>

            {/* Goal Diff */}
            <div className="glass-card transform-none! rounded-2xl p-5 flex justify-between items-center animate-fade-in-up delay-200">
              <div>
                <div className="text-slate-600 text-xs font-bold uppercase tracking-wider">გატანილი / გაშვებული</div>
                <div className="text-white text-2xl font-extrabold mt-1">
                  <span className="text-emerald-400">{data.stats.goalsFor}</span>
                  <span className="text-slate-700 mx-2">/</span>
                  <span className="text-red-400">{data.stats.goalsAgainst}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-600 text-xs font-bold uppercase tracking-wider">სხვაობა</div>
                <div className={`text-2xl font-extrabold mt-1 ${
                  data.stats.goalDifference > 0 ? "text-emerald-400" :
                  data.stats.goalDifference < 0 ? "text-red-400" : "text-slate-500"
                }`}>
                  {data.stats.goalDifference > 0 ? "+" : ""}{data.stats.goalDifference}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
