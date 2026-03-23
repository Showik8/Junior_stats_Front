import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Player, Match } from "@/types/admin";
import { MatchLineup, MatchLineupPlayer, LineupRole, LineupStatus } from "@/types/lineup.types";
import { lineupService } from "@/services/lineup.service";
import { adminService } from "@/services/adminService";
import {
  FaTimes, FaCheck, FaUsers, FaStar,
  FaExchangeAlt, FaUserPlus, FaUserMinus, FaShieldAlt,
  FaLock, FaClock, FaCheckCircle, FaSpinner
} from "react-icons/fa";

interface LineupFormProps {
  match: Match;
  teamId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const POSITION_GROUPS = [
  { label: "GK", value: "GK" },
  { label: "DEF", value: "DEF" },
  { label: "MID", value: "MID" },
  { label: "FWD", value: "FWD" },
];

const MIN_STARTING = 7;
const MAX_STARTING = 11;
const MAX_SUBS = 12;

const LineupForm: React.FC<LineupFormProps> = ({ match, teamId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [lineup, setLineup] = useState<MatchLineup | null>(null);

  // Selection state
  const [selectedPlayers, setSelectedPlayers] = useState<Map<string, {
    role: LineupRole;
    startingOrder?: number;
    isCaptain: boolean;
    positionOverride?: string;
  }>>(new Map());

  const isLocked = lineup?.status === "LOCKED";
  const isSubmitted = lineup?.status === "SUBMITTED";
  const isReadOnly = isLocked;

  const opponentName = match.homeTeamId === teamId
    ? match.awayTeam?.name
    : match.homeTeam?.name;
  const teamName = match.homeTeamId === teamId
    ? match.homeTeam?.name
    : match.awayTeam?.name;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [players, lineupData] = await Promise.all([
          adminService.getTeamPlayers(teamId),
          lineupService.getTeamLineup(match.id, teamId),
        ]);
        setAllPlayers(players);
        setLineup(lineupData);

        // Populate selectedPlayers from existing lineup
        if (lineupData.players && lineupData.players.length > 0) {
          const map = new Map<string, { role: LineupRole; startingOrder?: number; isCaptain: boolean; positionOverride?: string }>();
          lineupData.players.forEach((lp: MatchLineupPlayer) => {
            map.set(lp.playerId, {
              role: lp.role,
              startingOrder: lp.startingOrder,
              isCaptain: lp.isCaptain,
              positionOverride: lp.positionOverride,
            });
          });
          setSelectedPlayers(map);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [match.id, teamId]);

  // Computed
  const startingPlayers = useMemo(() => {
    return Array.from(selectedPlayers.entries())
      .filter(([, v]) => v.role === "STARTING")
      .map(([id, v]) => ({ ...v, playerId: id, player: allPlayers.find(p => p.id === id) }))
      .sort((a, b) => (a.startingOrder || 99) - (b.startingOrder || 99));
  }, [selectedPlayers, allPlayers]);

  const substitutePlayers = useMemo(() => {
    return Array.from(selectedPlayers.entries())
      .filter(([, v]) => v.role === "SUBSTITUTE")
      .map(([id, v]) => ({ ...v, playerId: id, player: allPlayers.find(p => p.id === id) }));
  }, [selectedPlayers, allPlayers]);

  const unselectedPlayers = useMemo(() => {
    return allPlayers.filter(p => !selectedPlayers.has(p.id));
  }, [allPlayers, selectedPlayers]);

  const startingCount = startingPlayers.length;
  const subCount = substitutePlayers.length;
  const canSubmit = startingCount >= MIN_STARTING && startingCount <= MAX_STARTING && subCount <= MAX_SUBS && !isReadOnly;

  // Handlers
  const togglePlayer = useCallback((playerId: string) => {
    if (isReadOnly) return;
    setSelectedPlayers(prev => {
      const next = new Map(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        // Auto-assign: STARTING until 11, then SUBSTITUTE until 7, then RESERVE
        const currentStarting = Array.from(next.values()).filter(v => v.role === "STARTING").length;
        const currentSub = Array.from(next.values()).filter(v => v.role === "SUBSTITUTE").length;

        let role: LineupRole = "RESERVE";
        let startingOrder: number | undefined;

        if (currentStarting < MAX_STARTING) {
          role = "STARTING";
          startingOrder = currentStarting + 1;
        } else if (currentSub < MAX_SUBS) {
          role = "SUBSTITUTE";
        }

        next.set(playerId, { role, startingOrder, isCaptain: false });
      }
      return next;
    });
  }, [isReadOnly]);

  const changeRole = useCallback((playerId: string, newRole: LineupRole) => {
    if (isReadOnly) return;
    setSelectedPlayers(prev => {
      const next = new Map(prev);
      const existing = next.get(playerId);
      if (!existing) return prev;

      if (newRole === "STARTING") {
        const currentStarting = Array.from(next.values()).filter(v => v.role === "STARTING").length;
        if (currentStarting >= MAX_STARTING) return prev;
        next.set(playerId, { ...existing, role: "STARTING", startingOrder: currentStarting + 1 });
      } else {
        next.set(playerId, { ...existing, role: newRole, startingOrder: undefined });
      }
      return next;
    });
  }, [isReadOnly]);

  const toggleCaptain = useCallback((playerId: string) => {
    if (isReadOnly) return;
    setSelectedPlayers(prev => {
      const next = new Map(prev);
      // Remove captain from all
      next.forEach((v, k) => {
        if (v.isCaptain) next.set(k, { ...v, isCaptain: false });
      });
      const existing = next.get(playerId);
      if (existing) {
        next.set(playerId, { ...existing, isCaptain: true });
      }
      return next;
    });
  }, [isReadOnly]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const players = Array.from(selectedPlayers.entries()).map(([playerId, v]) => ({
        playerId,
        role: v.role,
        startingOrder: v.role === "STARTING" ? v.startingOrder : undefined,
        isCaptain: v.isCaptain,
        positionOverride: v.positionOverride,
      }));

      await lineupService.submitLineup(match.id, teamId, { players });
      setSuccessMsg("შემადგენლობა წარმატებით გაიგზავნა!");
      setLineup(prev => prev ? { ...prev, status: "SUBMITTED" as LineupStatus } : prev);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit lineup");
    } finally {
      setSubmitting(false);
    }
  };

  // Status badge
  const getStatusBadge = () => {
    if (!lineup) return null;
    switch (lineup.status) {
      case "LOCKED":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700">
            <FaLock className="text-[10px]" /> ჩაკეტილი
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <FaCheckCircle className="text-[10px]" /> გაგზავნილი
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500">
            <FaClock className="text-[10px]" /> მოლოდინში
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <FaSpinner className="animate-spin text-3xl text-blue-500 mb-3" />
        <p className="text-sm text-gray-400">მონაცემების ჩატვირთვა...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[90vh] bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="z-10">
          <h2 className="text-lg font-bold text-white">შემადგენლობა</h2>
          <p className="text-xs text-white/60">
            {teamName} vs {opponentName} · {new Date(match.date).toLocaleDateString("ka-GE")}
          </p>
        </div>
        <div className="flex items-center gap-3 z-10">
          {getStatusBadge()}
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-bold text-gray-700">სასტარტო: {startingCount}/{MAX_STARTING} (მინ. {MIN_STARTING})</span>
          <span className="text-gray-500">სათადარიგო: {subCount}/{MAX_SUBS}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              startingCount >= MIN_STARTING && startingCount <= MAX_STARTING ? "bg-emerald-500" : startingCount > MAX_STARTING ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min((startingCount / MAX_STARTING) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm flex items-center gap-2">
          <FaTimes className="shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><FaTimes /></button>
        </div>
      )}
      {successMsg && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm flex items-center gap-2">
          <FaCheckCircle className="shrink-0" /> {successMsg}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Starting XI */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
              <FaUsers className="text-emerald-600 text-[10px]" />
            </div>
            სასტარტო შემადგენლობა ({startingCount}/{MAX_STARTING})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {startingPlayers.map(({ playerId, player, startingOrder, isCaptain }) => (
              <div
                key={playerId}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCaptain
                    ? "bg-amber-50 border-amber-200"
                    : "bg-emerald-50/50 border-emerald-100"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  {startingOrder || "—"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900 truncate">{player?.name || "—"}</span>
                    {isCaptain && <FaStar className="text-amber-500 text-[10px] shrink-0" />}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    #{player?.shirtNumber || "?"} · {player?.position || "—"}
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleCaptain(playerId)}
                      className={`p-1.5 rounded-lg text-[10px] transition-all ${
                        isCaptain ? "bg-amber-200 text-amber-700" : "bg-white/60 text-gray-400 hover:text-amber-500"
                      }`}
                      title="კაპიტანი"
                    >
                      <FaStar />
                    </button>
                    <button
                      onClick={() => changeRole(playerId, "SUBSTITUTE")}
                      className="p-1.5 rounded-lg bg-white/60 text-gray-400 hover:text-blue-500 text-[10px] transition-all"
                      title="სათადარიგოში"
                    >
                      <FaExchangeAlt />
                    </button>
                    <button
                      onClick={() => togglePlayer(playerId)}
                      className="p-1.5 rounded-lg bg-white/60 text-gray-400 hover:text-red-500 text-[10px] transition-all"
                      title="ამოშლა"
                    >
                      <FaUserMinus />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {startingCount < MAX_STARTING && !isReadOnly && (
              <div className="flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 text-sm">
                <FaUserPlus className="mr-2" /> {MAX_STARTING - startingCount} ადგილი დარჩენილი
              </div>
            )}
          </div>
        </div>

        {/* Substitutes */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaExchangeAlt className="text-blue-600 text-[10px]" />
            </div>
            სათადარიგო ({subCount}/{MAX_SUBS})
          </h3>
          {substitutePlayers.length === 0 && (
            <p className="text-xs text-gray-400 italic">სათადარიგო მოთამაშეები არ არის შერჩეული</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {substitutePlayers.map(({ playerId, player }) => (
              <div
                key={playerId}
                className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/30 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-400 text-white flex items-center justify-center text-xs font-bold">
                  #{player?.shirtNumber || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate block">{player?.name || "—"}</span>
                  <span className="text-[10px] text-gray-400">{player?.position || "—"}</span>
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => changeRole(playerId, "STARTING")}
                      className="p-1.5 rounded-lg bg-white/60 text-gray-400 hover:text-emerald-500 text-[10px] transition-all"
                      title="სასტარტოში"
                    >
                      <FaExchangeAlt />
                    </button>
                    <button
                      onClick={() => togglePlayer(playerId)}
                      className="p-1.5 rounded-lg bg-white/60 text-gray-400 hover:text-red-500 text-[10px] transition-all"
                      title="ამოშლა"
                    >
                      <FaUserMinus />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Available Players */}
        {!isReadOnly && unselectedPlayers.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                <FaShieldAlt className="text-gray-400 text-[10px]" />
              </div>
              ხელმისაწვდომი მოთამაშეები ({unselectedPlayers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {unselectedPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-blue-200 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {player.shirtNumber || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate block">{player.name}</span>
                    <span className="text-[10px] text-gray-400">{player.position || "—"}</span>
                  </div>
                  <FaUserPlus className="text-gray-300 group-hover:text-blue-400 text-xs transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
        <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
          დახურვა
        </button>
        {!isReadOnly && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
              canSubmit && !submitting
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin text-xs" /> იგზავნება...
              </>
            ) : (
              <>
                <FaCheck className="text-xs" /> 
                {isSubmitted ? "განახლება" : "შემადგენლობის გაგზავნა"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default LineupForm;
