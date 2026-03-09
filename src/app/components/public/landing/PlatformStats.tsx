"use client";

import { useRef, useState } from "react";
import { FaFutbol, FaUsers, FaCalendarCheck, FaTrophy } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const STATS = [
  { id: 1, label: "მოთამაშეები", value: 1250, suffix: "+", icon: FaUsers, highlighted: true },
  { id: 2, label: "გუნდები", value: 84, suffix: "", icon: FaFutbol, highlighted: false },
  { id: 3, label: "ჩატარებული მატჩები", value: 4316, suffix: "+", icon: FaCalendarCheck, highlighted: false },
  { id: 4, label: "ჩემპიონატები", value: 12, suffix: "", icon: FaTrophy, highlighted: false },
];

export default function PlatformStats() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".stats-header",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".stat-card",
      { y: 36, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.12, ease: "back.out(1.2)" },
      "-=0.3"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 relative bg-[#07101f] overflow-hidden">
      {/* Top / Bottom dividers */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#10b981]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#10b981]/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="stats-header mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            პლატფორმის <span className="text-[#10b981]">მაჩვენებლები</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <StatItem key={stat.id} item={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ item }: { item: (typeof STATS)[0] }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 85%",
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: item.value,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => setCount(Math.floor(obj.val)),
        });
      },
      once: true,
    });
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className={`stat-card relative rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center group transition-all duration-400 overflow-hidden ${
        item.highlighted
          ? "bg-[#0f1d2e] border-2 border-[#10b981]/70 shadow-[0_0_30px_-8px_rgba(16,185,129,0.4)]"
          : "bg-[#0d1623] border border-white/8 hover:border-white/20 hover:bg-[#0f1d2e]"
      }`}
    >
      {/* Inner glow for highlighted */}
      {item.highlighted && (
        <div className="absolute inset-0 bg-linear-to-br from-[#10b981]/8 to-transparent pointer-events-none" />
      )}

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-400 ${
          item.highlighted
            ? "bg-[#10b981]/15 border border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            : "bg-white/5 border border-white/8 group-hover:bg-[#10b981]/10 group-hover:border-[#10b981]/25"
        }`}
      >
        <Icon
          className={`text-2xl transition-colors duration-400 ${
            item.highlighted ? "text-[#10b981]" : "text-white/70 group-hover:text-[#10b981]"
          }`}
        />
      </div>

      {/* Number */}
      <div
        className={`text-4xl md:text-5xl font-black mb-2 flex items-baseline justify-center leading-none ${
          item.highlighted ? "text-white" : "text-white"
        }`}
      >
        <span>{count.toLocaleString()}</span>
        {item.suffix && (
          <span className={`text-xl ml-1 font-bold ${item.highlighted ? "text-[#10b981]" : "text-white/70"}`}>
            {item.suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <div
        className={`text-xs font-bold uppercase tracking-widest mt-1 ${
          item.highlighted ? "text-[#10b981]/80" : "text-white/70 group-hover:text-white"
        } transition-colors`}
      >
        {item.label}
      </div>
    </div>
  );
}
