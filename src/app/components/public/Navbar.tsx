"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { GiSoccerBall } from "react-icons/gi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full transition-all duration-500
        ${scrolled
          ? "glass border-b border-white/8 shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <GiSoccerBall
              size={30}
              className="text-emerald-400 animate-spin-slow group-hover:text-emerald-300 transition-colors"
            />
            <div className="absolute inset-0 bg-emerald-500/30 blur-xl rounded-full animate-glow-pulse" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Junior{" "}
            <span className="text-gradient-gold">Stats</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/admin"
            className="group flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              bg-linear-to-r from-emerald-600/20 to-emerald-500/10
              border border-emerald-500/25 text-emerald-400
              hover:from-emerald-600/30 hover:to-emerald-500/20
              hover:border-emerald-500/50 hover:text-emerald-300
              hover:shadow-lg hover:shadow-emerald-900/20"
          >
            ადმინ პანელი
            <FiChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${mobileOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-6 py-5 border-t border-white/5 bg-[#060c1a]/95 backdrop-blur-xl flex flex-col gap-3">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="text-emerald-400 font-semibold px-3 py-2.5 rounded-lg hover:bg-emerald-500/10 transition-all"
          >
            შესვლა →
          </Link>
        </div>
      </div>
    </nav>
  );
}
