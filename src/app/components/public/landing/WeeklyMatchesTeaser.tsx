"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronRight, FaClock } from "react-icons/fa";
import { publicService } from "@/services/public.service";
import moment from "moment";
import "moment/locale/ka"; // For Georgian dates if needed

export default function WeeklyMatchesTeaser() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await publicService.getAllMatches({ limit: 3 });
        setMatches(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching weekly matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <section className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">კვირის <span className="text-(--gold)">მატჩები</span></h2>
            <p className="text-(--text-secondary)">მიმდინარე და მომავალი დაპირისპირებები</p>
          </div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-(--emerald-glow) hover:text-white transition-colors font-medium group"
          >
            ყველა მატჩი 
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--emerald-glow)"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center text-white/50 py-10">ამჟამად მატჩები არ მოიძებნა</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const isLive = match.status === "LIVE" || match.status === "IN_PROGRESS";
              const formattedTime = moment(match.date).format("HH:mm");
              const formattedDate = moment(match.date).format("DD MMM").replace("Nov", "ნოე").replace("Dec", "დეკ").replace("Jan", "იან").replace("Feb", "თებ").replace("Mar", "მარ").replace("Apr", "აპრ").replace("May", "მაი").replace("Jun", "ივნ").replace("Jul", "ივლ").replace("Aug", "აგვ").replace("Sep", "სექ").replace("Oct", "ოქტ");
              const score = match.status === "FINISHED" || isLive 
                ? `${match.homeScore ?? '-'} : ${match.awayScore ?? '-'}`
                : "- : -";

              return (
                <div key={match.id} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                  
                  {/* League & Status Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider">
                       {match.tournament?.name || match.ageCategory?.replace("U_", "U") || "მატჩი"}
                    </span>
                    {isLive ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-500">LIVE</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-(--text-secondary) text-sm">
                        <FaClock className="text-xs" />
                        <span>{formattedTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Match Content */}
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/20 transition-colors overflow-hidden">
                        {match.homeTeam?.logo?.startsWith("http") || match.homeTeam?.logo?.startsWith("/") ? (
                          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{match.homeTeam?.logo || "🛡️"}</span>
                        )}
                      </div>
                      <span className="font-bold text-sm text-center">{match.homeTeam?.name || "უცნობი"}</span>
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center justify-center px-4">
                      <div className={`text-2xl font-black tracking-widest ${isLive ? 'text-(--gold)' : 'text-white'}`}>
                        {score}
                      </div>
                      <span className="text-xs text-(--text-secondary) mt-1">{formattedDate}</span>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/20 transition-colors overflow-hidden">
                        {match.awayTeam?.logo?.startsWith("http") || match.awayTeam?.logo?.startsWith("/") ? (
                          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{match.awayTeam?.logo || "🦅"}</span>
                        )}
                      </div>
                      <span className="font-bold text-sm text-center">{match.awayTeam?.name || "უცნობი"}</span>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
