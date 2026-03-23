"use client";
import React, { useState, useEffect } from "react";
import { schoolService } from "@/services/school.service";
import type { SchoolStats } from "@/types/school.types";
import AgeCategoryBadge from "./AgeCategoryBadge";

interface SchoolStatsPanelProps {
  schoolId: string;
}

const SchoolStatsPanel: React.FC<SchoolStatsPanelProps> = ({ schoolId }) => {
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await schoolService.getSchoolStats(schoolId);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch school stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-400 italic">
        სტატისტიკა ვერ ჩაიტვირთა
      </div>
    );
  }

  const statCards = [
    { label: "გუნდები", value: stats.totalTeams, color: "bg-blue-50 text-blue-600", icon: "👥" },
    { label: "მოთამაშეები", value: stats.totalPlayers, color: "bg-green-50 text-green-600", icon: "⚽" },
    { label: "მატჩები", value: stats.totalMatches, color: "bg-purple-50 text-purple-600", icon: "🏟️" },
    { label: "გოლები", value: stats.totalGoals, color: "bg-amber-50 text-amber-600", icon: "🥅" },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {card.label}
              </div>
              <div className={`p-2 rounded-lg text-lg ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Team Breakdown */}
      {stats.teamBreakdown && stats.teamBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">გუნდების მაჩვენებლები</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">გუნდი</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ასაკი</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">მოთამაშეები</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">მ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">მ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">ფ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">წ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">გ+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.teamBreakdown.map((team) => (
                  <tr key={team.teamId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{team.teamName}</td>
                    <td className="px-4 py-3">
                      <AgeCategoryBadge category={team.ageCategory} />
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{team.playerCount}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{team.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{team.wins}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{team.draws}</td>
                    <td className="px-4 py-3 text-center text-sm text-red-500">{team.losses}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 font-medium">{team.goalsFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Scorers */}
      {stats.topScorers && stats.topScorers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">საუკეთესო გოლმომგებელი</h3>
          <div className="space-y-3">
            {stats.topScorers.slice(0, 5).map((scorer, index) => (
              <div
                key={scorer.playerId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                    index === 1 ? "bg-gray-100 text-gray-600" :
                    index === 2 ? "bg-amber-100 text-amber-700" :
                    "bg-gray-50 text-gray-500"
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{scorer.playerName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{scorer.teamName}</span>
                      <AgeCategoryBadge category={scorer.ageCategory} />
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {scorer.goals}
                  <span className="text-xs text-gray-400 font-normal ml-1">გოლი</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolStatsPanel;
