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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Teams</h2>
           <p className="text-sm text-gray-500">{activeAgeCategory.replace('_', '-')} • {teams.length} Registered</p>
        </div>
        
        <button
          onClick={() => setIsAddingMode(!isAddingMode)}
          className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
            isAddingMode
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          }`}
        >
          {isAddingMode ? "Cancel" : "Add Team"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {isAddingMode && (
        <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder={`Search ${activeAgeCategory.replace('_', '-')} teams...`}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            {searching && (
                 <div className="absolute right-3 top-3.5">
                     <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                 </div>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {searchResults.length > 0 ? (
              searchResults.map((team) => (
                <div
                  key={team.id}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-300 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {team.logo ? <img src={team.logo} className="w-full h-full rounded-full object-cover"/> : team.name.charAt(0)}
                     </div>
                     <div>
                        <div className="font-medium text-gray-800 text-sm">{team.name}</div>
                        <div className="text-xs text-gray-500">{team.coach || 'No coach'}</div>
                     </div>
                  </div>
                  <button
                    onClick={() => handleAddTeam(team)}
                    disabled={processing === team.id}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    {processing === team.id ? "Adding..." : "Add"}
                  </button>
                </div>
              ))
            ) : searchQuery.length > 2 && !searching ? (
              <div className="text-center py-4 text-gray-500 text-sm bg-white rounded-lg border border-dashed border-gray-200">
                  No teams found matching "{searchQuery}" in {activeAgeCategory.replace('_', '-')}.
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
        {teams.length === 0 ? (
          <div className="text-center py-12 px-4 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="font-medium text-gray-600">No teams yet</p>
            <p className="text-sm mt-1">Add teams to start managing the tournament for {activeAgeCategory.replace('_', '-')}.</p>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold overflow-hidden shadow-inner">
                   {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : team.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{team.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                     <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{team.ageCategory.replace('_', '-')}</span>
                     {team.coach && <span>• Coach: {team.coach}</span>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveTeam(team.id)}
                disabled={processing === team.id}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Remove team from tournament"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MembersManagement;
