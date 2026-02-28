import Link from "next/link";
import { publicService } from "@/services/public.service";
import { FiUser } from "react-icons/fi";
import { GiSoccerBall, GiRunningShoe, GiShield } from "react-icons/gi";
import TopPerformers from "@/app/components/public/landing/TopPerformers";
import PlayerFilters from "./PlayerFilters";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; position?: string }>;
}) {
  const { search, position } = await searchParams;
  const searchLower = search?.toLowerCase() || "";
  const posFilter = position || "ყველა";

  let players: any[] = [];
  try {
    players = await publicService.getAllPlayers();
  } catch (error) {
    console.error("Failed to fetch players:", error);
  }

  const filtered = players.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.teamName?.toLowerCase().includes(searchLower);
    const matchPos = posFilter === "ყველა" || p.position === posFilter;
    return matchSearch && matchPos;
  });

  const sorted = [...filtered].sort(
    (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
  );

  return (
    <div>
      {/* ═══ TOP PLAYERS (reused from landing) ═══ */}
      <TopPerformers />

      {/* ═══ ALL PLAYERS ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 py-10 min-h-[50vh]">
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
          ყველა <span className="text-(--emerald-glow)">მოთამაშე</span>
        </h2>
        <p className="text-(--text-secondary) text-sm mb-8">
          მოძებნე და გაფილტრე მოთამაშეები პოზიციის მიხედვით
        </p>

        {/* Client Component for filtering via URL */}
        <PlayerFilters />

        <div className="text-xs text-(--text-secondary) mb-6 font-semibold uppercase tracking-wider">
          {sorted.length} მოთამაშე ნაპოვნია
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((player, idx) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="group glass-card rounded-2xl p-5 flex items-stretch gap-4 animate-reveal-up hover:border-emerald-400/40 hover:-translate-y-1 transition-all duration-300 bg-[#030303]"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="relative shrink-0">
                {player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-emerald-400/60 transition-all duration-300 shadow-md shadow-black/40"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:border-emerald-400/40 transition-all duration-300 shadow-inner">
                    <FiUser size={22} className="text-white/30" />
                  </div>
                )}
                {player.shirtNumber && (
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-black text-black shadow-lg shadow-emerald-900/40">
                    #{player.shirtNumber}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {player.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-(--text-secondary)">
                        {player.position || "პოზიცია მითითებული არ არის"}
                      </span>
                      {player.teamName && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/70 truncate max-w-[120px]">
                          {player.teamName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <GiSoccerBall className="text-emerald-400" size={11} />
                    <span className="font-semibold tabular-nums">
                      {player.stats?.goals || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-white/40">
                      გოლი
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <GiRunningShoe className="text-blue-400" size={11} />
                    <span className="font-semibold tabular-nums">
                      {player.stats?.assists || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-white/40">
                      ასისტი
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <GiShield className="text-violet-400" size={11} />
                    <span className="font-semibold tabular-nums">
                      {player.stats?.matches || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-white/40">
                      მატჩი
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 bg-[#030303] rounded-3xl border border-white/5">
            <FiUser size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-(--text-secondary) text-sm">
              მოთამაშე ვერ მოიძებნა ამ კრიტერიუმებით
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
