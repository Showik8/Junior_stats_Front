"use client";

import Link from "next/link";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#060c1a] flex items-center -mt-16">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23060c1a' width='1' height='1'/%3E%3C/svg%3E"
          className="w-full h-full object-cover opacity-25"
        >
          <source src="/assets/main_hero.mp4" type="video/mp4" />
        </video>
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#060c1a] via-[#060c1a]/60 to-[#060c1a]/20 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-[#060c1a]/90 via-[#060c1a]/40 to-transparent z-10" />
      </div>

      {/* Content — Split Layout */}
      <div className="relative z-20 w-full container max-w-7xl mx-auto px-6 pt-24 pb-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        
        {/* Left: Text Block */}
        <div
          className={`flex-1 flex flex-col items-start justify-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            Junior Stats პლატფორმა
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-3 leading-none tracking-tight">
            <span className="text-[#10b981]">ახალი თაობა</span>
            <br />
            <span className="text-white">ქართული</span>
            <br />
            <span className="text-white">ფეხბურთის</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-8 max-w-lg">
            აღმოაჩინე ნიჭიერი მოთამაშეები, თვალი ადევნე ჩემპიონატებს და
            გაეცანი სრულ სტატისტიკას ერთ სივრცეში.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Primary CTA */}
            <Link
              href="/players"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#10b981] hover:bg-[#059669] text-[#060c1a] rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_45px_-5px_rgba(16,185,129,0.7)] w-full sm:w-auto"
            >
              <FaUsers className="text-base text-[#060c1a]/80 group-hover:text-[#060c1a] transition-colors" />
              <span>მოთამაშეების ბაზა</span>
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 backdrop-blur-md w-full sm:w-auto"
            >
              <FaCalendarAlt className="text-base text-white/80 group-hover:text-white transition-colors" />
              <span>მიმდინარე მატჩები</span>
            </Link>
          </div>
        </div>

        {/* Right: Player Visual */}
        <div
          className={`flex-1 relative flex items-end justify-center min-h-[420px] md:min-h-[580px] transition-all duration-1000 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          {/* Glow effect behind player */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#10b981]/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-[#3b82f6]/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Stadium lights effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-32 bg-white/5 blur-xl" />
          <div className="absolute top-0 left-[40%] w-1 h-24 bg-white/8 blur-lg rotate-12" />
          <div className="absolute top-0 left-[60%] w-1 h-24 bg-white/8 blur-lg -rotate-12" />

          {/* Player image / video clip */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="relative z-10 h-[420px] md:h-[560px] w-auto object-contain drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 0 40px rgba(16,185,129,0.2))" }}
          >
            <source src="/assets/main_hero.mp4" type="video/mp4" />
          </video>

          {/* Rounded card overlay at bottom-right */}
          <div className="absolute bottom-6 right-4 md:right-0 z-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center">
              <span className="text-[#10b981] text-xs font-black">★</span>
            </div>
            <div>
              <p className="text-white text-xs font-black leading-none">ლაივ ჩემპიონატები</p>
              <p className="text-white/70 text-[10px] mt-0.5">განახლება რეალურ დროში</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">გაიგე მეტი</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/15 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
