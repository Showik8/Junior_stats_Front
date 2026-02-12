import React, { useState } from "react";
import { Team, Tournament, AgeCategory } from "@/types/admin";
import { adminService } from "@/services/adminService";

interface MembersManagementProps {
  tournament: Tournament;
  teams: Team[];
  activeAgeCategory: AgeCategory; // Required context
  onTeamUpdate: () => void;
}

const MembersManagement: React.FC<MembersManagementProps> = ({
  tournament,
  teams,
  activeAgeCategory,
  onTeamUpdate,
}) => {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // Search teams (globally) matching the tournament's active age category
      const results = await adminService.searchTeams(
        query,
        activeAgeCategory
      );
      
      // Filter out teams that are already in the tournament
      const currentTeamIds = new Set(teams.map((t) => t.id));
      const availableTeams = results.filter((t) => !currentTeamIds.has(t.id));
      
      setSearchResults(availableTeams);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddTeam = async (team: Team) => {
    setProcessing(team.id);
    setError(null);
    try {
      await adminService.assignTeamToTournament(team.id, tournament.id);
      setIsAddingMode(false);
      setSearchQuery("");
      setSearchResults([]);
      onTeamUpdate();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(err.message || "Failed to add team");
    } finally {
      setProcessing(null);
    }
  };

  const handleRemoveTeam = async (teamId: string) => {
    if (!window.confirm("Are you sure you want to remove this team from the tournament? Matches involving this team might be affected.")) {
        return;
    }
    setProcessing(teamId);
    setError(null);
    try {
      await adminService.removeTeamFromTournament(teamId, tournament.id);
      onTeamUpdate();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(err.message || "Failed to remove team");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Teams</h2>
           <p className="text-sm text-gray-500 mt-1">{activeAgeCategory.replace('_', '-')} • {teams.length} Registered</p>
        </div>
        
        <button
          onClick={() => setIsAddingMode(!isAddingMode)}
          className={`px-5 py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center gap-2 ${
            isAddingMode
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5"
          }`}
        >
          {isAddingMode ? "Cancel" : "Add Team"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {isAddingMode && (
        <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search ${activeAgeCategory.replace('_', '-')} teams...`}
              className="w-full pl-5 pr-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-sm transition-all"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            {searching && (
                 <div className="absolute right-4 top-3.5">
                     <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                 </div>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {searchResults.length > 0 ? (
              searchResults.map((team) => (
                <div
                  key={team.id}
                  className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-300 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100 overflow-hidden">
                        {team.logo ? <img src={team.logo} className="w-full h-full rounded-full object-cover"/> : team.name.charAt(0)}
                     </div>
                     <div>
                        <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{team.name}</div>
                        <div className="text-xs text-gray-400 font-medium">{team.coach || 'No coach assigned'}</div>
                     </div>
                  </div>
                  <button
                    onClick={() => handleAddTeam(team)}
                    disabled={processing === team.id}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-bold disabled:opacity-50 transition-colors uppercase tracking-wide"
                  >
                    {processing === team.id ? "Adding..." : "Add Team"}
                  </button>
                </div>
              ))
            ) : searchQuery.length > 2 && !searching ? (
              <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
                  No teams found matching "{searchQuery}" in {activeAgeCategory.replace('_', '-')}.
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {teams.length === 0 ? (
          <div className="text-center py-16 px-6 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <p className="font-semibold text-gray-600">No teams registered yet</p>
            <p className="text-sm mt-2 max-w-xs mx-auto">Add teams to start managing the tournament for {activeAgeCategory.replace('_', '-')}.</p>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-gray-100/50 hover:border-blue-100 transition-all duration-300 group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-linear-to-br from-white to-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold overflow-hidden border border-gray-100 shadow-sm relative group-hover:scale-105 transition-transform">
                   {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : team.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{team.name}</div>
                  <div className="text-xs text-gray-400 font-medium flex items-center gap-2 mt-0.5">
                     <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-semibold">{team.ageCategory.replace('_', '-')}</span>
                     {team.coach && <span>• Coach: <span className="text-gray-600">{team.coach}</span></span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveTeam(team.id)}
                disabled={processing === team.id}
                className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 transform hover:scale-105 shadow-sm"
                title="Remove team from tournament"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MembersManagement;
