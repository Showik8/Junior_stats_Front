import React, { useState } from "react";
import { Match, Team, CreateMatchPayload, Tournament, AgeCategory } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaCalendar, FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaFileAlt, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import MatchReportForm from "./MatchReportForm";

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
  const [venue, setVenue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // Edit State
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Report State
  const [reportingMatch, setReportingMatch] = useState<Match | null>(null);
  
  // UI State
  const [processing, setProcessing] = useState<string | null>(null); // "create" or matchId
  const [error, setError] = useState<string | null>(null);

  // Filter & Tab State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "finished">("upcoming");

  // Filter Matches
  const filteredMatches = matches.filter(m => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return m.homeTeam?.name.toLowerCase().includes(term) || 
             m.awayTeam?.name.toLowerCase().includes(term);
  });

  const plannedMatches = filteredMatches.filter(m => m.status === "SCHEDULED" || m.status === "CANCELLED"); 
  const playedMatches = filteredMatches.filter(m => m.status === "FINISHED");

  const resetForm = () => {
    setHomeTeamId("");
    setAwayTeamId("");
    setDate("");
    setVenue("");
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
        ageCategory: activeAgeCategory,
        venue: venue || undefined,
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
           ageCategory: activeAgeCategory, // Keep context
           venue: venue || undefined,
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
      setVenue(match.venue || "");
      
      const d = new Date(match.date);
      const localIso = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setDate(localIso);
      
      setIsCreating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Matches</h2>
            <p className="text-sm text-gray-500 mt-1">{activeAgeCategory.replace('_', '-')} • {filteredMatches.length} Total</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             {/* Search Bar */}
             <div className="relative flex-1 md:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search teams..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
            </div>

            {!isCreating && !editingMatch && (
                <button 
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                >
                    <FaPlus size={12} /> <span className="hidden sm:inline">Add Match</span>
                </button>
            )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <FaTimes className="text-red-500" />
          {error}
        </div>
      )}

      {(isCreating || editingMatch) && (
        <form onSubmit={editingMatch ? handleUpdateMatch : handleCreateMatch} className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                {editingMatch ? <FaEdit className="text-blue-500" /> : <FaCalendar className="text-blue-500" />}
                {editingMatch ? "Edit Match Details" : "Schedule New Match"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Home Team</label>
                    <div className="relative">
                        <select 
                            required
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none"
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
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Away Team</label>
                    <div className="relative">
                        <select 
                            required
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none"
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
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date & Time</label>
                    <input 
                        type="datetime-local" 
                        required
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Venue (Optional)</label>
                    <input 
                        type="text" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        placeholder="e.g. National Stadium"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
                <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={!!processing}
                    className="px-6 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                >
                    {processing ? "Saving..." : <><FaCheck className="text-xs" /> Save Match</>}
                </button>
            </div>
        </form>
      )}

      {/* Tabs - Only show if NO search term */}
      {!searchTerm && (
          <div className="flex border-b border-gray-100 mb-6">
              <button
                 onClick={() => setActiveTab("upcoming")}
                 className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                     activeTab === "upcoming" 
                        ? "text-blue-600 border-b-2 border-blue-600" 
                        : "text-gray-500 hover:text-gray-700"
                 }`}
              >
                  Upcoming
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{matches.filter(m => m.status === "SCHEDULED" || m.status === "CANCELLED").length}</span>
              </button>
              <button
                 onClick={() => setActiveTab("finished")}
                 className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                     activeTab === "finished" 
                        ? "text-blue-600 border-b-2 border-blue-600" 
                        : "text-gray-500 hover:text-gray-700"
                 }`}
              >
                  Results
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{matches.filter(m => m.status === "FINISHED").length}</span>
              </button>
          </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar">
        {/* Planned Matches */}
        {(searchTerm || activeTab === "upcoming") && (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${plannedMatches.length === 0 && !searchTerm ? 'hidden' : ''}`}>
                {searchTerm && (
                     <div className="flex items-center gap-3 mb-5 sticky top-0 bg-white z-10 py-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span> 
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upcoming Fixtures</h3>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                    {plannedMatches.length === 0 ? (
                         // Only show empty state if we are explicitly on the tab OR searching and finding nothing in this category
                        (activeTab === "upcoming" || searchTerm) && (
                            <div className="text-sm text-gray-400 italic bg-gray-50/50 p-8 rounded-2xl text-center border-2 border-dashed border-gray-100">
                                {searchTerm ? "No upcoming matches found" : "No upcoming matches scheduled"}
                            </div>
                        )
                    ) : (
                        plannedMatches.map(match => (
                            <div key={match.id} className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-gray-100/50 hover:border-blue-100 transition-all duration-300">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start flex-1">
                                          <div className="text-right flex-1 font-bold text-gray-800 truncate text-base md:text-lg w-1/3">{match.homeTeam?.name || "Unknown"}</div>
                                          
                                          <div className="flex flex-col items-center justify-center min-w-[80px] px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                              <div className="text-slate-300 font-extrabold text-xl leading-none">VS</div>
                                              <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Match</div>
                                          </div>
                                          
                                          <div className="text-left flex-1 font-bold text-gray-800 truncate text-base md:text-lg w-1/3">{match.awayTeam?.name || "Unknown"}</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                        <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-50 text-blue-600">
                                            <FaCalendar className="text-blue-500 text-xs" />
                                            <span className="font-mono text-xs font-semibold">{new Date(match.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        </div>
                                        {match.venue && (
                                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 text-gray-500">
                                            <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
                                            <span className="text-xs font-medium">{match.venue}</span>
                                          </div>
                                        )}
                                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setReportingMatch(match)} 
                                                className="p-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm shadow-emerald-200 transition-all transform hover:scale-105" 
                                                title="Submit Report"
                                            >
                                                <FaFileAlt size={14} />
                                            </button>
                                            <button onClick={() => startEdit(match)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FaEdit size={14} /></button>
                                            <button onClick={() => handleDeleteMatch(match.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FaTrash size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Played Matches */}
        {(searchTerm || activeTab === "finished") && (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 ${playedMatches.length === 0 && !searchTerm ? 'hidden' : ''}`}>
                {searchTerm && (
                    <div className="flex items-center gap-3 mb-5 sticky top-0 bg-white z-10 py-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Match Results</h3>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                )}

                 <div className="grid grid-cols-1 gap-4">
                    {playedMatches.length === 0 ? (
                        (activeTab === "finished" || searchTerm) && (
                            <div className="text-sm text-gray-400 italic bg-gray-50/50 p-8 rounded-2xl text-center border-2 border-dashed border-gray-100">
                                {searchTerm ? "No match results found" : "No finished matches yet"}
                            </div>
                        )
                    ) : (
                        playedMatches.map(match => (
                            <div key={match.id} className="flex flex-col sm:flex-row justify-between items-center p-5 bg-slate-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300">
                                 <div className="flex items-center gap-8 w-full sm:w-auto justify-center sm:justify-start flex-1">
                                      <div className={`text-right flex-1 sm:flex-none sm:w-40 font-bold truncate text-base ${
                                          (match.homeScore || 0) > (match.awayScore || 0) ? 'text-gray-900' : 'text-gray-500'
                                      }`}>{match.homeTeam?.name}</div>
                                      
                                      <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 min-w-[100px] justify-center">
                                          <span className={`font-extrabold text-xl w-8 text-center ${
                                              (match.homeScore || 0) > (match.awayScore || 0) ? 'text-blue-600' : 'text-slate-400'
                                          }`}>{match.homeScore ?? '-'}</span>
                                          <span className="text-slate-200 mx-1">:</span>
                                          <span className={`font-extrabold text-xl w-8 text-center ${
                                              (match.awayScore || 0) > (match.homeScore || 0) ? 'text-blue-600' : 'text-slate-400'
                                          }`}>{match.awayScore ?? '-'}</span>
                                      </div>

                                      <div className={`text-left flex-1 sm:flex-none sm:w-40 font-bold truncate text-base ${
                                          (match.awayScore || 0) > (match.homeScore || 0) ? 'text-gray-900' : 'text-gray-500'
                                      }`}>{match.awayTeam?.name}</div>
                                </div>
                                 <div className="text-xs text-slate-400 mt-4 sm:mt-0 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm ml-0 md:ml-6">
                                        <span className="font-bold text-slate-500 tracking-wider">FT</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="font-mono">{new Date(match.date).toLocaleDateString()}</span>
                                 </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Match Report Modal */}
      {reportingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
             <MatchReportForm 
                match={reportingMatch}
                onClose={() => setReportingMatch(null)}
                onSuccess={() => {
                    setReportingMatch(null);
                    onMatchUpdate();
                }}
             />
          </div>
      )}

    </div>
  );
};

export default MatchManagement;
