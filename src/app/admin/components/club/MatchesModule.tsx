import React, { useEffect, useState } from "react";
import { Team, Match } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface MatchesModuleProps {
  team: Team | null;
}

const MatchesModule: React.FC<MatchesModuleProps> = ({ team }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team?.id) {
       fetchMatches();
    }
  }, [team]);

  const fetchMatches = async () => {
    if (!team) return;
    try {
      setLoading(true);
      const data = await adminService.getTeamMatches(team.id);
      setMatches(data);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      // Don't show critical error, just log it. Maybe empty state.
      setError("Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  if (!team) return null;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Matches</h2>
            <div className="flex gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500"></span> Finished</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Scheduled</span>
            </div>
       </div>

       {loading ? (
           <div className="flex h-40 items-center justify-center rounded-xl bg-white border border-gray-100">
               <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
           </div>
       ) : error ? (
           <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>
       ) : matches.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-white border-2 border-dashed border-gray-200 text-gray-400">
                <FaCalendarAlt className="mb-3 text-3xl opacity-20" />
                <p>No matches found for this team.</p>
           </div>
       ) : (
           <div className="grid gap-4">
               {matches.map((match) => {
                   const isFinished = match.status === "FINISHED";
                   return (
                       <div key={match.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md">
                           {/* Date & Status */}
                           <div className="flex items-center gap-4 min-w-[150px]">
                               <div className={`p-2 rounded-lg ${isFinished ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {isFinished ? <FaCheckCircle /> : <FaClock />}
                               </div>
                               <div>
                                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{isFinished ? 'Completed' : 'Scheduled'}</p>
                                   <p className="text-sm font-medium text-gray-900">{new Date(match.date).toLocaleDateString()}</p>
                                   <p className="text-xs text-gray-400">{new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                               </div>
                           </div>

                           {/* Teams */}
                           <div className="flex-1 flex items-center justify-center gap-8">
                                <div className="text-right flex-1">
                                    <p className={`font-bold ${match.homeTeamId === team.id ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {match.homeTeam?.name || "Unknown"}
                                    </p>
                                    <span className="text-xs text-gray-400">Home</span>
                                </div>
                                <div className="flex items-center px-4 py-1 bg-gray-50 rounded-lg text-lg font-bold font-mono">
                                    vs
                                </div>
                                <div className="text-left flex-1">
                                    <p className={`font-bold ${match.awayTeamId === team.id ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {match.awayTeam?.name || "Unknown"}
                                    </p>
                                    <span className="text-xs text-gray-400">Away</span>
                                </div>
                           </div>

                           {/* Tournament Info */}
                           <div className="md:text-right min-w-[150px]">
                               <p className="text-sm font-medium text-gray-900">{match.tournament?.name || "Tournament"}</p>
                               <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                   {match.ageCategory.replace('_', ' ')}
                               </span>
                           </div>
                       </div>
                   );
               })}
           </div>
       )}
    </div>
  );
};

export default MatchesModule;
