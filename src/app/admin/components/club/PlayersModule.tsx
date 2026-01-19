import React, { useState, useEffect } from "react";
import { Team, Player } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaUserPlus, FaFileImport, FaTrash, FaEdit, FaUser, FaUsers } from "react-icons/fa";

interface PlayersModuleProps {
  team: Team | null;
}

const PlayersModule: React.FC<PlayersModuleProps> = ({ team }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    shirtNumber: "",
    position: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPlayers = async () => {
    if (!team) return;
    try {
      setLoading(true);
      const data = await adminService.getTeamPlayers(team.id);
      setPlayers(data);
    } catch (err) {
      console.error("Failed to fetch players", err);
      setError("Failed to load players.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [team]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    
    try {
        setSubmitting(true);
        await adminService.addPlayer({
            name: newPlayer.name,
            teamId: team.id,
            shirtNumber: newPlayer.shirtNumber ? parseInt(newPlayer.shirtNumber) : null,
            position: newPlayer.position
        });
        setIsAddModalOpen(false);
        setNewPlayer({ name: "", shirtNumber: "", position: "" });
        fetchPlayers();
    } catch (err: any) {
        alert("Failed to add player: " + err.message);
    } finally {
        setSubmitting(false);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
      if (!confirm("Are you sure you want to remove this player?")) return;
      try {
          await adminService.removePlayer(playerId);
          fetchPlayers();
      } catch (err: any) {
          alert("Failed to  remove player: " + err.message);
      }
  };

  if (!team) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Players Management</h1>
           <p className="mt-1 text-sm text-gray-500">Manage your squad for the {team.ageCategory.replace('_', '-')} category.</p>
        </div>
        <div className="flex gap-3">
             <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
                onClick={() => alert("Bulk import feature coming soon!")}
             >
                 <FaFileImport />
                 <span>Import CSV</span>
             </button>
             <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition"
             >
                 <FaUserPlus />
                 <span>Add Player</span>
             </button>
        </div>
      </div>

      {loading ? (
           <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           </div>
      ) : players.length === 0 ? (
           <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
               <div className="mx-auto h-12 w-12 text-gray-400 mb-3"><FaUsers className="text-4xl" /></div>
               <h3 className="text-lg font-medium text-gray-900">No players yet</h3>
               <p className="text-gray-500 mt-1">Get started by adding players to your team roster.</p>
               <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 text-blue-600 font-medium hover:underline"
               >
                   Add your first player
               </button>
           </div>
      ) : (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-500">
                       <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                           <tr>
                               <th className="px-6 py-4 font-semibold">Player</th>
                               <th className="px-6 py-4 font-semibold">Number</th>
                               <th className="px-6 py-4 font-semibold">Position</th>
                               <th className="px-6 py-4 font-semibold">Status</th>
                               <th className="px-6 py-4 font-semibold text-right">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-200">
                           {players.map((player) => (
                               <tr key={player.id} className="hover:bg-gray-50 transition">
                                   <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                           <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                               <FaUser />
                                           </div>
                                           <div>
                                               <p className="font-semibold text-gray-900">{player.name}</p>
                                               {/* Birth year would go here if available */}
                                           </div>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4">
                                       {player.shirtNumber ? (
                                           <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 font-bold text-gray-700">
                                               {player.shirtNumber}
                                           </span>
                                       ) : (
                                           <span className="text-gray-400">-</span>
                                       )}
                                   </td>
                                   <td className="px-6 py-4">
                                       {player.position ? (
                                           <span className="capitalize">{player.position}</span>
                                       ) : (
                                           <span className="text-gray-400">-</span>
                                       )}
                                   </td>
                                   <td className="px-6 py-4">
                                       <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                           Active
                                       </span>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                       <div className="flex justify-end gap-2">
                                           <button 
                                                className="p-1 text-gray-400 hover:text-blue-600 transition"
                                                title="Edit"
                                                onClick={() => alert("Edit feature coming next update")}
                                           >
                                               <FaEdit />
                                           </button>
                                           <button 
                                                className="p-1 text-gray-400 hover:text-red-600 transition"
                                                title="Remove"
                                                onClick={() => handleDeletePlayer(player.id)}
                                           >
                                               <FaTrash />
                                           </button>
                                       </div>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
      )}

      {/* Add Player Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Player</h2>
                  <form onSubmit={handleAddPlayer} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input 
                              type="text"
                              required
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              value={newPlayer.name}
                              onChange={e => setNewPlayer({...newPlayer, name: e.target.value})}
                              placeholder="e.g. John Doe"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                              <input 
                                  type="number"
                                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  value={newPlayer.shirtNumber}
                                  onChange={e => setNewPlayer({...newPlayer, shirtNumber: e.target.value})}
                                  placeholder="10"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                              <select 
                                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                  value={newPlayer.position}
                                  onChange={e => setNewPlayer({...newPlayer, position: e.target.value})}
                              >
                                  <option value="">Select...</option>
                                  <option value="Goalkeeper">Goalkeeper</option>
                                  <option value="Defender">Defender</option>
                                  <option value="Midfielder">Midfielder</option>
                                  <option value="Forward">Forward</option>
                              </select>
                          </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 mt-6">
                          <button 
                              type="button"
                              onClick={() => setIsAddModalOpen(false)}
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              disabled={submitting}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
                          >
                              {submitting ? "Adding..." : "Add Player"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default PlayersModule;
