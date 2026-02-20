"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUserShield, FaTrophy, FaArrowRight } from "react-icons/fa";

const AGE_GROUPS = ["U10", "U12", "U15", "U17"];
const CATEGORIES = [
  { id: "players", label: "საუკეთესო მოთამაშეები", icon: FaUserShield },
  { id: "teams", label: "ტოპ გუნდები", icon: FaTrophy },
];

interface Player {
  id: number;
  name: string;
  position: string;
  stat: string;
  photoUrl?: string;
}

interface Team {
  id: number;
  name: string;
  points: string;
  form: string;
  logo: string;
}

interface AgeGroupData {
  players: Player[];
  teams: Team[];
}

const MOCK_DATA: Record<string, AgeGroupData> = {
  U10: {
    players: [
      { id: 10, name: "ანდრია ჯაველიძე", position: "თავდამსხმელი", stat: "8 გოლი" },
      { id: 11, name: "სანდრო ქუთათელი", position: "ნახევარმცველი", stat: "5 ასისტი" },
      { id: 12, name: "დავით გელაშვილი", position: "მცველი", stat: "3 გადარჩენა" },
    ],
    teams: [
      { id: 10, name: "დინამო U10", points: "28 ქულა", form: "W W D W W", logo: "🛡️" },
      { id: 11, name: "საბურთალო U10", points: "25 ქულა", form: "W D W W L", logo: "🦅" },
      { id: 12, name: "სამტრედია U10", points: "22 ქულა", form: "W W L D W", logo: "🏟️" },
    ],
  },
  U12: {
    players: [
      { id: 20, name: "ლევან ზურაბიშვილი", position: "თავდამსხმელი", stat: "10 გოლი" },
      { id: 21, name: "გიგა ნიკოლაიშვილი", position: "ნახევარმცველი", stat: "7 ასისტი" },
      { id: 22, name: "ბექა ციცქიშვილი", position: "მეკარე", stat: "4 მშრალი მ." },
    ],
    teams: [
      { id: 20, name: "ლოკომოტივი U12", points: "32 ქულა", form: "W W W D W", logo: "🚂" },
      { id: 21, name: "ტორპედო U12", points: "30 ქულა", form: "W W W L W", logo: "⚔️" },
      { id: 22, name: "დილა U12", points: "27 ქულა", form: "D W W W L", logo: "🎯" },
    ],
  },
  U15: {
    players: [
      { id: 1, name: "გიორგი მაისურაძე", position: "თავდამსხმელი", stat: "12 გოლი" },
      { id: 2, name: "ლუკა კაპანაძე", position: "ნახევარმცველი", stat: "8 ასისტი" },
      { id: 3, name: "ნიკოლოზ ბერიძე", position: "მეკარე", stat: "5 მშრალი მ." },
    ],
    teams: [
      { id: 1, name: "დინამო აკადემია", points: "45 ქულა", form: "W W W W D", logo: "🛡️" },
      { id: 2, name: "საბურთალო 1", points: "42 ქულა", form: "W W L W W", logo: "🦅" },
      { id: 3, name: "ლოკომოტივი", points: "38 ქულა", form: "D W W L W", logo: "🚂" },
    ],
  },
  U17: {
    players: [
      { id: 30, name: "თორნიკე ხვიჩია", position: "თავდამსხმელი", stat: "15 გოლი" },
      { id: 31, name: "ირაკლი მამარდაშვილი", position: "ნახევარმცველი", stat: "11 ასისტი" },
      { id: 32, name: "ზურა კვარაცხელია", position: "მცველი", stat: "2 წითელი კ." },
    ],
    teams: [
      { id: 30, name: "დინამო U17", points: "50 ქულა", form: "W W W W W", logo: "🛡️" },
      { id: 31, name: "რუსთავი U17", points: "44 ქულა", form: "W W D W W", logo: "🏭" },
      { id: 32, name: "წითელი ხიდი", points: "40 ქულა", form: "W L W W D", logo: "🌉" },
    ],
  },
};

export default function TopPerformers() {
  const [activeAge, setActiveAge] = useState("U15");
  const [activeCategory, setActiveCategory] = useState("players");
  const [animKey, setAnimKey] = useState(0);

  const currentData = MOCK_DATA[activeAge] || MOCK_DATA.U15;

  const handleAgeChange = (age: string) => {
    setActiveAge(age);
    setAnimKey((k) => k + 1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setAnimKey((k) => k + 1);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--emerald-glow)]/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            ტოპ <span className="text-gradient-primary">შემსრულებლები</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
            საუკეთესო მოთამაშეები და გუნდები ასაკობრივი კატეგორიების მიხედვით
          </p>
        </div>

        {/* Filters Container */}
        <div className="flex flex-col items-center gap-5 mb-12">
          {/* Main Tabs (Age Groups) */}
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                onClick={() => handleAgeChange(age)}
                className={`px-5 sm:px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeAge === age
                    ? "bg-[var(--emerald-glow)] text-white shadow-lg shadow-emerald-900/30"
                    : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Sub-Tabs (Players vs Teams) */}
          <div className="flex gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-[var(--text-secondary)] hover:border-white/25 hover:text-white"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Display — key forces re-mount for animation */}
        <div key={animKey} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCategory === "players" &&
            currentData.players.map((player, i) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="glass-card p-6 rounded-2xl group flex flex-col items-center text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Player Photo or Fallback */}
                <div className="w-24 h-24 rounded-full bg-white/[0.04] mb-4 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-white/25 transition-all duration-300">
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserShield className="text-white/20 text-3xl" />
                  )}
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-[var(--emerald-glow)] transition-colors">
                  {player.name}
                </h3>
                <span className="text-[var(--text-secondary)] text-sm mb-4">
                  {player.position}
                </span>
                <div className="mt-auto inline-block bg-white/5 text-white/80 px-4 py-1.5 rounded-lg font-black text-lg border border-white/10">
                  {player.stat}
                </div>
              </Link>
            ))}

          {activeCategory === "teams" &&
            currentData.teams.map((team, i) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="glass-card p-6 rounded-2xl group text-center relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Decorative Side highlight */}
                <div className="absolute top-0 left-0 w-1 h-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 mb-4 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-105 group-hover:border-white/25 transition-all duration-300">
                  {team.logo}
                </div>
                <h3 className="text-lg font-bold mb-2">{team.name}</h3>
                <p className="font-mono text-xs tracking-widest text-[var(--text-secondary)] mb-4">
                  {team.form}
                </p>
                <div className="inline-flex items-center gap-2 text-white/70 font-bold">
                  <span>{team.points}</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
