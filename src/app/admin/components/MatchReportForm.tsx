import React, { useEffect, useState, useMemo } from "react";
import { Match, Player, EventType, MatchReportEvent, MatchReportPlayerStat, SubmitMatchReportPayload } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { 
  FaCheck, FaTimes, FaSave, FaPlus, FaTrash, FaClock, FaUser, FaStickyNote, 
  FaMapMarkerAlt, FaUsers, FaThermometerHalf, FaFlag, FaExclamationTriangle,
  FaFutbol, FaExchangeAlt, FaSquare, FaListOl, FaChartBar, FaLock
} from "react-icons/fa";

interface MatchReportFormProps {
  match: Match;
  onClose: () => void;
  onSuccess: () => void;
}

const MatchReportForm: React.FC<MatchReportFormProps> = ({ match, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'stats'>('events');

  // Data State
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  
  // From State - Match Info
  const [referee, setReferee] = useState(match.referee || "");
  const [venue, setVenue] = useState(match.venue || "");
  const [attendees, setAttendees] = useState(match.attendees || 0);
  const [weatherNotes, setWeatherNotes] = useState(match.weatherNotes || "");
  const [notes, setNotes] = useState(match.notes || "");

  // Form State - Events & Stats
  const [events, setEvents] = useState<MatchReportEvent[]>((match.events || []).map(e => ({
    ...e,
    playerId: e.playerId || undefined,
    assistPlayerId: e.assistPlayerId || undefined,
    description: e.description || undefined
  })));
  const [playerStats, setPlayerStats] = useState<Record<string, MatchReportPlayerStat>>({});

  // Derived State: Score (Strictly calculated from events)
  const homeScore = useMemo(() => {
    const goals = events.filter(e => e.eventType === EventType.GOAL && e.teamId === match.homeTeamId).length;
    const ownGoals = events.filter(e => e.eventType === EventType.OWN_GOAL && e.teamId === match.awayTeamId).length;
    return goals + ownGoals;
  }, [events, match.homeTeamId, match.awayTeamId]);

  const awayScore = useMemo(() => {
    const goals = events.filter(e => e.eventType === EventType.GOAL && e.teamId === match.awayTeamId).length;
    const ownGoals = events.filter(e => e.eventType === EventType.OWN_GOAL && e.teamId === match.homeTeamId).length;
    return goals + ownGoals;
  }, [events, match.homeTeamId, match.awayTeamId]);

  // Timeline Event Form State
  const [newEvent, setNewEvent] = useState<Partial<MatchReportEvent>>({
    minute: 0,
    eventType: EventType.GOAL,
    teamId: match.homeTeamId
  });
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Stats Filter
  const [statsFilterTeam, setStatsFilterTeam] = useState<string>(match.homeTeamId);

  // Initialize Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [home, away] = await Promise.all([
          adminService.getTeamPlayers(match.homeTeamId),
          adminService.getTeamPlayers(match.awayTeamId)
        ]);
        setHomePlayers(home);
        setAwayPlayers(away);
        
        // Initialize player stats if empty
        const initialStats: Record<string, MatchReportPlayerStat> = {};
        const existingStatsMap = new Map(match.playerStats?.map(s => [s.playerId, s]));

        [...home, ...away].forEach(p => {
          const existing = existingStatsMap.get(p.id);
          initialStats[p.id] = {
            playerId: p.id,
            played: existing?.played || false,
            minutesPlayed: existing?.minutesPlayed || 0,
            goals: existing?.goals || 0,
            assists: existing?.assists || 0,
            yellowCards: existing?.yellowCards || 0,
            redCards: existing?.redCards || 0,
            shots: existing?.shots || 0,
            shotsOnTarget: existing?.shotsOnTarget || 0,
            fouls: existing?.fouls || 0,
            saves: existing?.saves || 0,
          };
        });
        setPlayerStats(initialStats);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load match data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [match.homeTeamId, match.awayTeamId, match.playerStats]);

  // Event Handlers
  const handleAddEvent = () => {
    // Strict Validation: Required fields
    if (newEvent.minute === undefined || !newEvent.eventType || !newEvent.teamId) return;
    
    // Strict Validation: Minute range
    if (newEvent.minute < 0 || newEvent.minute > 120) {
      alert("Minute must be between 0 and 120");
      return;
    }

    // Strict Validation: Player required for Goal, Cards, Subs
    if (!newEvent.playerId && newEvent.eventType !== EventType.OWN_GOAL) {
       alert("Please select a player");
       return;
    }

    setEvents([...events, {
      ...newEvent as MatchReportEvent,
    }].sort((a, b) => a.minute - b.minute));
    
    setIsAddingEvent(false);
    setNewEvent({
      minute: 0,
      eventType: EventType.GOAL,
      teamId: match.homeTeamId,
      playerId: undefined,
      assistPlayerId: undefined
    });
  };

  const removeEvent = (index: number) => {
    const newEvents = [...events];
    newEvents.splice(index, 1);
    setEvents(newEvents);
  };

  const updatePlayerStat = (playerId: string, field: keyof MatchReportPlayerStat, value: any) => {
    // Strict Input: Minutes between 0-120
    if (field === 'minutesPlayed') {
       const v = parseInt(value) || 0;
       if (v < 0) value = 0;
       if (v > 120) value = 120;
    }

    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    setError(null);
    setSubmitting(true);

    try {
      const statsArray = Object.values(playerStats).filter(s => 
        s.played || s.goals > 0 || s.yellowCards > 0 || s.redCards > 0 || (s.minutesPlayed || 0) > 0
      );
      
      const payload: SubmitMatchReportPayload = {
        matchId: match.id,
        homeScore, // Auto-calculated
        awayScore, // Auto-calculated
        referee,
        venue,
        attendees,
        weatherNotes,
        notes,
        events: events.map(e => ({
          ...e,
          playerId: e.playerId || undefined,
          assistPlayerId: e.assistPlayerId || undefined
        })),
        playerStats: statsArray
      };

      await adminService.submitMatchReport(match.id, payload);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit report";
      setError(msg);
      setSubmitting(false);
    }
  };

  // Helper styles
  const getEventColor = (type: EventType) => {
    switch (type) {
      case EventType.GOAL: return "bg-green-100 text-green-700 border-green-200";
      case EventType.YELLOW_CARD: return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case EventType.RED_CARD: return "bg-red-100 text-red-700 border-red-200";
      case EventType.SUBSTITUTION: return "bg-blue-100 text-blue-700 border-blue-200";
      case EventType.OWN_GOAL: return "bg-red-50 text-red-600 border-red-100";
      case EventType.PENALTY: return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case EventType.GOAL: return <FaFutbol />;
      case EventType.YELLOW_CARD: return <FaSquare className="text-yellow-400" />;
      case EventType.RED_CARD: return <FaSquare className="text-red-500" />;
      case EventType.SUBSTITUTION: return <FaExchangeAlt />;
      case EventType.OWN_GOAL: return <FaFutbol className="text-red-500" />;
      case EventType.PENALTY: return <div className="w-2 h-2 rounded-full bg-current" />;
      default: return null;
    }
  };

  const allPlayers = [...homePlayers, ...awayPlayers];
  const isMatchFinished = match.status === "FINISHED"; // Can still edit if backend allows, but usually read-only
  // User requested: "If match is already finished, disable form". 
  // But wait, admins usually need to correct mistakes. Let's create a disabled state.
  const isFormDisabled = match.status === "FINISHED" && submitting; // Actually let's assume always editable unless permission logic says otherwise, but user prompt "If match is already finished, disable form". I'll respect that strictly.
  // Actually, usually admin CAN edit finished matches. I will assume the prompt implies "Before it's re-opened". 
  // Let's stick to "Disable submit if invalid" from prompt mainly. 
  // RE-READ: "Match status - If match is already finished, disable form". Okay.
  
  const isFinished = match.status === "FINISHED";

  if (loading) return (
    <div className="flex items-center justify-center p-12 h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow-2xl overflow-hidden max-h-[95vh] w-full max-w-7xl mx-auto border border-gray-200 text-gray-900">
      
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-gray-100 rounded text-xs font-mono text-gray-500">
            ID: {match.id.substring(0, 8)}...
          </div>
          <h2 className="text-lg font-bold text-gray-800">Match Report</h2>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${match.status === 'FINISHED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {match.status}
          </span>
          {isFinished && <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100"><FaLock size={10} /> Read Only</span>}
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            {isFinished ? "Close" : "Cancel"}
          </button>
          {!isFinished && (
            <button 
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : <><FaCheck /> Submit Final Report</>}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {isFinished && <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] cursor-not-allowed" />}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {/* Match Info Grid */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaListOl className="text-blue-500" /> Match Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Score (Read Only) */}
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute top-2 right-2 text-gray-300"><FaLock size={12} /></div>
               <label className="text-xs font-bold text-gray-400 uppercase mb-2">Final Score (Auto)</label>
               <div className="flex items-center gap-4">
                 <div className="text-center">
                    <div className="text-sm font-bold text-gray-700 mb-1 truncate max-w-[100px]">{match.homeTeam?.name}</div>
                    <div className="w-16 h-12 flex items-center justify-center text-3xl font-bold bg-white border border-gray-200 rounded-lg text-gray-800">
                      {homeScore}
                    </div>
                 </div>
                 <div className="text-2xl font-bold text-gray-300">:</div>
                 <div className="text-center">
                    <div className="text-sm font-bold text-gray-700 mb-1 truncate max-w-[100px]">{match.awayTeam?.name}</div>
                    <div className="w-16 h-12 flex items-center justify-center text-3xl font-bold bg-white border border-gray-200 rounded-lg text-gray-800">
                      {awayScore}
                    </div>
                 </div>
               </div>
               <p className="text-[10px] text-gray-400 mt-2 text-center">
                 Add <span className="font-bold text-green-600">Goal</span> events to update score
               </p>
            </div>

            {/* Info Fields */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Venue</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      disabled={isFinished}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Stadium Name"
                      value={venue}
                      onChange={e => setVenue(e.target.value)}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Referee</label>
                  <div className="relative">
                    <FaFlag className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      disabled={isFinished}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Referee Name"
                      value={referee}
                      onChange={e => setReferee(e.target.value)}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Attendees</label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      disabled={isFinished}
                      type="number"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="0"
                      value={attendees}
                      onChange={e => setAttendees(parseInt(e.target.value) || 0)}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Weather</label>
                  <div className="relative">
                    <FaThermometerHalf className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      disabled={isFinished}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="Sunny, 25°C"
                      value={weatherNotes}
                      onChange={e => setWeatherNotes(e.target.value)}
                    />
                  </div>
               </div>
            </div>
            
            <div className="lg:col-span-6">
               <label className="block text-xs font-bold text-gray-500 mb-1">Match Notes</label>
               <div className="relative">
                 <FaStickyNote className="absolute left-3 top-3 text-gray-400" />
                 <textarea 
                    disabled={isFinished}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[60px]"
                    placeholder="Additional comments..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                 />
               </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200">
           <button 
             onClick={() => setActiveTab('events')}
             className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
           >
             <FaClock /> Timeline Events
             <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full">{events.length}</span>
           </button>
           <button 
             onClick={() => setActiveTab('stats')}
             className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'stats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
           >
             <FaChartBar /> Player Statistics
           </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             {!isFinished && (
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-800">Match Events</h3>
                 <button 
                   onClick={() => setIsAddingEvent(!isAddingEvent)}
                   className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all flex items-center gap-2 ${isAddingEvent ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'}`}
                 >
                   {isAddingEvent ? <FaTimes /> : <FaPlus />} 
                   {isAddingEvent ? "Cancel" : "Add Event"}
                 </button>
               </div>
             )}

             {/* Add Event Form */}
             {isAddingEvent && !isFinished && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                   <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1">Minute (0-120)</label>
                      <input 
                        type="number" min="0" max="120"
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                        value={newEvent.minute}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          if (val >= 0 && val <= 120) setNewEvent({...newEvent, minute: val});
                        }}
                      />
                   </div>
                   <div className="md:col-span-2">
                       <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                       <select 
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          value={newEvent.eventType}
                          onChange={e => setNewEvent({...newEvent, eventType: e.target.value as EventType})}
                       >
                          {Object.values(EventType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                       </select>
                   </div>
                   <div className="md:col-span-2">
                       <label className="block text-xs font-bold text-gray-500 mb-1">Team</label>
                       <select 
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          value={newEvent.teamId}
                          onChange={e => setNewEvent({...newEvent, teamId: e.target.value, playerId: "", assistPlayerId: ""})}
                       >
                          <option value={match.homeTeamId}>{match.homeTeam?.name || "Home"}</option>
                          <option value={match.awayTeamId}>{match.awayTeam?.name || "Away"}</option>
                       </select>
                   </div>
                   <div className="md:col-span-3">
                       <label className="block text-xs font-bold text-gray-500 mb-1">Player</label>
                       <select 
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          value={newEvent.playerId || ""}
                          onChange={e => setNewEvent({...newEvent, playerId: e.target.value})}
                       >
                          <option value="">Select Player</option>
                          {allPlayers.filter(p => p.teamId === newEvent.teamId).map(p => (
                             <option key={p.id} value={p.id}>{p.shirtNumber ? `#${p.shirtNumber} ` : ""}{p.name}</option>
                          ))}
                       </select>
                   </div>
                   
                   {/* Conditional Field: Assist */}
                   {newEvent.eventType === EventType.GOAL && (
                     <div className="md:col-span-2">
                       <label className="block text-xs font-bold text-gray-500 mb-1">Assist (Opt)</label>
                       <select 
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm"
                          value={newEvent.assistPlayerId || ""}
                          onChange={e => setNewEvent({...newEvent, assistPlayerId: e.target.value})}
                       >
                          <option value="">None</option>
                          {allPlayers.filter(p => p.teamId === newEvent.teamId && p.id !== newEvent.playerId).map(p => (
                             <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                       </select>
                     </div>
                   )}

                   <div className="md:col-span-1">
                      <button 
                        onClick={handleAddEvent}
                        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      >
                         <FaPlus />
                      </button>
                   </div>
                </div>
             )}

             {/* Events Timeline List */}
             <div className="relative border-l-2 border-gray-100 ml-4 space-y-6">
                {events.length === 0 && (
                   <div className="ml-6 py-8 text-gray-400 italic">No events recorded yet.</div>
                )}
                
                {events.map((event, idx) => {
                   const team = event.teamId === match.homeTeamId ? match.homeTeam : match.awayTeam;
                   const player = allPlayers.find(p => p.id === event.playerId);
                   const assist = allPlayers.find(p => p.id === event.assistPlayerId);
                   
                   return (
                      <div key={idx} className="ml-6 relative">
                         <div className={`absolute -left-[31px] w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs shadow-sm bg-white ${event.eventType === EventType.GOAL ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-500'}`}>
                            {event.minute}'
                         </div>
                         
                         <div className={`p-4 rounded-xl border flex items-center justify-between group bg-white shadow-sm hover:shadow-md transition-all ${getEventColor(event.eventType)}`}>
                            <div className="flex items-center gap-4">
                               <div className="w-8 h-8 flex items-center justify-center text-lg">
                                  {getEventIcon(event.eventType)}
                               </div>
                               <div>
                                  <div className="font-bold text-gray-900 flex items-center gap-2">
                                     {player?.name || "Unknown Player"}
                                     <span className="text-xs font-normal text-gray-500 bg-white/50 px-2 py-0.5 rounded border border-gray-200/50">
                                       {team?.name}
                                     </span>
                                  </div>
                                  <div className="text-xs opacity-75">
                                     {event.eventType.replace('_', ' ')}
                                     {assist && ` • Assist: ${assist.name}`}
                                  </div>
                               </div>
                            </div>
                            {!isFinished && (
                              <button onClick={() => removeEvent(idx)} className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaTrash />
                              </button>
                            )}
                         </div>
                      </div>
                   );
                })}
             </div>
          </section>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
           <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex gap-2 mb-4">
                 <button 
                   onClick={() => setStatsFilterTeam(match.homeTeamId)}
                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statsFilterTeam === match.homeTeamId ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                 >
                    {match.homeTeam?.name}
                 </button>
                 <button 
                   onClick={() => setStatsFilterTeam(match.awayTeamId)}
                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statsFilterTeam === match.awayTeamId ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                 >
                    {match.awayTeam?.name}
                 </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                          <tr>
                             <th className="px-4 py-3 text-left w-10">#</th>
                             <th className="px-4 py-3 text-left">Player</th>
                             <th className="px-2 py-3 text-center w-16" title="Played">Pld</th>
                             <th className="px-2 py-3 text-center w-20" title="Minutes">Min</th>
                             <th className="px-2 py-3 text-center w-16" title="Goals">G</th>
                             <th className="px-2 py-3 text-center w-16" title="Assists">A</th>
                             <th className="px-2 py-3 text-center w-16" title="Shots">Sh</th>
                             <th className="px-2 py-3 text-center w-16" title="On Target">SoT</th>
                             <th className="px-2 py-3 text-center w-16" title="Fouls">Fls</th>
                             <th className="px-2 py-3 text-center w-16" title="Yellow Cards">YC</th>
                             <th className="px-2 py-3 text-center w-16" title="Red Cards">RC</th>
                             <th className="px-2 py-3 text-center w-16">Sav</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {allPlayers.filter(p => p.teamId === statsFilterTeam).map(player => {
                             const stats = playerStats[player.id];
                             if (!stats) return null;
                             const isPlayed = stats.played;

                             return (
                                <tr key={player.id} className={`hover:bg-blue-50/20 transition-colors ${isPlayed ? 'bg-blue-50/10' : ''}`}>
                                   <td className="px-4 py-3 text-gray-400 text-xs">{player.shirtNumber || '-'}</td>
                                   <td className="px-4 py-3">
                                      <div className="font-semibold text-gray-900">{player.name}</div>
                                      <div className="text-[10px] text-gray-400">{player.position}</div>
                                   </td>
                                   <td className="px-2 py-3 text-center">
                                      <input 
                                        type="checkbox"
                                        disabled={isFinished}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                                        checked={stats.played}
                                        onChange={e => updatePlayerStat(player.id, "played", e.target.checked)}
                                      />
                                   </td>
                                   <td className="px-2 py-3">
                                      <input 
                                        type="number" min="0" max="120"
                                        className={`w-full text-center p-1 rounded border ${isPlayed ? 'border-gray-200' : 'bg-gray-50 border-transparent text-gray-400'}`}
                                        disabled={!isPlayed || isFinished}
                                        value={stats.minutesPlayed}
                                        onChange={e => updatePlayerStat(player.id, "minutesPlayed", e.target.value)}
                                      />
                                   </td>
                                   {/* Goals */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 font-bold text-green-600 bg-green-50/30" 
                                          value={stats.goals} onChange={e => updatePlayerStat(player.id, "goals", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Assists */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 text-blue-600 bg-blue-50/30" 
                                          value={stats.assists} onChange={e => updatePlayerStat(player.id, "assists", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Shots */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 text-gray-600" 
                                          value={stats.shots || 0} onChange={e => updatePlayerStat(player.id, "shots", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Shots on Target */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 text-gray-600" 
                                          value={stats.shotsOnTarget || 0} onChange={e => updatePlayerStat(player.id, "shotsOnTarget", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Fouls */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 text-gray-600" 
                                          value={stats.fouls || 0} onChange={e => updatePlayerStat(player.id, "fouls", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Yellow Cards */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 font-bold text-yellow-600 bg-yellow-50/30" 
                                          value={stats.yellowCards} onChange={e => updatePlayerStat(player.id, "yellowCards", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Red Cards */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 font-bold text-red-600 bg-red-50/30" 
                                          value={stats.redCards} onChange={e => updatePlayerStat(player.id, "redCards", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                                   </td>
                                   {/* Saves */}
                                   <td className="px-2 py-3">
                                       <input type="number" min="0" className="w-full text-center p-1 rounded border border-gray-200 text-purple-600 bg-purple-50/30 disabled:bg-gray-50 disabled:text-gray-300" 
                                          value={stats.saves || 0} 
                                          onChange={e => updatePlayerStat(player.id, "saves", parseInt(e.target.value) || 0)} 
                                          disabled={!isPlayed || isFinished} 
                                       />
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
           </section>
        )}

      </main>
    </div>
  );
};

export default MatchReportForm;
