import React from "react";
import { Team } from "@/types/admin";
import { FaTrophy, FaArrowRight } from "react-icons/fa";

interface TournamentsModuleProps {
  team: Team | null;
}

const TournamentsModule: React.FC<TournamentsModuleProps> = ({ team }) => {
  if (!team) return null;

  // Utilize the populated tournaments relation if available
  const tournaments = team.tournaments || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
         <h1 className="text-2xl font-bold text-gray-900">Tournaments</h1>
         <p className="mt-1 text-sm text-gray-500">All tournaments your team is participating in.</p>
      </div>

      {tournaments.length === 0 ? (
           <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
               <div className="mx-auto h-12 w-12 text-gray-400 mb-3"><FaTrophy className="text-4xl" /></div>
               <h3 className="text-lg font-medium text-gray-900">No tournaments yet</h3>
               <p className="text-gray-500 mt-1">You haven&apos;t joined any tournaments yet for this age category.</p>
           </div>
      ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tournaments.map((t, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group">
                        <div className="h-2 bg-blue-600 w-full"></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                                    <FaTrophy />
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    t.status === 'ACTIVE' || !t.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {t.status || 'Active'}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.tournament?.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">Organized by Junior Stats</p>
                            
                            <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                                <span className="text-gray-500">Joined: {new Date(t.joinedAt).toLocaleDateString()}</span>
                                <button className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                                    View Standing <FaArrowRight size={12} />
                                </button>
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
