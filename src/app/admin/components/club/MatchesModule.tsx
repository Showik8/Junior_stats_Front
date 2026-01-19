import React, { useState, useEffect } from "react";
import { Team, Match } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaCalendarAlt, FaHistory, FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface MatchesModuleProps {
  team: Team | null;
}

const MatchesModule: React.FC<MatchesModuleProps> = ({ team }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  useEffect(() => {
    const fetchMatches = async () => {
      if (!team) return;
      try {
        setLoading(true);
        const data = await adminService.getTeamMatches(team.id);
        setMatches(data);
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [team]);

  const upcomingMatches = matches.filter(m => m.status === "SCHEDULED" || !m.status);
  const completedMatches = matches.filter(m => m.status === "FINISHED" || m.status === "CANCELLED");

  const displayMatches = activeTab === "upcoming" ? upcomingMatches : completedMatches;

  if (!team) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
           <p className="mt-1 text-sm text-gray-500">View and manage your match schedule.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
              <button
                 className={`flex-1 py-4 text-sm font-medium text-center transition ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                 onClick={() => setActiveTab('upcoming')}
              >
                 <div className="flex items-center justify-center gap-2">
                     <FaCalendarAlt />
                     Upcoming Matches ({upcomingMatches.length})
                 </div>
              </button>
              <button
                 className={`flex-1 py-4 text-sm font-medium text-center transition ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                 onClick={() => setActiveTab('completed')}
              >
                 <div className="flex items-center justify-center gap-2">
                     <FaHistory />
                     Completed Matches ({completedMatches.length})
                 </div>
              </button>
          </div>

          <div className="p-0 flex-1 relative">
             {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
             ) : displayMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-12">
                     <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mb-4 text-gray-400">
                         {activeTab === 'upcoming' ? <FaCalendarAlt className="text-2xl" /> : <FaHistory className="text-2xl" />}
                     </div>
                     <h3 className="text-lg font-medium text-gray-900">No {activeTab} matches</h3>
                     <p className="text-gray-500 mt-1 max-w-sm">
                        {activeTab === 'upcoming' 
                            ? "Matches will appear here once they are scheduled by the tournament organizer." 
                            : "Matches that have finished will be archived here."}
                     </p>
                </div>
             ) : (
                <div className="divide-y divide-gray-100">
                    {displayMatches.map(match => (
                        <div key={match.id} className="p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row items-center justify-between gap-4 group">
                             <div className="flex items-center gap-6 flex-1 w-full sm:w-auto">
                                  <div className="text-center min-w-[60px]">
                                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                                          {new Date(match.date).toLocaleDateString(undefined, { month: 'short' })}
                                      </span>
                                      <span className="block text-xl font-bold text-gray-900 leading-none mt-1">
                                          {new Date(match.date).getDate()}
                                      </span>
                                  </div>
                                  
                                  <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-1">
                                          <span className={`text-sm font-medium ${match.status === 'CANCELLED' ? 'text-red-500' : 'text-blue-600'}`}>
                                              {match.tournament?.name || "Tournament Match"}
                                          </span>
                                          {match.status === 'CANCELLED' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Cancelled</span>}
                                      </div>
                                      <div className="flex items-center gap-3 text-gray-900 font-semibold">
                                           <span className={match.homeTeamId === team.id ? 'text-blue-700' : ''}>
                                               {match.homeTeam?.name || "Home"}
                                           </span>
                                           <span className="text-gray-400 text-sm">VS</span>
                                           <span className={match.awayTeamId === team.id ? 'text-blue-700' : ''}>
                                               {match.awayTeam?.name || "Away"}
                                           </span>
                                      </div>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-gray-400" />
                                                {new Date(match.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                Main Stadium
                                            </span>
                                      </div>
                                  </div>
                             </div>

                             {activeTab === 'completed' && (
                                 <div className="flex items-center gap-4 border-l border-gray-100 pl-4 sm:ml-4">
                                     <div className="text-2xl font-bold text-gray-900 tracking-tight">
                                         {/* Placeholder score logic as match type doesn't have score explicitly yet in FE types often */}
                                         2 - 1
                                     </div>
                                     <button className="text-xs text-blue-600 font-medium hover:underline">
                                         Details
                                     </button>
                                 </div>
                             )}
                        </div>
                    ))}
                </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default MatchesModule;
