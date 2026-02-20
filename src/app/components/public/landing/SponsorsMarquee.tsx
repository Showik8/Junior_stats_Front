export default function SponsorsMarquee() {
  const SPONSORS = ["GFF", "SPORT BRAND", "BANK OF GEORGIA", "AQUA", "SILKNET", "SPORTS AGENCY"];

  return (
    <section className="py-16 border-y border-white/5 bg-[#030812] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
          სპონსორები და პარტნიორები
        </h3>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient edge masks */}
        <div className="absolute left-0 inset-y-0 w-24 md:w-40 bg-gradient-to-r from-[#030812] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 md:w-40 bg-gradient-to-l from-[#030812] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex w-max animate-marquee">
          {[1, 2, 3].map((group) => (
            <div key={group} className="flex items-center shrink-0">
              {SPONSORS.map((name, i) => (
                <div
                  key={`${group}-${i}`}
                  className="mx-8 md:mx-14 opacity-30 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0 cursor-default select-none"
                >
                  <span className="text-lg md:text-xl font-black tracking-[0.15em] text-white/80 whitespace-nowrap">
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
