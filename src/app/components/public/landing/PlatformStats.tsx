"use client";

import { useEffect, useState, useRef } from "react";
import { FaFutbol, FaUsers, FaCalendarCheck, FaTrophy } from "react-icons/fa";

// Hook for animating numbers on scroll into view
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, triggerRef };
}

const STATS = [
  { id: 1, label: "მოთამაშეები", value: 1250, suffix: "+", icon: FaUsers },
  { id: 2, label: "გუნდები", value: 84, suffix: "", icon: FaFutbol },
  { id: 3, label: "ჩატარებული მატჩები", value: 4320, suffix: "+", icon: FaCalendarCheck },
  { id: 4, label: "ჩემპიონატები", value: 12, suffix: "", icon: FaTrophy },
];

export default function PlatformStats() {
  return (
    <section className="py-24 relative bg-[#030812]">
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--emerald-glow)]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            პლატფორმის <span className="text-gradient-gold">მაჩვენებლები</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">რეალურ დროში განახლებადი სტატისტიკა</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <StatItem key={stat.id} item={stat} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  item,
  delay,
}: {
  item: (typeof STATS)[0];
  delay: number;
}) {
  const { count, triggerRef } = useCountUp(item.value, 2500);
  const Icon = item.icon;

  return (
    <div
      ref={triggerRef}
      className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform"
      >
        <Icon className="text-xl text-white/40" />
      </div>

      {/* Number */}
      <div className="text-3xl md:text-4xl lg:text-5xl font-black mb-1 flex items-baseline justify-center text-white">
        <span>{count.toLocaleString()}</span>
        {item.suffix && (
          <span className="text-white/40 text-2xl ml-0.5">{item.suffix}</span>
        )}
      </div>

      {/* Label */}
      <div className="text-xs md:text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-1">
        {item.label}
      </div>
    </div>
  );
}
