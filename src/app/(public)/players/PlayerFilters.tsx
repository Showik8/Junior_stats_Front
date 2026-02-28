"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiFilter } from "react-icons/fi";

const POSITIONS = [
  "ყველა",
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
  "Winger",
];

export default function PlayerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialSearch = searchParams.get("search") || "";
  const initialPosFilter = searchParams.get("position") || "ყველა";

  const [search, setSearch] = useState(initialSearch);
  const [posFilter, setPosFilter] = useState(initialPosFilter);
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      
      if (posFilter && posFilter !== "ყველა") {
        params.set("position", posFilter);
      } else {
        params.delete("position");
      }
      
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [search, posFilter, router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          size={16}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="მოძებნე მოთამაშე ან გუნდი..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 placeholder-white/40 text-sm focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-colors text-white"
        />
      </div>
      <div className="relative">
        <FiFilter
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          size={14}
        />
        <select
          value={posFilter}
          onChange={(e) => setPosFilter(e.target.value)}
          className="pl-10 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 appearance-none cursor-pointer transition-colors"
        >
          {POSITIONS.map((pos) => (
            <option
              key={pos}
              value={pos}
              className="bg-[#0a1120] text-white"
            >
              {pos}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
