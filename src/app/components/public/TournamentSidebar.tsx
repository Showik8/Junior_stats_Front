"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicService } from "@/services/public.service";
import { GiTrophy } from "react-icons/gi";
import { FiChevronRight, FiMenu, FiX } from "react-icons/fi";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function TournamentSidebar() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await publicService.getTournaments({ limit: 50 });
        setTournaments(res.tournaments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const statusDot: Record<string, string> = {
    ACTIVE: "bg-emerald-500",
    FINISHED: "bg-blue-500",
    INACTIVE: "bg-slate-600",
  };

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
        <div className="h-full overflow-y-auto p-4">
          {/* Header */}
          <div className="mb-6 px-3 pt-2">
            <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <GiTrophy className="text-emerald-500" size={14} />
              ტურნირები
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-white/3 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {tournaments.map((t, idx) => {
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
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/50" />
                    )}

                    {/* Logo */}
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

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${isActive ? "text-emerald-400" : "group-hover:text-white"}`}>
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[t.status] || statusDot.INACTIVE}`} />
                        {t.ageCategories?.[0] || 'U-??'} • {t.teamCount} გუნდი
                      </div>
                    </div>

                    {isActive && <FiChevronRight size={14} className="text-emerald-500 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
