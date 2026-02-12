import React, { useMemo } from "react";
import { Team, Tournament } from "@/types/admin";
import { FaTrophy, FaCalendarAlt, FaUsers } from "react-icons/fa";

interface TournamentsModuleProps {
  team: Team | null;
}

const TournamentsModule: React.FC<TournamentsModuleProps> = ({ team }) => {
  const tournaments = useMemo(() => {
    if (!team || !team.tournaments) return [];
    return team.tournaments.map(t => ({
        ...t.tournament,
        joinStatus: t.status,
        joinedAt: t.joinedAt
    }));
  }, [team]);

  if (!team) return null;

  return (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Participating Tournaments</h2>
        
        {tournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-white border-2 border-dashed border-gray-200 text-gray-400">
                <FaTrophy className="mb-3 text-3xl opacity-20" />
                <p>Not participating in any tournaments yet.</p>
                <p className="text-xs mt-1">Ask a super admin to add you to a tournament.</p>
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                    <div key={tournament.id} className="group relative bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
                        <div className="h-2 bg-amber-500 w-full" />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <FaTrophy className="text-xl" />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                                    tournament.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {tournament.status}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition">{tournament.name}</h3>
                            
                            <div className="space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span>Joined: {new Date(tournament.joinedAt).toLocaleDateString()}</span>
                                </div>
                                {/* Add more details if available in the future */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default TournamentsModule;
