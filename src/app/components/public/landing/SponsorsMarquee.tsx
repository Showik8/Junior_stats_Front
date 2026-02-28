"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SponsorsMarquee() {
  const SPONSORS = ["GFF", "SPORT BRAND", "BANK OF GEORGIA", "AQUA", "SILKNET", "SPORTS AGENCY"];
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 border-t border-white/10 bg-(--bg-deep) overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-(--text-secondary) bg-white/5 inline-block px-6 py-2 rounded-full border border-white/10 shadow-sm">
          სპონსორები და პარტნიორები
        </h3>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-4">
        {/* Gradient edge masks */}
        <div className="absolute left-0 inset-y-0 w-32 md:w-64 bg-linear-to-r from-(--bg-deep) to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-32 md:w-64 bg-linear-to-l from-(--bg-deep) to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex w-max animate-marquee shadow-inner">
          {[1, 2, 3, 4].map((group) => (
            <div key={group} className="flex items-center shrink-0">
              {SPONSORS.map((name, i) => (
                <div
                  key={`${group}-${i}`}
                  className="mx-10 md:mx-16 opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer select-none"
                >
                  <span className="text-xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white/80 to-white/60 hover:from-white hover:to-(--gold) transition-colors">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
