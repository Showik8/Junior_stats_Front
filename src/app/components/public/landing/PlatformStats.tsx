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
  { id: 1, label: "მოთამაშეები", value: 1250, suffix: "+", icon: FaUsers },
  { id: 2, label: "გუნდები", value: 84, suffix: "", icon: FaFutbol },
  { id: 3, label: "ჩატარებული მატჩები", value: 4320, suffix: "+", icon: FaCalendarCheck },
  { id: 4, label: "ჩემპიონატები", value: 12, suffix: "", icon: FaTrophy },
];

export default function PlatformStats() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      ".stats-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".stat-card",
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)" },
      "-=0.3"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 relative bg-[#030812] overflow-hidden">
      {/* Decorative Lines and Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-(--emerald-glow)/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-(--gold)/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-(--emerald-glow)/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="stats-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            პლატფორმის <span className="text-gradient-gold">მაჩვენებლები</span>
          </h2>
          <p className="text-(--text-secondary) text-lg font-medium">რეალურ დროში განახლებადი სტატისტიკა</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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
          duration: 2.5,
          ease: "power2.out",
          onUpdate: () => {
            setCount(Math.floor(obj.val));
          }
        });
      },
      once: true
    });
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="stat-card glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center group hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] relative overflow-hidden bg-white/5"
    >
      <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl bg-linear-to-tr from-white/5 to-white/10 flex items-center justify-center mb-5 border border-white/10 group-hover:scale-110 group-hover:border-(--emerald-glow)/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500"
      >
        <Icon className="text-3xl text-white/50 group-hover:text-white transition-colors" />
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl lg:text-5xl font-black mb-2 flex items-baseline justify-center text-white drop-shadow-lg group-hover:text-gradient-primary transition-all duration-500">
        <span>{count.toLocaleString()}</span>
        {item.suffix && (
          <span className="text-white/60 text-2xl ml-1 font-bold">{item.suffix}</span>
        )}
      </div>

      {/* Label */}
      <div className="text-sm md:text-sm font-bold text-(--text-secondary) uppercase tracking-wider mt-2 group-hover:text-white/80 transition-colors">
        {item.label}
      </div>
    </div>
  );
}
