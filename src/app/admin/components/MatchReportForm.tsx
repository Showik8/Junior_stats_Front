import React, { useEffect, useState } from "react";
import { Match, Player, EventType, MatchReportEvent, MatchReportPlayerStat, SubmitMatchReportPayload } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaCheck, FaPlus, FaTrash, FaFutbol, FaStopwatch, FaUser, FaTshirt, FaTimes, FaLayerGroup } from "react-icons/fa";

interface MatchReportFormProps {
  match: Match;
  onClose: () => void;
  onSuccess: () => void;
}

const MatchReportForm: React.FC<MatchReportFormProps> = ({ match, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'home_stats' | 'away_stats'>('home_stats');

  // Form State
  const [homeScore, setHomeScore] = useState(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(match.awayScore ?? 0);
  const [referee, setReferee] = useState("");
  const [venue, setVenue] = useState(match.homeTeam?.name ? `${match.homeTeam.name} Stadium` : "");
  const [attendees, setAttendees] = useState(0);
  
  const [events, setEvents] = useState<MatchReportEvent[]>([]);
  const [playerStats, setPlayerStats] = useState<Record<string, MatchReportPlayerStat>>({});

  // Fetch players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const [home, away] = await Promise.all([
          adminService.getTeamPlayers(match.homeTeamId),
          adminService.getTeamPlayers(match.awayTeamId)
        ]);
        setHomePlayers(home);
        setAwayPlayers(away);
        
        // Initialize player stats
        const initialStats: Record<string, MatchReportPlayerStat> = {};
        [...home, ...away].forEach(p => {
            initialStats[p.id] = {
                playerId: p.id,
                played: false,
                goals: 0,
                assists: 0,
                yellowCards: 0,
                redCards: 0
            };
        });
        setPlayerStats(initialStats);
        
        // Auto-set initial active tab based on data
        if(home.length > 0) setActiveTab('home_stats');

      } catch (err: any) {
        setError(err.message || "Failed to load players");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [match.homeTeamId, match.awayTeamId]);

  // Event Handlers
  const addEvent = () => {
      setEvents([...events, {
          eventType: EventType.GOAL,
          minute: 0,
          teamId: match.homeTeamId, // Default to home team
          playerId: ""
      }]);
      setActiveTab('events');
  };

  const removeEvent = (index: number) => {
      const newEvents = [...events];
      newEvents.splice(index, 1);
      setEvents(newEvents);
  };

  const updateEvent = (index: number, field: keyof MatchReportEvent, value: any) => {
      const newEvents = [...events];
      newEvents[index] = { ...newEvents[index], [field]: value };
      
      // If team changes, clear player selection as ID won't match
      if (field === 'teamId') {
          newEvents[index].playerId = "";
          newEvents[index].assistPlayerId = "";
      }
      
      setEvents(newEvents);
  };

  const updatePlayerStat = (playerId: string, field: keyof MatchReportPlayerStat, value: any) => {
      setPlayerStats(prev => ({
          ...prev,
          [playerId]: {
              ...prev[playerId],
              [field]: value
          }
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);

      try {
          const statsArray = Object.values(playerStats).filter(s => s.played || s.goals > 0 || s.yellowCards > 0 || s.redCards > 0);

          const payload: SubmitMatchReportPayload = {
              matchId: match.id,
              homeScore,
              awayScore,
              referee,
              venue,
              attendees,
              events: events.map(e => ({
                  ...e,
                  playerId: e.playerId || undefined,
                  assistPlayerId: e.assistPlayerId || undefined
              })),
              playerStats: statsArray
          };

          await adminService.submitMatchReport(match.id, payload);
          onSuccess();
      } catch (err: any) {
          setError(err.message || "Failed to submit report");
          setSubmitting(false);
      }
  };

  if (loading) return (
      <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
  );

  const allPlayers = [...homePlayers, ...awayPlayers];

  // Helper to get stats table
  const PlayerStatsTable = ({ players, teamName }: { players: Player[], teamName?: string }) => (
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
          <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-semibold text-gray-700 text-sm">{teamName} Squad</h4>
              <span className="text-xs text-gray-500">{players.length} Players</span>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                      <tr>
                          <th className="px-4 py-3 w-10">Play</th>
                          <th className="px-4 py-3">Player</th>
                          <th className="px-2 py-3 text-center w-16">Min</th>
                          <th className="px-2 py-3 text-center w-16">G</th>
                          <th className="px-2 py-3 text-center w-16">A</th>
                          <th className="px-2 py-3 text-center w-16">YC</th>
                          <th className="px-2 py-3 text-center w-16">RC</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {players.map(player => {
                          const stats = playerStats[player.id];
                          if (!stats) return null;
                          const isPlayed = stats.played;

                          return (
                              <tr key={player.id} className={`hover:bg-gray-50 transition-colors ${isPlayed ? 'bg-blue-50/30' : ''}`}>
                                  <td className="px-4 py-3 text-center">
                                      <input 
                                          type="checkbox"
                                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                          checked={stats.played}
                                          onChange={e => updatePlayerStat(player.id, "played", e.target.checked)}
                                      />
                                  </td>
                                  <td className="px-4 py-3">
                                      <div className="font-medium text-gray-900">{player.name}</div>
                                      <div className="text-xs text-gray-400 flex items-center gap-1">
                                          {player.shirtNumber && <span className="bg-gray-100 px-1 rounded">#{player.shirtNumber}</span>}
                                          <span>{player.position}</span>
                                      </div>
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" min="0" max="150"
                                          disabled={!isPlayed}
                                          className="w-full text-center p-1 border rounded text-xs disabled:opacity-50 disabled:bg-gray-100"
                                          value={stats.minutesPlayed || 0}
                                          onChange={e => updatePlayerStat(player.id, "minutesPlayed", parseInt(e.target.value) || 0)}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" min="0"
                                          disabled={!isPlayed}
                                          className={`w-full text-center p-1 border rounded text-xs font-bold disabled:opacity-50 disabled:bg-gray-100 ${stats.goals > 0 ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500'}`}
                                          value={stats.goals}
                                          onChange={e => updatePlayerStat(player.id, "goals", parseInt(e.target.value) || 0)}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" min="0"
                                          disabled={!isPlayed}
                                          className={`w-full text-center p-1 border rounded text-xs font-bold disabled:opacity-50 disabled:bg-gray-100 ${stats.assists > 0 ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-gray-500'}`}
                                          value={stats.assists}
                                          onChange={e => updatePlayerStat(player.id, "assists", parseInt(e.target.value) || 0)}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" min="0"
                                          disabled={!isPlayed}
                                          className={`w-full text-center p-1 border rounded text-xs font-bold disabled:opacity-50 disabled:bg-gray-100 ${stats.yellowCards > 0 ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 'text-gray-500'}`}
                                          value={stats.yellowCards}
                                          onChange={e => updatePlayerStat(player.id, "yellowCards", parseInt(e.target.value) || 0)}
                                      />
                                  </td>
                                  <td className="px-2 py-2">
                                      <input 
                                          type="number" min="0"
                                          disabled={!isPlayed}
                                          className={`w-full text-center p-1 border rounded text-xs font-bold disabled:opacity-50 disabled:bg-gray-100 ${stats.redCards > 0 ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-500'}`}
                                          value={stats.redCards}
                                          onChange={e => updatePlayerStat(player.id, "redCards", parseInt(e.target.value) || 0)}
                                      />
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] w-full max-w-6xl mx-auto">
        {/* Header - Scoreboard Style */}
        <div className="bg-slate-900 text-white p-6 shadow-md relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900 pointer-events-none"></div>
             
             <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-3 text-slate-400">
                    <FaFutbol className="text-xl" />
                    <span className="uppercase tracking-widest text-xs font-bold">Match Report</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm">
                    <FaTimes />
                </button>
             </div>

             <div className="flex items-center justify-center gap-12 mt-4 relative z-10">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="text-2xl md:text-3xl font-bold text-center leading-tight">{match.homeTeam?.name}</div>
                    <div className="text-xs uppercase bg-white/10 px-3 py-1 rounded-full text-slate-300">Home</div>
                </div>

                {/* Score Inputs */}
                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                    <input 
                        type="number" min="0"
                        className="bg-transparent text-center text-5xl md:text-6xl font-mono font-bold w-24 outline-none text-white focus:text-blue-400 transition-colors"
                        value={homeScore}
                        onChange={e => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <div className="text-4xl text-slate-600 font-light">:</div>
                    <input 
                        type="number" min="0"
                        className="bg-transparent text-center text-5xl md:text-6xl font-mono font-bold w-24 outline-none text-white focus:text-blue-400 transition-colors"
                        value={awayScore}
                        onChange={e => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                    <div className="text-2xl md:text-3xl font-bold text-center leading-tight">{match.awayTeam?.name}</div>
                    <div className="text-xs uppercase bg-white/10 px-3 py-1 rounded-full text-slate-300">Away</div>
                </div>
             </div>
             
             {/* Match Details Inline */}
             <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
                 <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5">
                     <span className="text-slate-500 uppercase text-[10px] font-bold">Date</span>
                     <span className="text-slate-200">{new Date(match.date).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5">
                     <span className="text-slate-500 uppercase text-[10px] font-bold">Venue</span>
                     <input 
                        className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-slate-200 w-32 focus:w-48 transition-all"
                        value={venue}
                        onChange={e => setVenue(e.target.value)}
                        placeholder="Enter Venue"
                     />
                 </div>
                 <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5">
                     <span className="text-slate-500 uppercase text-[10px] font-bold">Referee</span>
                     <input 
                        className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-slate-200 w-32 focus:w-48 transition-all"
                        value={referee}
                        onChange={e => setReferee(e.target.value)}
                        placeholder="Enter Referee"
                     />
                 </div>
             </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col pt-6 pb-4">
                <nav className="space-y-1 px-4">
                    <button 
                        onClick={() => setActiveTab('home_stats')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'home_stats' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaTshirt className={activeTab === 'home_stats' ? 'text-blue-500' : 'text-gray-400'} />
                        <div className="text-left">
                            <div className="leading-none">{match.homeTeam?.name}</div>
                            <div className="text-[10px] opacity-70 mt-1 font-normal">Player Stats</div>
                        </div>
                    </button>
                    <button 
                         onClick={() => setActiveTab('away_stats')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'away_stats' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaTshirt className={activeTab === 'away_stats' ? 'text-blue-500' : 'text-gray-400'} />
                         <div className="text-left">
                            <div className="leading-none">{match.awayTeam?.name}</div>
                            <div className="text-[10px] opacity-70 mt-1 font-normal">Player Stats</div>
                        </div>
                    </button>
                    
                    <div className="my-4 border-t border-gray-100 mx-2"></div>

                    <button 
                        onClick={() => setActiveTab('events')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'events' ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaLayerGroup className={activeTab === 'events' ? 'text-amber-500' : 'text-gray-400'} />
                        <div className="text-left">
                            <div className="leading-none">Match Events</div>
                            <div className="text-[10px] opacity-70 mt-1 font-normal">Goals, Cards, Subs</div>
                        </div>
                         <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{events.length}</span>
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
                {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 shadow-sm flex items-center gap-2"><FaTimes /> {error}</div>}

                {/* EVENTS TAB */}
                {activeTab === 'events' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Timeline Events</h3>
                                <p className="text-gray-500 text-sm">Log key moments of the match in chronological order.</p>
                            </div>
                            <button 
                                onClick={addEvent} 
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/10 flex items-center gap-2 text-sm font-medium transition-all transform active:scale-95"
                            >
                                <FaPlus /> Add Event
                            </button>
                        </div>

                        <div className="space-y-3">
                             {events.length === 0 ? (
                                 <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                     <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><FaStopwatch /></div>
                                     <h4 className="text-gray-900 font-medium">No Events Recorded</h4>
                                     <p className="text-gray-500 text-sm mt-1">Click "Add Event" to start logging goals, cards, and more.</p>
                                 </div>
                             ) : (
                                 events.map((event, idx) => (
                                     <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                                         <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                                             {/* Time */}
                                             <div className="w-20">
                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Minute</label>
                                                <div className="relative">
                                                    <input 
                                                        type="number" min="0" max="130"
                                                        className="w-full font-mono font-bold text-lg border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent py-1"
                                                        value={event.minute}
                                                        onChange={e => updateEvent(idx, "minute", parseInt(e.target.value) || 0)}
                                                    />
                                                    <span className="absolute right-0 bottom-2 text-xs text-gray-400">'</span>
                                                </div>
                                             </div>

                                             {/* Type */}
                                             <div className="w-32">
                                                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Event Type</label>
                                                 <select 
                                                    className="w-full text-sm font-medium p-2 bg-gray-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-500 outline-none"
                                                    value={event.eventType}
                                                    onChange={e => updateEvent(idx, "eventType", e.target.value)}
                                                 >
                                                     {Object.values(EventType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                                                 </select>
                                             </div>

                                             {/* Team */}
                                             <div className="w-40">
                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Team</label>
                                                 <div className="flex bg-gray-100 rounded-lg p-1">
                                                     <button 
                                                        onClick={() => updateEvent(idx, "teamId", match.homeTeamId)}
                                                        className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-all truncate ${event.teamId === match.homeTeamId ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                                     >
                                                         Home
                                                     </button>
                                                     <button 
                                                        onClick={() => updateEvent(idx, "teamId", match.awayTeamId)}
                                                        className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-all truncate ${event.teamId === match.awayTeamId ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                                                     >
                                                         Away
                                                     </button>
                                                 </div>
                                             </div>

                                             {/* Player */}
                                             <div className="flex-1 min-w-[200px]">
                                                 <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Player</label>
                                                 <select 
                                                    className="w-full text-sm p-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm"
                                                    value={event.playerId || ""}
                                                    onChange={e => updateEvent(idx, "playerId", e.target.value)}
                                                 >
                                                     <option value="">Select Player</option>
                                                     {allPlayers.filter(p => p.teamId === event.teamId).map(p => (
                                                         <option key={p.id} value={p.id}>{p.shirtNumber ? `#${p.shirtNumber} ` : ""}{p.name}</option>
                                                     ))}
                                                 </select>
                                             </div>

                                             {/* Delete */}
                                             <button 
                                                onClick={() => removeEvent(idx)} 
                                                className="mt-4 md:mt-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                             >
                                                <FaTrash />
                                             </button>
                                         </div>
                                         
                                         {/* Conditional Assist for Goals */}
                                         {event.eventType === EventType.GOAL && (
                                             <div className="mt-3 pl-20 ml-2 border-l-2 border-gray-100 animate-in fade-in slide-in-from-top-1">
                                                 <div className="flex items-center gap-3">
                                                     <span className="text-xs font-bold text-gray-400 uppercase">Assist by:</span>
                                                     <select 
                                                        className="text-sm p-1.5 bg-gray-50 border border-transparent hover:border-gray-200 rounded focus:border-blue-500 outline-none cursor-pointer"
                                                        value={event.assistPlayerId || ""}
                                                        onChange={e => updateEvent(idx, "assistPlayerId", e.target.value)}
                                                     >
                                                         <option value="">No Assist</option>
                                                         {allPlayers.filter(p => p.teamId === event.teamId).map(p => (
                                                             <option key={p.id} value={p.id}>{p.name}</option>
                                                         ))}
                                                     </select>
                                                 </div>
                                             </div>
                                         )}
                                     </div>
                                 ))
                             )}
                        </div>
                    </div>
                )}

                {/* HOME STATS TAB */}
                {activeTab === 'home_stats' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <PlayerStatsTable players={homePlayers} teamName={match.homeTeam?.name} />
                    </div>
                )}

                {/* AWAY STATS TAB */}
                {activeTab === 'away_stats' && (
                     <div className="animate-in fade-in zoom-in-95 duration-300">
                        <PlayerStatsTable players={awayPlayers} teamName={match.awayTeam?.name} />
                    </div>
                )}

            </main>
        </div>
        
        {/* Footer Actions */}
        <div className="bg-white px-8 py-5 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-900">{events.length}</span> events recorded • 
                <span className="font-semibold text-gray-900 ml-1">{Object.values(playerStats).filter(s => s.played).length}</span> players participated
            </div>
            <div className="flex gap-4">
                <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    Cancel Details
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                    disabled={submitting}
                >
                    {submitting ? "Processing..." : <><FaCheck /> Submit Final Report</>}
                </button>
            </div>
        </div>
    </div>
  );
};

export default MatchReportForm;
