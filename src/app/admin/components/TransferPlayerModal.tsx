"use client";

import React, { useState, useEffect } from "react";
import { schoolService } from "@/services/school.service";
import type { FootballSchool, SchoolTeam } from "@/types/school.types";
import type { Player } from "@/types/admin";
import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import type { ApiResponse } from "@/types/admin";
import AgeCategoryBadge from "./AgeCategoryBadge";
import Button from "./Button";

interface TransferPlayerModalProps {
  school: FootballSchool;
  onSuccess: () => void;
  onClose: () => void;
}

const TransferPlayerModal: React.FC<TransferPlayerModalProps> = ({
  school,
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [fromTeamId, setFromTeamId] = useState("");
  const [toTeamId, setToTeamId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [reason, setReason] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const teams: SchoolTeam[] = school.teams || [];

  useEffect(() => {
    if (fromTeamId) {
      const fetchPlayers = async () => {
        try {
          setPlayersLoading(true);
          const response = await axiosInstance.get<ApiResponse<Player[]>>(
            `${API_PATHS.PLAYERS.GET_PLAYERS}?teamId=${fromTeamId}`
          );
          setPlayers(response.data.data || []);
        } catch (err) {
          console.error("Failed to fetch players:", err);
          setPlayers([]);
        } finally {
          setPlayersLoading(false);
        }
      };
      fetchPlayers();
      setPlayerId("");
      setToTeamId("");
    }
  }, [fromTeamId]);

  const handleSubmit = async () => {
    setError(null);
    try {
      setLoading(true);
      await schoolService.transferPlayer(school.id, {
        playerId,
        fromTeamId,
        toTeamId,
        reason: reason.trim() || undefined,
      });
      setSuccess(true);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "შეცდომა გადაყვანისას");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const player = players.find((p) => p.id === playerId);
    const fromTeam = teams.find((t) => t.id === fromTeamId);
    const toTeam = teams.find((t) => t.id === toTeamId);
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">გადაყვანა წარმატებულია!</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">{player?.name}</span></p>
          <p>{fromTeam?.name} → {toTeam?.name}</p>
        </div>
        <Button onClick={onClose}>დახურვა</Button>
      </div>
    );
  }

  const selectedPlayer = players.find((p) => p.id === playerId);

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step === s
                  ? "bg-blue-600 text-white"
                  : step > s
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s ? "✓" : s}
            </div>
            {s < 3 && (
              <div className={`w-8 h-0.5 ${step > s ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Select from team */}
      {step === 1 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">გუნდის არჩევა (საიდან)</h4>
          {teams.length === 0 ? (
            <p className="text-sm text-gray-400 italic">სკოლას გუნდები არ აქვს</p>
          ) : (
            <div className="space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => { setFromTeamId(team.id); setStep(2); }}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                    fromTeamId === team.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{team.name}</span>
                    <AgeCategoryBadge category={team.ageCategory} />
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select player */}
      {step === 2 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">მოთამაშის არჩევა</h4>
          {playersLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : players.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">
              ამ გუნდში მოთამაშეები არ არის
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => { setPlayerId(player.id); setStep(3); }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    playerId === player.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{player.name}</span>
                    {player.shirtNumber && (
                      <span className="text-xs text-gray-400 font-mono">#{player.shirtNumber}</span>
                    )}
                    {player.position && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {player.position}
                      </span>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Select destination team + reason */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <span className="font-medium">{selectedPlayer?.name}</span>
            <span className="text-gray-500"> — {teams.find((t) => t.id === fromTeamId)?.name}</span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">დანიშნულების გუნდი (სად)</h4>
            <div className="space-y-2">
              {teams
                .filter((t) => t.id !== fromTeamId)
                .map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setToTeamId(team.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      toTeamId === team.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{team.name}</span>
                      <AgeCategoryBadge category={team.ageCategory} />
                    </div>
                    {toTeamId === team.id && (
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                      </svg>
                    )}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">მიზეზი (არასავალდებულო)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              placeholder="გადაყვანის მიზეზი..."
            />
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-2">
        <Button
          variant="secondary"
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onClose();
          }}
        >
          {step === 1 ? "გაუქმება" : "უკან"}
        </Button>

        {step === 3 && (
          <Button onClick={handleSubmit} disabled={!toTeamId || loading}>
            {loading ? "მიმდინარეობს..." : "გადაყვანა"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransferPlayerModal;
