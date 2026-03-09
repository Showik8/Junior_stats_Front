"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import axios from "axios";
import { BASE_URL } from "@/app/utils/apiPaths";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
}

export default function SponsorsMarquee() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/public/sponsors`);
        if (res.data?.success && res.data?.data) {
          setSponsors(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch sponsors for marquee", err);
      }
    };
    fetchSponsors();
  }, []);

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
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/80 bg-white/5 inline-block px-6 py-2 rounded-full border border-white/10 shadow-sm">
          სპონსორები და პარტნიორები
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-4">
        {/* Gradient edge masks */}
        <div className="absolute left-0 inset-y-0 w-32 md:w-64 bg-linear-to-r from-(--bg-deep) to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-32 md:w-64 bg-linear-to-l from-(--bg-deep) to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        {sponsors.length > 0 ? (
          <div className="flex w-max animate-marquee shadow-inner">
            {[1, 2, 3, 4].map((group) => (
              <div key={group} className="flex items-center shrink-0">
                {sponsors.map((sponsor, i) => (
                  <div
                    key={`${group}-${sponsor.id}-${i}`}
                    className="mx-10 md:mx-16 flex items-center justify-center opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer select-none"
                    title={sponsor.name}
                  >
                    {sponsor.logoUrl ? (
                      <div className="relative w-24 h-16 md:w-32 md:h-20">
                         <Image src={sponsor.logoUrl} alt={sponsor.name} fill className="object-contain" unoptimized />
                      </div>
                    ) : (
                      <span className="text-xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white to-white/80 hover:from-white hover:to-[#ecc94b] transition-colors">
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center w-full py-8 text-white/70 text-sm font-bold tracking-widest uppercase">
            სპონსორები არ მოიძებნა
          </div>
        )}
      </div>
    </section>
  );
}
