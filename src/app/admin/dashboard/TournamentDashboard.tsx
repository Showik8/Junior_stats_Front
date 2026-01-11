"use client";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Tournament, Team, Match, AgeCategory } from "@/types/admin";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Header from "../components/Header";
import AgeCategorySelector from "../components/AgeCategorySelector";

const TournamentDashboard = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<"teams" | "matches">("teams");
  const [selectedCategory, setSelectedCategory] = useState<AgeCategory>("U-10");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);

  // Form States with validation
  const [newTeamName, setNewTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState<string | null>(null);
  
  const [newMatchData, setNewMatchData] = useState({
    homeTeamId: "",
    awayTeamId: "",
    date: "",
  });
  const [matchErrors, setMatchErrors] = useState<{
    homeTeamId?: string;
    awayTeamId?: string;
    date?: string;
    general?: string;
  }>({});

  // Loading states for actions
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [removingTeamId, setRemovingTeamId] = useState<string | null>(null);
  const [cancelingMatchId, setCancelingMatchId] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [selectedCategory]); // Refetch when category changes

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tournamentData = await adminService.getTournamentInfo();
      
      if (tournamentData) {
        setTournament(tournamentData);
        await Promise.all([
          fetchTeams(tournamentData.id),
          fetchMatches(tournamentData.id)
        ]);
      } else {
        setError("No active tournament found");
      }
    } catch (err: any) {
      console.error("Failed to fetch tournament data:", err);
      setError(err.message || "Failed to fetch tournament data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (tournamentId: string) => {
    try {
      const data = await adminService.getTeams(tournamentId, selectedCategory);
      setTeams(data || []);
    } catch (e: any) {
      console.error("Failed to fetch teams:", e);
      setError(e.message || "Failed to fetch teams");
    }
  };

  const fetchMatches = async (tournamentId: string) => {
    try {
      const data = await adminService.getMatches(tournamentId, selectedCategory);
      setMatches(data || []);
    } catch (e: any) {
      console.error("Failed to fetch matches:", e);
      setError(e.message || "Failed to fetch matches");
    }
  };

  // Validation functions
  const validateTeamName = (name: string): string | null => {
    if (!name || !name.trim()) {
      return "Team name is required";
    }
    if (name.trim().length < 2) {
      return "Team name must be at least 2 characters";
    }
    if (name.trim().length > 100) {
      return "Team name must be less than 100 characters";
    }
    return null;
  };

  const validateMatchData = (): { isValid: boolean; errors: typeof matchErrors } => {
    const errors: typeof matchErrors = {};
    
    if (!newMatchData.homeTeamId) {
      errors.homeTeamId = "Home team is required";
    }
    if (!newMatchData.awayTeamId) {
      errors.awayTeamId = "Away team is required";
    }
    if (newMatchData.homeTeamId === newMatchData.awayTeamId && newMatchData.homeTeamId) {
      errors.general = "A team cannot play against itself";
    }
    if (!newMatchData.date) {
      errors.date = "Match date and time is required";
    } else {
      const selectedDate = new Date(newMatchData.date);
      const now = new Date();
      if (isNaN(selectedDate.getTime())) {
        errors.date = "Invalid date format";
      } else if (selectedDate < now) {
        errors.date = "Match date cannot be in the past";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleAddTeam = async () => {
    if (!tournament) return;

    // Validate team name
    const nameError = validateTeamName(newTeamName);
    if (nameError) {
      setTeamNameError(nameError);
      return;
    }

    setIsAddingTeam(true);
    setTeamNameError(null);

    try {
      await adminService.addTeam({
        name: newTeamName.trim(),
        tournamentId: tournament.id,
        ageCategory: selectedCategory,
      });
      setNewTeamName("");
      setIsAddTeamOpen(false);
      await fetchTeams(tournament.id);
    } catch (e: any) {
      setTeamNameError(e.message || "Failed to add team. Please try again.");
    } finally {
      setIsAddingTeam(false);
    }
  };

  const handleRemoveTeam = async (id: string) => {
    if (!tournament || !confirm("Are you sure you want to remove this team? This action cannot be undone.")) return;
    
    setRemovingTeamId(id);
    try {
      await adminService.removeTeam(id);
      await fetchTeams(tournament.id);
    } catch (e: any) {
      alert(e.message || "Failed to remove team. Please try again.");
    } finally {
      setRemovingTeamId(null);
    }
  };

  const handleCreateMatch = async () => {
    if (!tournament) return;

    // Validate match data
    const validation = validateMatchData();
    if (!validation.isValid) {
      setMatchErrors(validation.errors);
      return;
    }

    setIsCreatingMatch(true);
    setMatchErrors({});

    try {
      await adminService.createMatch({
        ...newMatchData,
        tournamentId: tournament.id,
      });
      setNewMatchData({ homeTeamId: "", awayTeamId: "", date: "" });
      setIsAddMatchOpen(false);
      await fetchMatches(tournament.id);
    } catch (e: any) {
      setMatchErrors({ general: e.message || "Failed to create match. Please try again." });
    } finally {
      setIsCreatingMatch(false);
    }
  };

  const handleCancelMatch = async (id: string) => {
    if (!tournament || !confirm("Are you sure you want to cancel this match?")) return;
    
    setCancelingMatchId(id);
    try {
      await adminService.cancelMatch(id);
      await fetchMatches(tournament.id);
    } catch (e: any) {
      alert(e.message || "Failed to cancel match. Please try again.");
    } finally {
      setCancelingMatchId(null);
    }
  };

  // Reset form errors when modal closes
  const handleCloseTeamModal = () => {
    setIsAddTeamOpen(false);
    setNewTeamName("");
    setTeamNameError(null);
  };

  const handleCloseMatchModal = () => {
    setIsAddMatchOpen(false);
    setNewMatchData({ homeTeamId: "", awayTeamId: "", date: "" });
    setMatchErrors({});
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error && !tournament) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchInitialData}>Retry</Button>
      </div>
    );
  }
  if (!tournament) return <div className="p-8 text-center text-red-500">No active tournament found.</div>;

  return (
  <>
    <Header tournament={tournament}/>
    <main className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
     
      <AgeCategorySelector 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("teams")}
          className={`pb-2 px-4 ${activeTab === "teams" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
        >
          Teams Management
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          className={`pb-2 px-4 ${activeTab === "matches" ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
        >
          Matches Management
        </button>
      </div>

      {/* Teams Content */}
      {activeTab === "teams" && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddTeamOpen(true)}>+ Add Team</Button>
          </div>
          <Table headers={["Team Name", "Coach", "Actions"]}>
            {teams.length === 0 ? (
               <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No teams found for {selectedCategory}</td></tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{team.name}</td>
                  <td className="px-6 py-4 text-gray-500">{team.coach || "-"}</td>
                  <td className="px-6 py-4">
                    <Button 
                      variant="danger" 
                      onClick={() => handleRemoveTeam(team.id)}
                      disabled={removingTeamId === team.id}
                    >
                      {removingTeamId === team.id ? "Removing..." : "Remove"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>
      )}

      {/* Matches Content */}
      {activeTab === "matches" && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddMatchOpen(true)}>+ Schedule Match</Button>
          </div>
          <Table headers={["Date", "Home Team", "Away Team", "Status", "Actions"]}>
            {matches.length === 0 ? (
               <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No matches scheduled for {selectedCategory}</td></tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id}>
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(match.date).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {match.homeTeam?.name || "Unknown Team"}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {match.awayTeam?.name || "Unknown Team"}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                       match.status === 'CANCELED' ? 'bg-red-100 text-red-800' : 
                       match.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 
                       'bg-blue-100 text-blue-800'
                     }`}>
                       {match.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    {match.status !== 'CANCELED' && match.status !== 'COMPLETED' && (
                      <Button 
                        variant="danger" 
                        onClick={() => handleCancelMatch(match.id)}
                        disabled={cancelingMatchId === match.id}
                      >
                        {cancelingMatchId === match.id ? "Canceling..." : "Cancel"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Add Team Modal */}
      <Modal isOpen={isAddTeamOpen} onClose={handleCloseTeamModal} title="Add New Team">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm p-2 border ${
                teamNameError 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={newTeamName}
              onChange={(e) => {
                setNewTeamName(e.target.value);
                setTeamNameError(null);
              }}
              placeholder="Enter team name"
              maxLength={100}
            />
            {teamNameError && (
              <p className="mt-1 text-sm text-red-600">{teamNameError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Required. 2-100 characters.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseTeamModal} disabled={isAddingTeam}>
              Cancel
            </Button>
            <Button onClick={handleAddTeam} disabled={!newTeamName.trim() || isAddingTeam}>
              {isAddingTeam ? "Adding..." : "Add Team"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Match Modal */}
      <Modal isOpen={isAddMatchOpen} onClose={handleCloseMatchModal} title="Schedule Match">
        <div className="space-y-4">
          {matchErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{matchErrors.general}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Team <span className="text-red-500">*</span>
              </label>
              <select
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 p-2 border ${
                  matchErrors.homeTeamId 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newMatchData.homeTeamId}
                onChange={(e) => {
                  setNewMatchData({...newMatchData, homeTeamId: e.target.value});
                  setMatchErrors({...matchErrors, homeTeamId: undefined, general: undefined});
                }}
              >
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {matchErrors.homeTeamId && (
                <p className="mt-1 text-sm text-red-600">{matchErrors.homeTeamId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Away Team <span className="text-red-500">*</span>
              </label>
              <select
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 p-2 border ${
                  matchErrors.awayTeamId 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500"
                }`}
                value={newMatchData.awayTeamId}
                onChange={(e) => {
                  setNewMatchData({...newMatchData, awayTeamId: e.target.value});
                  setMatchErrors({...matchErrors, awayTeamId: undefined, general: undefined});
                }}
              >
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {matchErrors.awayTeamId && (
                <p className="mt-1 text-sm text-red-600">{matchErrors.awayTeamId}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 p-2 border ${
                matchErrors.date 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={newMatchData.date}
              onChange={(e) => {
                setNewMatchData({...newMatchData, date: e.target.value});
                setMatchErrors({...matchErrors, date: undefined});
              }}
              min={new Date().toISOString().slice(0, 16)}
            />
            {matchErrors.date && (
              <p className="mt-1 text-sm text-red-600">{matchErrors.date}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Select a future date and time.</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCloseMatchModal} disabled={isCreatingMatch}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMatch} 
              disabled={
                !newMatchData.homeTeamId || 
                !newMatchData.awayTeamId || 
                !newMatchData.date || 
                newMatchData.homeTeamId === newMatchData.awayTeamId ||
                isCreatingMatch
              }
            >
              {isCreatingMatch ? "Scheduling..." : "Schedule Match"}
            </Button>
          </div>
        </div>
      </Modal>

    </main></>
  );
};

export default TournamentDashboard;
