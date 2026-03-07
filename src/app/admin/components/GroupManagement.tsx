import React, { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { Group, AgeCategory } from "@/types/admin";
import { FaPlus, FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";

interface GroupManagementProps {
  tournamentId: string;
  ageCategory: AgeCategory;
}

const GroupManagement: React.FC<GroupManagementProps> = ({ tournamentId, ageCategory }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState<Group | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await adminService.getGroups(tournamentId, ageCategory);
      setGroups(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch groups";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, ageCategory]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setProcessing("create");
    setError(null);
    try {
      await adminService.createGroup({
        name: newGroupName.trim(),
        tournamentId,
        ageCategory,
      });
      setNewGroupName("");
      setCreating(false);
      fetchGroups();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create group";
      setError(msg);
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (groupId: string) => {
    setProcessing(groupId);
    setError(null);
    setConfirmDelete(null);
    try {
      await adminService.deleteGroup(groupId);
      fetchGroups();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete group";
      setError(msg);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Groups</h2>
          <p className="text-sm text-gray-500 mt-1">{ageCategory.replace("_", "-")} • {groups.length} groups</p>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-lg shadow-blue-200 transition-all"
          >
            <FaPlus size={12} /> Add Group
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <FaTimes className="text-red-500" />
          {error}
        </div>
      )}

      {creating && (
        <form onSubmit={handleCreate} className="mb-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Group Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              required
              className="flex-1 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              placeholder="e.g. Group A"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={processing === "create"}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 text-sm font-semibold shadow-lg shadow-blue-200 transition-all"
            >
              {processing === "create" ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => { setCreating(false); setNewGroupName(""); }}
              className="px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm font-medium">No groups created yet</p>
          <p className="text-xs mt-1">Create groups to organize teams for this tournament.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group/card">
              <div>
                <div className="font-bold text-gray-900">{group.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{group.matches?.length || 0} matches • {group.standings?.length || 0} teams</div>
              </div>
              <button
                onClick={() => setConfirmDelete(group)}
                disabled={processing === group.id}
                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover/card:opacity-100"
                title="Delete group"
              >
                {processing === group.id ? (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaTrash size={14} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <FaExclamationTriangle className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Group</h3>
                <p className="text-xs text-gray-500">Related matches and standings may be affected</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">{confirmDelete.name}</span>? 
              This will affect {confirmDelete.matches?.length || 0} matches and {confirmDelete.standings?.length || 0} team standings.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition flex items-center justify-center gap-2"
              >
                <FaTrash className="text-xs" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
