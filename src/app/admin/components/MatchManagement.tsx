import React, { useState } from "react";
import { Match, Team, CreateMatchPayload, Tournament, AgeCategory } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaCalendar, FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

interface MatchManagementProps {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
  activeAgeCategory: AgeCategory;
  onMatchUpdate: () => void;
}

const MatchManagement: React.FC<MatchManagementProps> = ({
  tournament,
  teams,
  matches,
  activeAgeCategory,
  onMatchUpdate,
}) => {
  // Form State
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [date, setDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // Edit State
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  
  // UI State
  const [processing, setProcessing] = useState<string | null>(null); // "create" or matchId
  const [error, setError] = useState<string | null>(null);

  // Group Matches
  const plannedMatches = matches.filter(m => m.status === "SCHEDULED" || m.status === "CANCELLED"); // Prisma enum update
  const playedMatches = matches.filter(m => m.status === "FINISHED");

  const resetForm = () => {
    setHomeTeamId("");
    setAwayTeamId("");
    setDate("");
    setIsCreating(false);
    setEditingMatch(null);
    setError(null);
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing("create");

    try {
      const payload: CreateMatchPayload = {
        homeTeamId,
        awayTeamId,
        date,
        tournamentId: tournament.id,
        ageCategory: activeAgeCategory, // Explicitly pass context
      };

      await adminService.createMatch(payload);
      resetForm();
      onMatchUpdate();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError(err.message || "Failed to create match");
    } finally {
        setProcessing(null);
    }
  };

  const handleUpdateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    
    setError(null);
    setProcessing(editingMatch.id);

    try {
       await adminService.updateMatch(editingMatch.id, {
           homeTeamId,
           awayTeamId,
           date,
           tournamentId: tournament.id,
           ageCategory: activeAgeCategory // Keep context
       });

       resetForm();
       onMatchUpdate();
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError(err.message || "Failed to update match");
    } finally {
        setProcessing(null);
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
      if(!window.confirm("Are you sure you want to delete this match?")) return;
      
      setProcessing(matchId);
      try {
          await adminService.deleteMatch(matchId);
          onMatchUpdate();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setError(err.message || "Failed to delete match");
      } finally {
          setProcessing(null);
      }
  }

  const startEdit = (match: Match) => {
      setEditingMatch(match);
      setHomeTeamId(match.homeTeamId);
      setAwayTeamId(match.awayTeamId);
      
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      const d = new Date(match.date);
      // Adjust for timezone offset to show correct local time in input
      const localIso = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setDate(localIso);
      
      setIsCreating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Matches</h2>
            <p className="text-sm text-gray-500">{activeAgeCategory.replace('_', '-')} • {matches.length} Total</p>
        </div>
        
        {!isCreating && !editingMatch && (
            <button 
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 text-sm font-medium"
            >
                <FaPlus size={12} /> Schedule Match
            </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {(isCreating || editingMatch) && (
        <form onSubmit={editingMatch ? handleUpdateMatch : handleCreateMatch} className="mb-6 p-5 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                {editingMatch ? <FaEdit className="text-blue-500" /> : <FaCalendar className="text-blue-500" />}
                {editingMatch ? "Edit Match Details" : "Schedule New Match"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Home Team</label>
                    <select 
                        required
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        value={homeTeamId}
                        onChange={(e) => setHomeTeamId(e.target.value)}
                    >
                        <option value="">Select Home Team</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id} disabled={t.id === awayTeamId}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Away Team</label>
                    <select 
                        required
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        value={awayTeamId}
                        onChange={(e) => setAwayTeamId(e.target.value)}
                    >
                        <option value="">Select Away Team</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id} disabled={t.id === homeTeamId}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-6">
                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date & Time</label>
                 <input 
                    type="datetime-local" 
                    required
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                 />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-blue-100">
                <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={!!processing}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 text-sm font-medium shadow-sm transition-all"
                >
                    {processing ? "Saving..." : <><FaCheck className="text-xs" /> Save Match</>}
                </button>
            </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-8">
        {/* Planned Matches */}
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Upcoming
            </h3>
            <div className="space-y-3">
                {plannedMatches.length === 0 ? (
                    <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                        No upcoming matches scheduled
                    </div>
                ) : (
                    plannedMatches.map(match => (
                        <div key={match.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
                                      <div className="text-right flex-1 sm:flex-none sm:w-28 font-semibold text-gray-800 truncate">{match.homeTeam?.name || "Unknown"}</div>
                                      <div className="text-gray-300 font-bold text-xs bg-gray-50 px-2 py-1 rounded">VS</div>
                                      <div className="text-left flex-1 sm:flex-none sm:w-28 font-semibold text-gray-800 truncate">{match.awayTeam?.name || "Unknown"}</div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                        <FaCalendar className="text-gray-400 text-xs" />
                                        <span>{new Date(match.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 sm:static">
                                        <button onClick={() => startEdit(match)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FaEdit /></button>
                                        <button onClick={() => handleDeleteMatch(match.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Played Matches */}
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Finished
            </h3>
             <div className="space-y-3">
                {playedMatches.length === 0 ? (
                    <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                        No finished matches yet
                    </div>
                ) : (
                    playedMatches.map(match => (
                        <div key={match.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                             <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start opacity-70">
                                  <div className="text-right flex-1 sm:flex-none sm:w-28 font-medium truncate text-gray-700">{match.homeTeam?.name}</div>
                                  <div className="bg-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wide">Final</div>
                                  <div className="text-left flex-1 sm:flex-none sm:w-28 font-medium truncate text-gray-700">{match.awayTeam?.name}</div>
                            </div>
                             <div className="text-sm text-gray-400 mt-2 sm:mt-0">
                                    {new Date(match.date).toLocaleDateString()}
                             </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default MatchManagement;
