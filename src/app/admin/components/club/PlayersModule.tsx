import React, { useState, useEffect, useCallback } from "react";
import { Team, Player } from "@/types/admin";
import { adminService } from "@/services/adminService";
import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaUsers,
  FaSearch,
  FaTshirt,
  FaBirthdayCake,
  FaTimes,
  FaSave,
} from "react-icons/fa";

interface PlayersModuleProps {
  team: Team | null;
}

const positionConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Goalkeeper: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Defender: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Midfielder: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Forward: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

const PlayersModule: React.FC<PlayersModuleProps> = ({ team }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    shirtNumber: "",
    position: "",
    photoUrl: "",
    birthDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Modal
  const [editTarget, setEditTarget] = useState<Player | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    shirtNumber: "",
    position: "",
    photoUrl: "",
    birthDate: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPlayers = useCallback(async () => {
    if (!team) return;
    try {
      setLoading(true);
      const data = await adminService.getTeamPlayers(team.id);
      setPlayers(data);
    } catch (err) {
      console.error("Failed to fetch players", err);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    try {
      setSubmitting(true);
      setFormError(null);
      await adminService.addPlayer({
        name: newPlayer.name,
        teamId: team.id,
        shirtNumber: newPlayer.shirtNumber
          ? parseInt(newPlayer.shirtNumber)
          : null,
        position: newPlayer.position || null,
        photoUrl: newPlayer.photoUrl || null,
        birthDate: newPlayer.birthDate || null,
      });
      setIsAddModalOpen(false);
      setNewPlayer({
        name: "",
        shirtNumber: "",
        position: "",
        photoUrl: "",
        birthDate: "",
      });
      fetchPlayers();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Failed to add player"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (player: Player) => {
    setEditTarget(player);
    setEditData({
      name: player.name,
      shirtNumber: player.shirtNumber?.toString() || "",
      position: player.position || "",
      photoUrl: player.photoUrl || "",
      birthDate: player.birthDate
        ? new Date(player.birthDate).toISOString().split("T")[0]
        : "",
    });
    setEditError(null);
  };

  const handleEditPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      setEditSubmitting(true);
      setEditError(null);
      await adminService.updatePlayer(editTarget.id, {
        name: editData.name,
        shirtNumber: editData.shirtNumber
          ? parseInt(editData.shirtNumber)
          : null,
        position: editData.position || null,
        photoUrl: editData.photoUrl || null,
        birthDate: editData.birthDate || null,
      });
      setEditTarget(null);
      fetchPlayers();
    } catch (err: unknown) {
      setEditError(
        err instanceof Error ? err.message : "Failed to update player"
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeletePlayer = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminService.removePlayer(deleteTarget.id);
      setDeleteTarget(null);
      fetchPlayers();
    } catch (err) {
      console.error("Failed to delete player:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const positionCounts = players.reduce(
    (acc, p) => {
      const pos = p.position || "Unknown";
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  if (!team) return null;

  // Reusable form fields component
  const PlayerFormFields = ({
    data,
    setData,
    error,
  }: {
    data: typeof newPlayer;
    setData: (d: typeof newPlayer) => void;
    error: string | null;
  }) => (
    <>
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="e.g. John Doe"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Jersey #
          </label>
          <div className="relative">
            <FaTshirt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="number"
              className="w-full pl-9 pr-4 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={data.shirtNumber}
              onChange={(e) =>
                setData({ ...data, shirtNumber: e.target.value })
              }
              placeholder="10"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Position
          </label>
          <select
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
            value={data.position}
            onChange={(e) => setData({ ...data, position: e.target.value })}
          >
            <option value="">Select...</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Photo URL
        </label>
        <input
          type="url"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={data.photoUrl}
          onChange={(e) => setData({ ...data, photoUrl: e.target.value })}
          placeholder="https://example.com/photo.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Birth Date
        </label>
        <input
          type="date"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={data.birthDate}
          onChange={(e) => setData({ ...data, birthDate: e.target.value })}
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Squad Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {players.length} player{players.length !== 1 ? "s" : ""} registered
            for {team.ageCategory.replace("_", "-")}
          </p>
        </div>
        <button
          onClick={() => {
            setIsAddModalOpen(true);
            setFormError(null);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all"
        >
          <FaUserPlus />
          Add Player
        </button>
      </div>

      {/* Position summary */}
      {players.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(positionCounts).map(([pos, count]) => {
            const config = positionConfig[pos] || {
              color: "text-gray-700",
              bg: "bg-gray-50",
              border: "border-gray-200",
            };
            return (
              <span
                key={pos}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${config.bg} ${config.border}`}
              >
                {pos}: {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Search + View toggle */}
      {players.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Table
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gray-200" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <FaUsers className="text-2xl text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No players yet
          </h3>
          <p className="text-gray-500 mt-1 text-sm">
            Get started by adding players to your team roster.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition"
          >
            <FaUserPlus />
            Add your first player
          </button>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FaSearch className="mx-auto mb-2 text-xl opacity-30" />
          <p className="text-sm">
            No players match &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => {
            const posConfig = positionConfig[player.position || ""] || {
              color: "text-gray-600",
              bg: "bg-gray-50",
              border: "border-gray-200",
            };
            return (
              <div
                key={player.id}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                {player.shirtNumber && (
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {player.shirtNumber}
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    {player.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="h-16 w-16 rounded-full object-cover ring-3 ring-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
                        <span className="text-xl font-bold text-white">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {player.name}
                  </h3>
                  {player.position && (
                    <span
                      className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${posConfig.color} ${posConfig.bg} ${posConfig.border}`}
                    >
                      {player.position}
                    </span>
                  )}
                  {player.birthDate && (
                    <p className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                      <FaBirthdayCake />
                      {getAge(player.birthDate)} years old
                    </p>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-2xl">
                  <button
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs"
                    title="Edit"
                    onClick={() => openEditModal(player)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-xs"
                    title="Remove"
                    onClick={() => setDeleteTarget(player)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">#</th>
                  <th className="px-5 py-3.5 font-semibold">Player</th>
                  <th className="px-5 py-3.5 font-semibold">Position</th>
                  <th className="px-5 py-3.5 font-semibold">Age</th>
                  <th className="px-5 py-3.5 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlayers.map((player) => {
                  const posConfig = positionConfig[player.position || ""] || {
                    color: "text-gray-600",
                    bg: "bg-gray-50",
                    border: "border-gray-200",
                  };
                  return (
                    <tr
                      key={player.id}
                      className="hover:bg-gray-50/50 transition group"
                    >
                      <td className="px-5 py-3.5">
                        {player.shirtNumber ? (
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gray-900 text-white text-xs font-bold">
                            {player.shirtNumber}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {player.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={player.photoUrl}
                              alt={player.name}
                              className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-semibold text-gray-900">
                            {player.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {player.position ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${posConfig.color} ${posConfig.bg} ${posConfig.border}`}
                          >
                            {player.position}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {player.birthDate ? (
                          <span>{getAge(player.birthDate)} yrs</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Edit"
                            onClick={() => openEditModal(player)}
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Remove"
                            onClick={() => setDeleteTarget(player)}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====== ADD PLAYER MODAL ====== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FaUserPlus />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Add New Player
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              <PlayerFormFields
                data={newPlayer}
                setData={setNewPlayer}
                error={formError}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {submitting ? "Adding..." : "Add Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== EDIT PLAYER MODAL ====== */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => setEditTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <FaEdit />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Edit Player
                  </h2>
                  <p className="text-xs text-gray-500">{editTarget.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditPlayer} className="p-6 space-y-4">
              <PlayerFormFields
                data={editData}
                setData={setEditData}
                error={editError}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                  {editSubmitting && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  <FaSave />
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== DELETE CONFIRMATION ====== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
                <FaTrash className="text-red-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Remove Player
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-gray-800">
                  {deleteTarget.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlayer}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-50"
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersModule;
