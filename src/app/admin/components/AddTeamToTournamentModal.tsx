import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { Team, AgeCategory } from "@/types/admin";
import Modal from "./Modal";
import Button from "./Button";

interface AddTeamToTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  ageCategory: AgeCategory;
  currentTeams: Team[];
  onTeamAdded: () => void;
}

const AddTeamToTournamentModal = ({
  isOpen,
  onClose,
  tournamentId,
  ageCategory,
  currentTeams,
  onTeamAdded,
}: AddTeamToTournamentModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, ageCategory]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass ageCategory to filter teams by category suitable for this tournament section
      const results = await adminService.searchTeams(searchTerm, ageCategory);
      setSearchResults(results);
    } catch (err: any) {
      console.error("Search failed:", err);
      setError("Failed to search teams");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeam = async (team: Team) => {
    try {
      setAssigningId(team.id);
      setError(null);
      await adminService.assignTeamToTournament(team.id, tournamentId);
      onTeamAdded();
      onClose();
      // Reset state
      setSearchTerm("");
      setSearchResults([]);
    } catch (err: any) {
      setError(err.message || "Failed to add team to tournament");
    } finally {
      setAssigningId(null);
    }
  };

  // Helper to check if team is already in the list
  const isTeamAdded = (teamId: string) => {
    return currentTeams.some((t) => t.id === teamId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team to Tournament">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Team
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type team name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <p className="mt-1 text-xs text-gray-500">
            Scanning for teams in {ageCategory} category
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-800 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <div className="max-h-60 overflow-y-auto border rounded-md border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {searchResults.map((team) => {
                const added = isTeamAdded(team.id);
                return (
                  <div
                    key={team.id}
                    className="p-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {team.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Coach: {team.coach || "N/A"}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssignTeam(team)}
                      disabled={added || assigningId === team.id}
                      variant={added ? "secondary" : "primary"}
                    >
                      {assigningId === team.id
                        ? "Adding..."
                        : added
                        ? "Added"
                        : "Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No teams found</div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
        
        <div className="pt-2 flex justify-end">
             <Button variant="secondary" onClick={onClose}>
                Cancel
             </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTeamToTournamentModal;
