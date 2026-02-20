"use client";

import Link from "next/link";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-deep)] flex items-center justify-center -mt-16"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-35"
        >
          <source
            src="https://res.cloudinary.com/dijovppjc/video/upload/v1771603455/main_hero_1_wkdigs.mp4"
            type="video/mp4"
          />
        </video>
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060c1a] via-[#060c1a]/70 to-[#060c1a]/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060c1a]/50 via-transparent to-[#060c1a]/50 z-10" />
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-fade-in delay-800">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">გაიგე მეტი</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative z-20 container max-w-5xl mx-auto px-6 text-center transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Subtle top label */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--emerald-glow)]/30 bg-[var(--emerald-glow)]/10 backdrop-blur-md mb-8"
          style={{ transitionDelay: "200ms" }}
        >
          <span className="w-2 h-2 rounded-full bg-[var(--emerald-glow)] animate-glow-pulse" />
          <span className="text-xs font-semibold text-[var(--emerald-glow)] uppercase tracking-[0.2em]">
            ოფიციალური პლატფორმა
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
          <span className="text-gradient-hero">ქართული ფეხბურთის</span>
          <br />
          <span className="text-gradient-primary">ახალი თაობა</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          აღმოაჩინე ნიჭიერი მოთამაშეები, თვალი ადევნე მიმდინარე ჩემპიონატებს და
          გაეცანი დეტალურ სტატისტიკას ერთ სივრცეში.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA */}
          <Link
            href="/players"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--emerald-glow)] hover:bg-[#059669] text-white rounded-xl font-bold text-base transition-all duration-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] w-full sm:w-auto"
          >
            <FaUsers className="text-lg text-white/60 group-hover:text-white transition-colors" />
            <span>მოთამაშეების ბაზა</span>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 rounded-xl font-bold text-base transition-all duration-300 backdrop-blur-md w-full sm:w-auto"
          >
            <FaCalendarAlt className="text-lg text-white/60 group-hover:text-white transition-colors" />
            <span>მიმდინარე მატჩები</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
