"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { adminService } from "@/services/adminService";
import { Team, Player, Match } from "@/types/admin";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { removeToken } from "@/app/utils/auth";

const TeamDashboard = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    position: "",
    shirtNumber: "",
  });
  const [playerErrors, setPlayerErrors] = useState<{
    name?: string;
    position?: string;
    shirtNumber?: string;
    general?: string;
  }>({});

  // Loading states
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamData = await adminService.getMyTeamInfo();
      setTeam(teamData);

      if (teamData && teamData.id) {
        const [playersData, matchesData] = await Promise.all([
          adminService.getTeamPlayers(teamData.id),
          adminService.getTeamMatches(teamData.id),
        ]);
        setPlayers(playersData || []);
        setMatches(matchesData || []);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch team data:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch team data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validatePlayerData = (): {
    isValid: boolean;
    errors: typeof playerErrors;
  } => {
    const errors: typeof playerErrors = {};

    if (!newPlayer.name || !newPlayer.name.trim()) {
      errors.name = "Player name is required";
    } else if (newPlayer.name.trim().length < 2) {
      errors.name = "Player name must be at least 2 characters";
    } else if (newPlayer.name.trim().length > 100) {
      errors.name = "Player name must be less than 100 characters";
    }

    if (newPlayer.position && newPlayer.position.trim().length > 50) {
      errors.position = "Position must be less than 50 characters";
    }

    if (newPlayer.shirtNumber) {
      const number = Number(newPlayer.shirtNumber);
      if (isNaN(number) || !Number.isInteger(number)) {
        errors.shirtNumber = "Shirt number must be a valid integer";
      } else if (number < 1 || number > 99) {
        errors.shirtNumber = "Shirt number must be between 1 and 99";
      }
      // Check for duplicate shirt number in current players list
      const duplicate = players.find(
        (p) => p.shirtNumber === number && p.id !== newPlayer.name // Check by number only
      );
      if (duplicate) {
        errors.shirtNumber = `Shirt number ${number} is already taken`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleAddPlayer = async () => {
    if (!team) return;

    // Validate player data
    const validation = validatePlayerData();
    if (!validation.isValid) {
      setPlayerErrors(validation.errors);
      return;
    }

    setIsAddingPlayer(true);
    setPlayerErrors({});

    try {
      await adminService.addPlayer({
        name: newPlayer.name.trim(),
        position: newPlayer.position.trim() || null,
        shirtNumber: newPlayer.shirtNumber
          ? Number(newPlayer.shirtNumber)
          : null,
        teamId: team.id,
      });
      setNewPlayer({ name: "", position: "", shirtNumber: "" });
      setIsAddPlayerOpen(false);
      // Refresh players list
      const updatedPlayers = await adminService.getTeamPlayers(team.id);
      setPlayers(updatedPlayers);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Failed to add player. Please try again.";
      setPlayerErrors({ general: errorMessage });
    } finally {
      setIsAddingPlayer(false);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (
      !team ||
      !confirm(
        "Are you sure you want to remove this player? This action cannot be undone."
      )
    )
      return;

    setRemovingPlayerId(playerId);
    try {
      await adminService.removePlayer(playerId);
      const updatedPlayers = await adminService.getTeamPlayers(team.id);
      setPlayers(updatedPlayers);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Failed to remove player. Please try again.";
      alert(errorMessage);
    } finally {
      setRemovingPlayerId(null);
    }
  };

  const handleClosePlayerModal = () => {
    setIsAddPlayerOpen(false);
    setNewPlayer({ name: "", position: "", shirtNumber: "" });
    setPlayerErrors({});
  };

  const logout = () => {
    removeToken();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading team dashboard...
      </div>
    );
  if (error && !team) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }
  if (!team)
    return <div className="p-8 text-center text-red-500">Team not found</div>;

  const scheduledMatches = matches.filter((m) => m.status === "SCHEDULED");
  const playedMatches = matches.filter((m) => m.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              {/* Logo Placeholder */}
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                {team.logo ? (
                  <Image
                    src={team.logo}
                    alt={`${team.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xl">⚽</span>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{team.name}</h1>
            </div>
            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors focus:outline-none"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Team Info */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500 block mb-1">
                Team Name
              </span>
              <span className="text-base font-medium text-gray-900">
                {team.name}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">
                Age Category
              </span>
              <span className="text-base font-medium text-gray-900">
                {team.ageCategory || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">Coach</span>
              <span className="text-base font-medium text-gray-900">
                {team.coach || "Not Assigned"}
              </span>
            </div>
          </div>
        </section>

        {/* Players List */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Players</h2>
            <Button onClick={() => setIsAddPlayerOpen(true)}>
              + Add Player
            </Button>
          </div>

          <Table headers={["Number", "Player Name", "Position", "Actions"]}>
            {players.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No players added yet
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {player.shirtNumber !== null &&
                    player.shirtNumber !== undefined
                      ? `#${player.shirtNumber}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {player.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {player.position || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="danger"
                      onClick={() => handleRemovePlayer(player.id)}
                      disabled={removingPlayerId === player.id}
                    >
                      {removingPlayerId === player.id
                        ? "Removing..."
                        : "Remove"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </section>

        {/* Scheduled Matches */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Scheduled Matches
            </h2>
          </div>
          <Table headers={["Date", "Opponent", "Venue"]}>
            {scheduledMatches.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No upcoming matches
                </td>
              </tr>
            ) : (
              scheduledMatches.map((match) => {
                const isHome =
                  match.homeTeam?.id === team.id ||
                  match.homeTeamId === team.id;
                const opponent = isHome
                  ? match.awayTeam || { name: "Unknown Team" }
                  : match.homeTeam || { name: "Unknown Team" };
                return (
                  <tr key={match.id}>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(match.date).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      vs {opponent.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          isHome
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isHome ? "Home" : "Away"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </Table>
        </section>

        {/* Played Matches */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Played Matches
            </h2>
          </div>
          <Table headers={["Date", "Opponent", "Result"]}>
            {playedMatches.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No matches played yet
                </td>
              </tr>
            ) : (
              playedMatches.map((match) => {
                const isHome =
                  match.homeTeam?.id === team.id ||
                  match.homeTeamId === team.id;
                const opponent = isHome
                  ? match.awayTeam || { name: "Unknown Team" }
                  : match.homeTeam || { name: "Unknown Team" };
                return (
                  <tr key={match.id}>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(match.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      vs {opponent.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        Completed
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </Table>
        </section>
      </main>

      {/* Add Player Modal */}
      <Modal
        isOpen={isAddPlayerOpen}
        onClose={handleClosePlayerModal}
        title="Add New Player"
      >
        <div className="space-y-4">
          {playerErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{playerErrors.general}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 p-2 border ${
                playerErrors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={newPlayer.name}
              onChange={(e) => {
                setNewPlayer({ ...newPlayer, name: e.target.value });
                setPlayerErrors({
                  ...playerErrors,
                  name: undefined,
                  general: undefined,
                });
              }}
              placeholder="Enter player name"
              maxLength={100}
            />
            {playerErrors.name && (
              <p className="mt-1 text-sm text-red-600">{playerErrors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Required. 2-100 characters.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 p-2 border ${
                  playerErrors.position
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newPlayer.position}
                onChange={(e) => {
                  setNewPlayer({ ...newPlayer, position: e.target.value });
                  setPlayerErrors({ ...playerErrors, position: undefined });
                }}
                placeholder="e.g. GK, DEF, MID, FWD"
                maxLength={50}
              />
              {playerErrors.position && (
                <p className="mt-1 text-sm text-red-600">
                  {playerErrors.position}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional. Max 50 characters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shirt Number
              </label>
              <input
                type="number"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 p-2 border ${
                  playerErrors.shirtNumber
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newPlayer.shirtNumber}
                onChange={(e) => {
                  setNewPlayer({ ...newPlayer, shirtNumber: e.target.value });
                  setPlayerErrors({
                    ...playerErrors,
                    shirtNumber: undefined,
                    general: undefined,
                  });
                }}
                placeholder="1-99"
                min={1}
                max={99}
              />
              {playerErrors.shirtNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {playerErrors.shirtNumber}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional. Must be unique within team.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClosePlayerModal}
              disabled={isAddingPlayer}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPlayer}
              disabled={!newPlayer.name.trim() || isAddingPlayer}
            >
              {isAddingPlayer ? "Adding..." : "Add Player"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamDashboard;
