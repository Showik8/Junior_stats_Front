"use client";

import { useEffect, useState, use } from "react";
import { schoolService } from "@/services/school.service";
import type { FootballSchool } from "@/types/school.types";
import { FiMapPin, FiCalendar, FiGlobe, FiUsers } from "react-icons/fi";
import { GiSoccerBall, GiTrophyCup } from "react-icons/gi";
import Link from "next/link";
import AgeCategoryBadge from "@/app/admin/components/AgeCategoryBadge";

export default function PublicSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [school, setSchool] = useState<FootballSchool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true);
        const data = await schoolService.getPublicSchool(unwrappedParams.id);
        setSchool(data);
      } catch (err) {
        console.error("Failed to fetch school detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--emerald-glow)"></div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <GiSoccerBall size={64} className="text-gray-600 mb-6 opacity-50" />
        <h1 className="text-3xl font-bold text-white mb-4">სკოლა ვერ მოიძებნა</h1>
        <p className="text-gray-400 mb-8">ინფორმაცია ამ სკოლის შესახებ მიუწვდომელია.</p>
        <Link href="/schools" className="px-6 py-3 rounded-xl bg-(--emerald-glow)/20 text-(--emerald-glow) font-medium border border-(--emerald-glow)/30 hover:bg-(--emerald-glow)/30 transition-all">
          ← სკოლებში დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Profile */}
      <div className="relative bg-[#0a1120] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-(--emerald-glow)/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 p-4 shadow-xl">
            {school.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={school.logoUrl} alt={school.name} className="w-full h-full object-contain" />
            ) : (
              <GiSoccerBall size={64} className="text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              {school.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-gray-300 mb-6">
              {school.city && (
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <FiMapPin className="text-(--emerald-glow)" />
                  {school.city}
                </div>
              )}
              {school.founded && (
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <FiCalendar className="text-(--emerald-glow)" />
                  {school.founded}
                </div>
              )}
              {school.website && (
                <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <FiGlobe className="text-(--emerald-glow)" />
                  ვებსაიტი
                </a>
              )}
            </div>

            {school.description && (
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                {school.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-(--emerald-glow)/20 rounded-lg text-(--emerald-glow)">
            <GiTrophyCup size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">გუნდები</h2>
          <span className="ml-2 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm font-medium border border-white/5">
            {school.teams?.length || 0}
          </span>
        </div>

        {(!school.teams || school.teams.length === 0) ? (
          <div className="bg-[#0a1120] border border-white/5 rounded-2xl p-12 text-center text-gray-500">
            ამ სკოლას გუნდები ჯერ არ აქვს დამატებული
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {school.teams.map((team) => (
              <div 
                key={team.id}
                className="bg-[#0a1120] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    {team.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <GiSoccerBall size={20} className="text-gray-400" />
                    )}
                  </div>
                  <AgeCategoryBadge category={team.ageCategory} size="md" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                
                {team.coach && (
                  <p className="text-sm text-gray-400 mb-4">
                    მწვრთნელი: <span className="text-gray-200">{team.coach}</span>
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm">
                  <div className="flex items-center text-gray-400">
                    <FiUsers className="mr-2 text-(--emerald-glow)" />
                    {team._count?.players ?? 0} მოთამაშე
                  </div>
                  <Link 
                    href={`/teams/${team.id}`}
                    className="text-(--emerald-glow) hover:text-emerald-300 font-medium transition-colors"
                  >
                    იხილეთ მეტი →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
