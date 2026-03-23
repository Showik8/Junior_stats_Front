"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { schoolService } from "@/services/school.service";
import type { FootballSchool, SchoolListMeta } from "@/types/school.types";
import { FiSearch, FiMapPin, FiUsers } from "react-icons/fi";
import { GiSoccerBall } from "react-icons/gi";

export default function PublicSchoolsPage() {
  const [schools, setSchools] = useState<FootballSchool[]>([]);
  const [meta, setMeta] = useState<SchoolListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const data = await schoolService.getPublicSchools({
          page,
          search: debouncedSearch,
        });
        setSchools(data.schools);
        setMeta(data.meta);
      } catch (err) {
        console.error("Failed to fetch public schools:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, [page, debouncedSearch]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          საფეხბურთო <span className="text-gradient-gold">სკოლები</span>
        </h1>
        <p className="text-(--text-secondary)r max-w-2xl mx-auto text-lg">
          აღმოაჩინე საქართველოს საუკეთესო საფეხბურთო სკოლები და აკადემიები, 
          გაეცანი მათ გუნდებს და სტატისტიკას.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-12 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400 group-focus-within:text-(--emerald-glow) transition-colors" size={20} />
        </div>
        <input
          type="text"
          placeholder="მოძებნეთ სკოლა ან აკადემია..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-[#0a1120] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-(--emerald-glow)/50 focus:border-transparent transition-all shadow-lg"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0a1120] border border-white/5 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-20 bg-[#0a1120]/50 rounded-3xl border border-white/5 backdrop-blur-sm">
          <GiSoccerBall size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-white mb-2">სკოლები ვერ მოიძებნა</h3>
          <p className="text-gray-400">სცადეთ სხვა საძიებო სიტყვა</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Link
              href={`/schools/${school.id}`}
              key={school.id}
              className="group bg-[#0a1120] border border-white/10 rounded-2xl p-6 hover:bg-white/5 
                hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  {school.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={school.logoUrl}
                      alt={school.name}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  ) : (
                    <GiSoccerBall size={32} className="text-gray-400 group-hover:text-(--emerald-glow) transition-colors" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-(--emerald-glow) transition-colors line-clamp-1">
                    {school.name}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {school.city && (
                      <div className="flex items-center text-sm text-gray-400">
                        <FiMapPin className="mr-2" />
                        {school.city}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-400">
                      <FiUsers className="mr-2" />
                      {school._count?.teams ?? 0} გუნდი
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/10"
          >
            ← წინა
          </button>
          <div className="flex items-center px-4 text-gray-400 font-medium">
            {page} / {meta.totalPages}
          </div>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === meta.totalPages}
            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/10"
          >
            შემდეგი →
          </button>
        </div>
      )}
    </div>
  );
}
