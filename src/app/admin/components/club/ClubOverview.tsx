import React, { useMemo } from "react";
import { Team } from "@/types/admin";
import { FaUsers, FaTrophy, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

interface ClubOverviewProps {
  team: Team | null;
}

const ClubOverview: React.FC<ClubOverviewProps> = ({ team }) => {
  const stats = useMemo(() => {
    if (!team) return { players: 0, tournaments: 0, upcoming: 0, completed: 0 };
    return {
      players: team.players?.length || 0,
      tournaments: team.tournaments?.length || 0,
      upcoming: team.scheduledMatches?.length || 0,
      completed: team.finishedMatches?.length || 0,
    };
  }, [team]);

  const cards = [
    {
      label: "Total Players",
      value: stats.players,
      icon: FaUsers,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Tournaments",
      value: stats.tournaments,
      icon: FaTrophy,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Upcoming Matches",
      value: stats.upcoming,
      icon: FaCalendarAlt,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Completed Matches",
      value: stats.completed,
      icon: FaCheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  if (!team) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back, here is what's happening with your team.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor} ${card.textColor} transition-transform group-hover:scale-110`}>
                  <Icon className="text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
                 <span>View details</span>
                 <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions / Recent Activity could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Coach Information</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {team.coach ? team.coach.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{team.coach || "No Coach Assigned"}</p>
                        <p className="text-xs text-gray-500">Head Coach • {team.ageCategory.replace('_', '-')}</p>
                    </div>
                </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Next Match</h3>
                    {stats.upcoming === 0 && <span className="text-xs text-gray-400">No upcoming matches</span>}
               </div>

               {team.scheduledMatches && team.scheduledMatches.length > 0 ? (
                   <div className="space-y-3">
                       {team.scheduledMatches.slice(0, 2).map(match => (
                           <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                                <span className="text-sm font-semibold">{match.homeTeam?.name || "Home"} vs {match.awayTeam?.name || "Away"}</span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {new Date(match.date).toLocaleDateString()}
                                </span>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                       <FaCalendarAlt className="mb-2 text-2xl opacity-20" />
                       <span className="text-sm">No matches scheduled</span>
                   </div>
               )}
           </div>
      </div>
    </div>
  );
};

export default ClubOverview;
