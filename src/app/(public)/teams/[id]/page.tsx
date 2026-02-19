"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser, FiChevronRight, FiGrid, FiUsers, FiClock, FiBarChart2, FiArrowLeft } from "react-icons/fi";
import { GiSoccerBall, GiWhistle, GiShield, GiRunningShoe } from "react-icons/gi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TeamDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-white/5 border-t-emerald-500 rounded-full animate-spin" />
          <GiShield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={20} />
        </div>
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

  const tabs = [
    { id: "overview", label: "მიმოხილვა", icon: FiGrid },
    { id: "squad", label: "შემადგენლობა", icon: FiUsers },
    { id: "matches", label: "მატჩები", icon: FiClock },
    { id: "stats", label: "სტატისტიკა", icon: FiBarChart2 },
  ];

  const MatchItem = ({ match, delay = 0 }: { match: any; delay?: number }) => {
    const isHome = match.homeTeam.id === data.id;
    const opponent = isHome ? match.awayTeam : match.homeTeam;

    let resultColor = "bg-slate-700/50 text-slate-400";
    let resultText = "VS";

    if (match.status === "FINISHED") {
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const oppScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > oppScore) {
        resultColor = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
        resultText = "W";
      } else if (teamScore < oppScore) {
        resultColor = "bg-red-500/20 text-red-400 border border-red-500/30";
        resultText = "L";
      } else {
        resultColor = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
        resultText = "D";
      }
    }

    return (
      <Link
        href={`/matches/${match.id}`}
        className="group flex items-center p-4 glass-card rounded-xl hover:transform-none! mb-3 transition-all animate-reveal-up"
        style={{ animationDelay: `${delay}ms` }}
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
            <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors">{opponent.name}</div>
            <div className="text-slate-600 text-xs">
              {isHome ? "(შინ)" : "(გასვლა)"} • {match.tournament?.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {match.status === "FINISHED" ? (
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${resultColor} flex items-center justify-center text-[11px] font-black`}>
                {resultText}
              </div>
              <div className="text-white font-extrabold text-base min-w-[45px] text-right tabular-nums">
                {match.homeScore} - {match.awayScore}
              </div>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-500 text-xs font-semibold border border-white/5">
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
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[200px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto flex items-center gap-8 flex-wrap animate-fade-in-up">
          {/* Logo */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-[120px] h-[120px] rounded-full bg-[#0a1228] border-4 border-white/8 flex items-center justify-center overflow-hidden shadow-2xl shadow-black/30">
              {data.logo ? (
                <img src={data.logo} alt="" className="w-[80%] h-[80%] object-contain" />
              ) : (
                <GiShield size={48} className="text-blue-500/50" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex gap-3 mb-2 items-center flex-wrap">
              <span className="text-slate-500 text-sm font-semibold">{data.ageCategory}</span>
              {data.stats.winRate > 0 && (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
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

        {/* Tabs */}
        <div className="flex gap-1 mb-10 overflow-x-auto pb-1 border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-t-lg transition-all duration-300 whitespace-nowrap border-b-2
                ${activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/3"
                }
              `}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

          {/* LEFT (Dynamic based on Tab) */}
          <div className="flex flex-col gap-10">

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "მოგება", value: data.stats.wins, color: "emerald" },
                    { label: "ფრე", value: data.stats.draws, color: "amber" },
                    { label: "წაგება", value: data.stats.losses, color: "red" },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      className={`rounded-2xl p-5 text-center bg-${s.color}-500/8 border border-${s.color}-500/15 animate-reveal-up`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className={`text-${s.color}-400 text-3xl font-extrabold tabular-nums`}>{s.value}</div>
                      <div className={`text-${s.color}-300/70 text-xs font-bold uppercase tracking-wider mt-1`}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Latest Matches */}
                <div className="animate-fade-in-up delay-200">
                  <h3 className="text-lg font-bold text-white mb-4">ბოლო მატჩები</h3>
                  {data.finishedMatches?.length > 0 ? (
                    <div>
                      {data.finishedMatches.slice(0, 3).map((m: any, i: number) => (
                        <MatchItem key={m.id} match={m} delay={300 + i * 80} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-sm">მატჩები არ არის</p>
                  )}
                </div>
              </>
            )}

            {/* SQUAD TAB */}
            {(activeTab === "squad" || activeTab === "overview") && (
              <section className={`${activeTab === 'overview' ? 'animate-fade-in-up delay-400' : 'animate-fade-in'}`}>
                {activeTab === 'overview' && (
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold text-white">შემადგენლობა</h3>
                    <button onClick={() => setActiveTab('squad')} className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors">
                      სრული სია →
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeTab === 'overview' ? data.players.slice(0, 6) : data.players).map((p: any, idx: number) => (
                    <Link href={`/players/${p.id}`} key={p.id} className="group block">
                      <div
                        className="glass-card rounded-xl p-4 flex items-center gap-4 hover:transform-none! animate-reveal-up"
                        style={activeTab === 'squad' ? { animationDelay: `${idx * 60}ms` } : undefined}
                      >
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/8 group-hover:border-emerald-500/30 transition-colors"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-base font-bold text-slate-500 border-2 border-white/5 group-hover:border-emerald-500/20 transition-colors">
                            {p.shirtNumber || <FiUser size={16} />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="text-white text-sm font-semibold truncate group-hover:text-emerald-400 transition-colors">
                              {p.name}
                            </div>
                            {p.shirtNumber && <span className="text-xs font-bold text-slate-600">#{p.shirtNumber}</span>}
                          </div>
                          <div className="text-slate-600 text-xs">
                            {p.position || "—"}
                            {p.age && <span className="opacity-70"> • {p.age} წლის</span>}
                          </div>
                        </div>
                        <FiChevronRight className="text-slate-700 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" size={14} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* MATCHES TAB */}
            {activeTab === "matches" && (
              <div className="flex flex-col gap-8 animate-fade-in">
                <section>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    დაგეგმილი
                  </h3>
                  {data.scheduledMatches?.length > 0 ? (
                    data.scheduledMatches.map((m: any, i: number) => <MatchItem key={m.id} match={m} delay={i * 80} />)
                  ) : <p className="text-slate-600">მატჩები არ არის</p>}
                </section>
                <section>
                  <h3 className="text-lg font-bold text-white mb-4">დასრულებული</h3>
                  {data.finishedMatches?.length > 0 ? (
                    data.finishedMatches.map((m: any, i: number) => <MatchItem key={m.id} match={m} delay={i * 80} />)
                  ) : <p className="text-slate-600">მატჩები არ არის</p>}
                </section>
              </div>
            )}

            {/* STATS TAB */}
            {activeTab === "stats" && (
              <div className="animate-fade-in flex flex-col gap-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "მოგება", value: data.stats.wins, icon: "🏆", color: "emerald" },
                    { label: "წაგება", value: data.stats.losses, icon: "📉", color: "red" },
                    { label: "გატ. გოლი", value: data.stats.goalsFor, icon: "⚽", color: "blue" },
                    { label: "გაშ. გოლი", value: data.stats.goalsAgainst, icon: "🥅", color: "amber" },
                  ].map((s, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 text-center hover:transform-none! animate-reveal-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <div className={`text-3xl font-black text-${s.color}-400 tabular-nums`}>{s.value}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top scorers from team */}
                <div className="glass-card rounded-2xl p-6 hover:transform-none!">
                  <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <GiSoccerBall className="text-amber-400" />
                    ბომბარდირები
                  </h3>
                  <div className="space-y-3">
                    {data.players
                      .filter((p: any) => p.stats?.goals > 0)
                      .sort((a: any, b: any) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
                      .map((p: any, idx: number) => (
                        <Link key={p.id} href={`/players/${p.id}`} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                          <span className={`text-sm font-black w-6 text-center ${idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : "text-slate-600"}`}>
                            {idx + 1}
                          </span>
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/10" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border-2 border-white/5">
                              {p.shirtNumber}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors truncate">{p.name}</div>
                            <div className="text-slate-600 text-xs">{p.position}</div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-emerald-400 font-extrabold">{p.stats?.goals || 0}</div>
                              <div className="text-[9px] text-slate-600 uppercase">გოლი</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400 font-extrabold">{p.stats?.assists || 0}</div>
                              <div className="text-[9px] text-slate-600 uppercase">ასისტი</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (Always visible) */}
          <div className="flex flex-col gap-6">
            {/* Next Match */}
            {data.scheduledMatches && data.scheduledMatches.length > 0 && (
              <div className="rounded-2xl p-6 bg-linear-to-br from-blue-950/60 to-blue-900/20 border border-blue-500/20 animate-slide-in-right">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-5">შემდეგი მატჩი</h3>
                {(() => {
                  const match = data.scheduledMatches[0];
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

            {/* Goal Diff */}
            <div className="glass-card transform-none! rounded-2xl p-5 flex justify-between items-center animate-slide-in-right delay-200">
              <div>
                <div className="text-slate-600 text-xs font-bold uppercase tracking-wider">გატანილი / გაშვებული</div>
                <div className="text-white text-2xl font-extrabold mt-1 tabular-nums">
                  <span className="text-emerald-400">{data.stats.goalsFor}</span>
                  <span className="text-slate-700 mx-2">/</span>
                  <span className="text-red-400">{data.stats.goalsAgainst}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-600 text-xs font-bold uppercase tracking-wider">სხვაობა</div>
                <div className={`text-2xl font-extrabold mt-1 tabular-nums ${
                  data.stats.goalDifference > 0 ? "text-emerald-400" :
                  data.stats.goalDifference < 0 ? "text-red-400" : "text-slate-500"
                }`}>
                  {data.stats.goalDifference > 0 ? "+" : ""}{data.stats.goalDifference}
                </div>
              </div>
            </div>

            {/* Win Rate Circle */}
            <div className="glass-card transform-none! rounded-2xl p-6 text-center animate-slide-in-right delay-300">
              <div className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-4">მოგების პროცენტი</div>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="rgb(16, 185, 129)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${data.stats.winRate * 2.64} ${264 - data.stats.winRate * 2.64}`}
                    className="animate-bar-fill"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white tabular-nums">{data.stats.winRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
