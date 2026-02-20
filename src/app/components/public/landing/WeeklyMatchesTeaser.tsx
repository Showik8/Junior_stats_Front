import Link from "next/link";
import { FaChevronRight, FaClock } from "react-icons/fa";

// Mock Data - Will be replaced by actual match API fetch
const WEEKLY_MATCHES = [
  {
    id: 1,
    homeTeam: { name: "დინამო თბ", logo: "🛡️" },
    awayTeam: { name: "საბურთალო", logo: "🦅" },
    time: "14:00",
    date: "25 ნოე",
    status: "LIVE",
    score: "2 - 1",
    league: "U17 ელიტ ლიგა"
  },
  {
    id: 2,
    homeTeam: { name: "ლოკომოტივი", logo: "🚂" },
    awayTeam: { name: "ტორპედო", logo: "⚔️" },
    time: "16:30",
    date: "25 ნოე",
    status: "UPCOMING",
    score: "- : -",
    league: "U15 ლიგა 1"
  },
  {
    id: 3,
    homeTeam: { name: "დინამო ბთ", logo: "🌊" },
    awayTeam: { name: "დილა გორი", logo: "🎯" },
    time: "18:00",
    date: "26 ნოე",
    status: "UPCOMING",
    score: "- : -",
    league: "U17 ელიტ ლიგა"
  }
];

export default function WeeklyMatchesTeaser() {
  return (
    <section className="py-20 relative">
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">კვირის <span className="text-[var(--gold)]">მატჩები</span></h2>
            <p className="text-[var(--text-secondary)]">მიმდინარე და მომავალი დაპირისპირებები</p>
          </div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-[var(--emerald-glow)] hover:text-white transition-colors font-medium group"
          >
            ყველა მატჩი 
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEEKLY_MATCHES.map((match) => (
            <div key={match.id} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              
              {/* League & Status Header */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {match.league}
                </span>
                {match.status === "LIVE" ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-red-500">LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-sm">
                    <FaClock className="text-xs" />
                    <span>{match.time}</span>
                  </div>
                )}
              </div>

              {/* Match Content */}
              <div className="flex items-center justify-between">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                    {match.homeTeam.logo}
                  </div>
                  <span className="font-bold text-sm text-center">{match.homeTeam.name}</span>
                </div>

                {/* Score / VS */}
                <div className="flex flex-col items-center justify-center px-4">
                  <div className={`text-2xl font-black tracking-widest ${match.status === 'LIVE' ? 'text-[var(--gold)]' : 'text-white'}`}>
                    {match.score}
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] mt-1">{match.date}</span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                    {match.awayTeam.logo}
                  </div>
                  <span className="font-bold text-sm text-center">{match.awayTeam.name}</span>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
