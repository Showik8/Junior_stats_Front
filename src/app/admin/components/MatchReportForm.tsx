import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Match, Player, EventType, MatchReportEvent, MatchReportPlayerStat, SubmitMatchReportPayload } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { 
  FaCheck, FaTimes, FaSave, FaPlus, FaTrash, FaClock, FaStickyNote, 
  FaMapMarkerAlt, FaUsers, FaThermometerHalf, FaFlag, FaExclamationTriangle,
  FaFutbol, FaExchangeAlt, FaSquare, FaChartBar, FaLock, FaArrowRight, FaArrowLeft,
  FaClipboardList, FaBolt, FaCheckCircle, FaShieldAlt
} from "react-icons/fa";

interface MatchReportFormProps {
  match: Match;
  onClose: () => void;
  onSuccess: () => void;
}

// --- Step Definitions ---
const STEPS = [
  { id: 1, title: "მატჩის ინფორმაცია", subtitle: "ზოგადი მონაცემები", icon: FaClipboardList },
  { id: 2, title: "მატჩის მიმდინარეობა", subtitle: "ივენთები და ქმედებები", icon: FaBolt },
  { id: 3, title: "მიმოხილვა", subtitle: "გადამოწმება და დასრულება", icon: FaCheckCircle },
];

const MatchReportForm: React.FC<MatchReportFormProps> = ({ match, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepTransition, setStepTransition] = useState(false);

  // Data State
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  
  // Form State - Match Info
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

  // Derived Score
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

  const isFinished = match.status === "FINISHED";
  const allPlayers = useMemo(() => [...homePlayers, ...awayPlayers], [homePlayers, awayPlayers]);

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
        const msg = err instanceof Error ? err.message : "მონაცემების ჩატვირთვა ვერ მოხერხდა";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [match.homeTeamId, match.awayTeamId, match.playerStats]);

  // Event Handlers
  const handleAddEvent = useCallback(() => {
    if (newEvent.minute === undefined || !newEvent.eventType || !newEvent.teamId) return;
    if (newEvent.minute < 0 || newEvent.minute > 120) {
      alert("წუთი უნდა იყოს 0-დან 120-მდე");
      return;
    }
    if (!newEvent.playerId && newEvent.eventType !== EventType.OWN_GOAL) {
      alert("გთხოვთ აირჩიოთ მოთამაშე");
      return;
    }

    setEvents(prev => [...prev, { ...newEvent as MatchReportEvent }].sort((a, b) => a.minute - b.minute));
    setIsAddingEvent(false);
    setNewEvent({
      minute: 0,
      eventType: EventType.GOAL,
      teamId: match.homeTeamId,
      playerId: undefined,
      assistPlayerId: undefined
    });
  }, [newEvent, match.homeTeamId]);

  const removeEvent = useCallback((index: number) => {
    setEvents(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }, []);

  const updatePlayerStat = useCallback((playerId: string, field: keyof MatchReportPlayerStat, value: number | boolean) => {
    if (field === 'minutesPlayed') {
      const v = typeof value === 'number' ? value : 0;
      if (v < 0) value = 0;
      if (v > 120) value = 120;
    }
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value }
    }));
  }, []);

  const handleSubmit = async (asDraft: boolean = false) => {
    setError(null);
    setSubmitting(true);

    try {
      const statsArray = Object.values(playerStats).filter(s => 
        s.played || s.goals > 0 || s.yellowCards > 0 || s.redCards > 0 || (s.minutesPlayed || 0) > 0
      );
      
      const payload: SubmitMatchReportPayload = {
        matchId: match.id,
        homeScore,
        awayScore,
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

      if (asDraft) {
        await adminService.saveMatchReportDraft(match.id, payload);
      } else {
        await adminService.submitMatchReport(match.id, payload);
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ოქმის გაგზავნა ვერ მოხერხდა";
      setError(msg);
      setSubmitting(false);
    }
  };

  // Step navigation with animation
  const goToStep = (step: number) => {
    if (step < 1 || step > 3) return;
    setStepTransition(true);
    setTimeout(() => {
      setCurrentStep(step);
      setStepTransition(false);
    }, 150);
  };

  // Helper: event styling
  const getEventColor = (type: EventType) => {
    switch (type) {
      case EventType.GOAL: return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case EventType.YELLOW_CARD: return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case EventType.RED_CARD: return "bg-red-50 text-red-700 border-red-200";
      case EventType.SUBSTITUTION: return "bg-blue-50 text-blue-700 border-blue-200";
      case EventType.OWN_GOAL: return "bg-red-50/50 text-red-600 border-red-100";
      case EventType.PENALTY: return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case EventType.GOAL: return <FaFutbol />;
      case EventType.YELLOW_CARD: return <FaSquare className="text-yellow-400" />;
      case EventType.RED_CARD: return <FaSquare className="text-red-500" />;
      case EventType.SUBSTITUTION: return <FaExchangeAlt />;
      case EventType.OWN_GOAL: return <FaFutbol className="text-red-500" />;
      case EventType.PENALTY: return <FaShieldAlt />;
      default: return null;
    }
  };

  const getEventLabel = (type: EventType) => {
    switch (type) {
      case EventType.GOAL: return "გოლი";
      case EventType.YELLOW_CARD: return "ყვითელი ბარათი";
      case EventType.RED_CARD: return "წითელი ბარათი";
      case EventType.SUBSTITUTION: return "შეცვლა";
      case EventType.OWN_GOAL: return "ავტოგოლი";
      case EventType.PENALTY: return "პენალტი";
      default: return type;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 h-96 bg-white rounded-2xl shadow-2xl max-w-7xl mx-auto w-full">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-100 border-t-purple-600"></div>
      </div>
      <p className="mt-4 text-sm text-gray-400 font-medium">მონაცემების ჩატვირთვა...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] w-full max-w-6xl mx-auto border border-gray-200/50 text-gray-900">
      
      {/* ──────── HEADER ──────── */}
      <header className="bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-4 flex justify-between items-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
        
        <div className="flex items-center gap-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <FaClipboardList className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">მატჩის ოქმი</h2>
              <p className="text-xs text-white/60">{match.homeTeam?.name} vs {match.awayTeam?.name}</p>
            </div>
          </div>
          {isFinished && (
            <span className="flex items-center gap-1.5 text-xs text-amber-200 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <FaLock size={10} /> მხოლოდ ნახვა
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 z-10">
          {!isFinished && (
            <button 
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 border border-white/10"
            >
              <FaSave className="text-xs" /> დრაფტი
            </button>
          )}
          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all border border-white/10"
          >
            <FaTimes />
          </button>
        </div>
      </header>

      {/* ──────── STEP INDICATOR ──────── */}
      <div className="px-6 py-5 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const StepIcon = step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => !isFinished && step.id <= currentStep && goToStep(step.id)}
                  className={`flex items-center gap-3 group transition-all duration-300 ${
                    isActive || isCompleted ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-110' 
                      : isCompleted 
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' 
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? <FaCheck className="text-xs" /> : <StepIcon className="text-sm" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className={`text-sm font-bold transition-colors ${isActive ? 'text-purple-700' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    <div className={`text-[11px] ${isActive ? 'text-purple-400' : 'text-gray-300'}`}>
                      {step.subtitle}
                    </div>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 rounded-full overflow-hidden bg-gray-200">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted ? 'w-full bg-emerald-400' : 'w-0 bg-purple-400'}`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ──────── LIVE SCORE BAR ──────── */}
      <div className="px-6 py-3 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-center gap-6">
          <span className="text-sm font-bold text-gray-700 truncate max-w-[140px]">{match.homeTeam?.name}</span>
          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-extrabold text-purple-600 w-8 text-center">{homeScore}</span>
            <span className="text-gray-300 text-lg">:</span>
            <span className="text-2xl font-extrabold text-purple-600 w-8 text-center">{awayScore}</span>
          </div>
          <span className="text-sm font-bold text-gray-700 truncate max-w-[140px]">{match.awayTeam?.name}</span>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-1">
          ანგარიში ავტომატურად ითვლება ივენთებიდან
        </p>
      </div>

      {/* ──────── MAIN CONTENT ──────── */}
      <main className={`flex-1 overflow-y-auto p-6 transition-opacity duration-150 ${stepTransition ? 'opacity-0' : 'opacity-100'}`}>
        {isFinished && <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] cursor-not-allowed" />}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2 text-sm">
            <FaExclamationTriangle /> {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><FaTimes /></button>
          </div>
        )}

        {/* ═══════ STEP 1: Match Info ═══════ */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <FaClipboardList className="text-purple-600 text-sm" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">მატჩის ზოგადი ინფორმაცია</h3>
                <p className="text-xs text-gray-400">შეავსეთ მატჩის დეტალები თამაშის დაწყების წინ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">სტადიონი / ადგილი</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                  <input 
                    disabled={isFinished}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 focus:bg-white outline-none text-sm transition-all"
                    placeholder="მაგ: ბორის პაიჭაძის სტადიონი"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">მსაჯი</label>
                <div className="relative">
                  <FaFlag className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                  <input 
                    disabled={isFinished}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 focus:bg-white outline-none text-sm transition-all"
                    placeholder="მთავარი მსაჯის სახელი"
                    value={referee}
                    onChange={e => setReferee(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">მაყურებლების რაოდენობა</label>
                <div className="relative">
                  <FaUsers className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                  <input 
                    disabled={isFinished}
                    type="number"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 focus:bg-white outline-none text-sm transition-all"
                    placeholder="0"
                    value={attendees}
                    onChange={e => setAttendees(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ამინდი</label>
                <div className="relative">
                  <FaThermometerHalf className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                  <input 
                    disabled={isFinished}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 focus:bg-white outline-none text-sm transition-all"
                    placeholder="მაგ: მზიანი, 25°C"
                    value={weatherNotes}
                    onChange={e => setWeatherNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">შენიშვნები</label>
              <div className="relative">
                <FaStickyNote className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                <textarea 
                  disabled={isFinished}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 focus:bg-white outline-none text-sm min-h-[80px] transition-all resize-none"
                  placeholder="დამატებითი ინფორმაცია..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Match date info */}
            <div className="flex items-center gap-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
              <FaClock className="text-purple-400" />
              <div>
                <div className="text-xs font-bold text-purple-600">მატჩის თარიღი</div>
                <div className="text-sm text-gray-700 font-mono">
                  {new Date(match.date).toLocaleString("ka-GE", { dateStyle: "long", timeStyle: "short" })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: Live Events ═══════ */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <FaBolt className="text-indigo-600 text-sm" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">მატჩის ივენთები</h3>
                  <p className="text-xs text-gray-400">გოლები, ბარათები, შეცვლები — წუთების მიხედვით</p>
                </div>
              </div>
              {!isFinished && (
                <button
                  onClick={() => setIsAddingEvent(!isAddingEvent)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                    isAddingEvent 
                      ? 'bg-gray-100 border-gray-200 text-gray-600' 
                      : 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                  }`}
                >
                  {isAddingEvent ? <><FaTimes /> გაუქმება</> : <><FaPlus /> ივენთის დამატება</>}
                </button>
              )}
            </div>

            {/* Add Event Form */}
            {isAddingEvent && !isFinished && (
              <div className="bg-linear-to-br from-purple-50/80 to-indigo-50/50 border border-purple-100 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">წუთი</label>
                    <input 
                      type="number" min="0" max="120"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      value={newEvent.minute}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (val >= 0 && val <= 120) setNewEvent({...newEvent, minute: val});
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">ტიპი</label>
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      value={newEvent.eventType}
                      onChange={e => setNewEvent({...newEvent, eventType: e.target.value as EventType})}
                    >
                      {Object.values(EventType).map(t => <option key={t} value={t}>{getEventLabel(t)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">გუნდი</label>
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      value={newEvent.teamId}
                      onChange={e => setNewEvent({...newEvent, teamId: e.target.value, playerId: "", assistPlayerId: ""})}
                    >
                      <option value={match.homeTeamId}>{match.homeTeam?.name || "მასპინძელი"}</option>
                      <option value={match.awayTeamId}>{match.awayTeam?.name || "სტუმარი"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">მოთამაშე</label>
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      value={newEvent.playerId || ""}
                      onChange={e => setNewEvent({...newEvent, playerId: e.target.value})}
                    >
                      <option value="">აირჩიეთ</option>
                      {allPlayers.filter(p => p.teamId === newEvent.teamId).map(p => (
                        <option key={p.id} value={p.id}>{p.shirtNumber ? `#${p.shirtNumber} ` : ""}{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assist (only for goals) */}
                {newEvent.eventType === EventType.GOAL && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">ასისტი (არასავალდებულო)</label>
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 outline-none"
                      value={newEvent.assistPlayerId || ""}
                      onChange={e => setNewEvent({...newEvent, assistPlayerId: e.target.value})}
                    >
                      <option value="">არცერთი</option>
                      {allPlayers.filter(p => p.teamId === newEvent.teamId && p.id !== newEvent.playerId).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button 
                  onClick={handleAddEvent}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-semibold shadow-lg shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <FaPlus className="text-xs" /> დამატება
                </button>
              </div>
            )}

            {/* Events Timeline */}
            <div className="relative border-l-2 border-gray-100 ml-4 space-y-4 pb-4">
              {events.length === 0 && (
                <div className="ml-8 py-12 text-center">
                  <FaClock className="text-3xl text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">ჯერ ივენთები არ არის დამატებული</p>
                  <p className="text-gray-300 text-xs mt-1">დაამატეთ გოლები, ბარათები და შეცვლები</p>
                </div>
              )}
              
              {events.map((event, idx) => {
                const team = event.teamId === match.homeTeamId ? match.homeTeam : match.awayTeam;
                const player = allPlayers.find(p => p.id === event.playerId);
                const assist = allPlayers.find(p => p.id === event.assistPlayerId);
                
                return (
                  <div key={idx} className="ml-8 relative group">
                    <div className={`absolute -left-[37px] w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-sm bg-white ${
                      event.eventType === EventType.GOAL ? 'border-emerald-400 text-emerald-600' 
                      : event.eventType === EventType.RED_CARD ? 'border-red-400 text-red-600'
                      : 'border-gray-200 text-gray-500'
                    }`}>
                      {event.minute}&apos;
                    </div>
                    
                    <div className={`p-4 rounded-xl border flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-all ${getEventColor(event.eventType)}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center text-lg">
                          {getEventIcon(event.eventType)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                            {player?.name || "უცნობი მოთამაშე"}
                            <span className="text-[10px] font-medium text-gray-400 bg-white/60 px-2 py-0.5 rounded border border-gray-100">
                              {team?.name}
                            </span>
                          </div>
                          <div className="text-xs opacity-75 mt-0.5">
                            {getEventLabel(event.eventType)}
                            {assist && ` • ასისტი: ${assist.name}`}
                          </div>
                        </div>
                      </div>
                      {!isFinished && (
                        <button onClick={() => removeEvent(idx)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                          <FaTrash className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ STEP 3: Review & Stats ═══════ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FaCheckCircle className="text-emerald-600 text-sm" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">მიმოხილვა და დასრულება</h3>
                <p className="text-xs text-gray-400">გადაამოწმეთ ყველა მონაცემი სანამ დაასრულებთ</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score Card */}
              <div className="bg-linear-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-200">
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">საბოლოო ანგარიში</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-white/70 mb-1 truncate max-w-[80px]">{match.homeTeam?.name}</div>
                    <div className="text-3xl font-extrabold">{homeScore}</div>
                  </div>
                  <div className="text-xl text-white/40">:</div>
                  <div className="text-center">
                    <div className="text-xs text-white/70 mb-1 truncate max-w-[80px]">{match.awayTeam?.name}</div>
                    <div className="text-3xl font-extrabold">{awayScore}</div>
                  </div>
                </div>
              </div>

              {/* Match Info Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">მატჩის დეტალები</div>
                <div className="space-y-2 text-sm">
                  {venue && <div className="flex items-center gap-2 text-gray-600"><FaMapMarkerAlt className="text-gray-400 text-xs" />{venue}</div>}
                  {referee && <div className="flex items-center gap-2 text-gray-600"><FaFlag className="text-gray-400 text-xs" />{referee}</div>}
                  {attendees > 0 && <div className="flex items-center gap-2 text-gray-600"><FaUsers className="text-gray-400 text-xs" />{attendees} მაყურებელი</div>}
                  {weatherNotes && <div className="flex items-center gap-2 text-gray-600"><FaThermometerHalf className="text-gray-400 text-xs" />{weatherNotes}</div>}
                  {!venue && !referee && !weatherNotes && attendees === 0 && (
                    <p className="text-gray-300 italic text-xs">დეტალები არ არის შევსებული</p>
                  )}
                </div>
              </div>

              {/* Events Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">ივენთების სტატისტიკა</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FaFutbol className="text-emerald-500 text-xs" />
                    <span className="text-gray-600">{events.filter(e => e.eventType === EventType.GOAL).length} გოლი</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSquare className="text-yellow-400 text-xs" />
                    <span className="text-gray-600">{events.filter(e => e.eventType === EventType.YELLOW_CARD).length} ყვით.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSquare className="text-red-500 text-xs" />
                    <span className="text-gray-600">{events.filter(e => e.eventType === EventType.RED_CARD).length} წით.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaExchangeAlt className="text-blue-500 text-xs" />
                    <span className="text-gray-600">{events.filter(e => e.eventType === EventType.SUBSTITUTION).length} შეცვ.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Events Review */}
            {events.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <FaClock className="text-gray-400 text-sm" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ივენთების თაიმლაინი</span>
                </div>
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {events.map((event, idx) => {
                    const player = allPlayers.find(p => p.id === event.playerId);
                    const team = event.teamId === match.homeTeamId ? match.homeTeam : match.awayTeam;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-sm py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-xs font-bold text-gray-400 w-8">{event.minute}&apos;</span>
                        <span className="w-5">{getEventIcon(event.eventType)}</span>
                        <span className="font-semibold text-gray-800">{player?.name || "—"}</span>
                        <span className="text-xs text-gray-400">({team?.name})</span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${getEventColor(event.eventType)}`}>
                          {getEventLabel(event.eventType)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Player Statistics Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaChartBar className="text-gray-400 text-sm" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">მოთამაშეთა სტატისტიკა</span>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setStatsFilterTeam(match.homeTeamId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statsFilterTeam === match.homeTeamId ? 'bg-purple-600 text-white shadow-md shadow-purple-100' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {match.homeTeam?.name}
                  </button>
                  <button 
                    onClick={() => setStatsFilterTeam(match.awayTeamId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statsFilterTeam === match.awayTeamId ? 'bg-purple-600 text-white shadow-md shadow-purple-100' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {match.awayTeam?.name}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-3 py-2.5 text-left w-10">#</th>
                      <th className="px-3 py-2.5 text-left">მოთამაშე</th>
                      <th className="px-2 py-2.5 text-center w-12" title="ითამაშა">✓</th>
                      <th className="px-2 py-2.5 text-center w-16" title="წუთები">წთ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="გოლები">გ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="ასისტები">ა</th>
                      <th className="px-2 py-2.5 text-center w-14" title="დარტყმები">დრ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="კარში">კშ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="ფოლები">ფ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="ყვითელი">ყბ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="წითელი">წბ</th>
                      <th className="px-2 py-2.5 text-center w-14" title="სეივები">სვ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allPlayers.filter(p => p.teamId === statsFilterTeam).map(player => {
                      const stats = playerStats[player.id];
                      if (!stats) return null;
                      const isPlayed = stats.played;

                      return (
                        <tr key={player.id} className={`hover:bg-purple-50/20 transition-colors ${isPlayed ? 'bg-purple-50/5' : ''}`}>
                          <td className="px-3 py-2.5 text-gray-400 text-xs">{player.shirtNumber || '-'}</td>
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-gray-900 text-xs">{player.name}</div>
                            <div className="text-[9px] text-gray-400">{player.position}</div>
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <input 
                              type="checkbox"
                              disabled={isFinished}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                              checked={stats.played}
                              onChange={e => updatePlayerStat(player.id, "played", e.target.checked)}
                            />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" max="120"
                              className={`w-full text-center p-1 rounded-lg border text-xs ${isPlayed ? 'border-gray-200 bg-white' : 'bg-gray-50/50 border-transparent text-gray-300'}`}
                              disabled={!isPlayed || isFinished}
                              value={stats.minutesPlayed}
                              onChange={e => updatePlayerStat(player.id, "minutesPlayed", parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 font-bold text-emerald-600 bg-emerald-50/30 text-xs" 
                              value={stats.goals} onChange={e => updatePlayerStat(player.id, "goals", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 text-blue-600 bg-blue-50/30 text-xs" 
                              value={stats.assists} onChange={e => updatePlayerStat(player.id, "assists", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 text-gray-500 text-xs" 
                              value={stats.shots || 0} onChange={e => updatePlayerStat(player.id, "shots", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 text-gray-500 text-xs" 
                              value={stats.shotsOnTarget || 0} onChange={e => updatePlayerStat(player.id, "shotsOnTarget", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 text-gray-500 text-xs" 
                              value={stats.fouls || 0} onChange={e => updatePlayerStat(player.id, "fouls", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 font-bold text-yellow-600 bg-yellow-50/30 text-xs" 
                              value={stats.yellowCards} onChange={e => updatePlayerStat(player.id, "yellowCards", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 font-bold text-red-600 bg-red-50/30 text-xs" 
                              value={stats.redCards} onChange={e => updatePlayerStat(player.id, "redCards", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                          <td className="px-1 py-2.5">
                            <input type="number" min="0" className="w-full text-center p-1 rounded-lg border border-gray-200 text-purple-600 bg-purple-50/30 text-xs" 
                              value={stats.saves || 0} onChange={e => updatePlayerStat(player.id, "saves", parseInt(e.target.value) || 0)} disabled={!isPlayed || isFinished} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes Review */}
            {notes && (
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                <div className="text-xs font-bold text-amber-600 mb-1 flex items-center gap-1.5"><FaStickyNote className="text-[10px]" /> შენიშვნები</div>
                <p className="text-sm text-gray-600">{notes}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ──────── FOOTER NAVIGATION ──────── */}
      <footer className="bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          {currentStep > 1 && (
            <button
              onClick={() => goToStep(currentStep - 1)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2"
            >
              <FaArrowLeft className="text-xs" /> წინა
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          ეტაპი {currentStep} / {STEPS.length}
        </div>

        <div className="flex items-center gap-3">
          {currentStep < 3 ? (
            <button
              onClick={() => goToStep(currentStep + 1)}
              className="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              შემდეგი <FaArrowRight className="text-xs" />
            </button>
          ) : !isFinished ? (
            <button 
              onClick={() => {
                if(window.confirm("ნამდვილად გსურთ მატჩის დასრულება? ეს მოქმედება განაახლებს ცხრილს.")) {
                  handleSubmit(false);
                }
              }}
              disabled={submitting}
              className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "იგზავნება..." : <><FaCheck /> მატჩის დასრულება</>}
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              დახურვა
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default MatchReportForm;
