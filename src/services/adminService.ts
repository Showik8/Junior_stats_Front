import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Tournament,
  Team,
  Match,
  CreateTeamPayload,
  CreateMatchPayload,
  Player,
  CreatePlayerPayload,
  AgeCategory,
  ApiResponse,
  Admin,
  CreateAdminPayload,
  CreateTournamentPayload,
} from "@/types/admin";

/**
 * Admin Service - Handles all API calls to backend
 * All methods handle backend response format: { success: boolean, data: T, error?: {...} }
 * All errors are properly typed and thrown for component error handling
 */

/**
 * Helper function to extract error message from backend error response
 * Backend returns: { success: false, error: { message: string, details?: any } }
 * In development mode, details may contain the actual error message
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractErrorMessage = (error: any, defaultMessage: string): string => {
  const errorData = error.response?.data;
  
  if (errorData?.error) {
    // In development mode, backend may include actual error in details
    if (errorData.error.details) {
      // If details is a string, return it
      if (typeof errorData.error.details === "string") return errorData.error.details;
      // If details is an object/array, stringify it
      return JSON.stringify(errorData.error.details);
    }
    if (errorData.error.message) {
      return errorData.error.message;
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

export const adminService = {
  /**
   * Get tournament information
   * Backend returns active tournament if no query params, or list with pagination
   * For MVP, we get the active tournament (single object or first in array)
   */
  getTournamentInfo: async (): Promise<Tournament> => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<Tournament | Tournament[]>
      >(API_PATHS.TOURNAMENT.GET_TOURNAMENTS);

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch tournament"
        );
      }

      const data = response.data.data;

      if (!data) {
        throw new Error("No active tournament found");
      }

      const tournament = Array.isArray(data) ? data[0] : data;

      if (!tournament) {
        throw new Error("No active tournament found");
      }

      return tournament;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch tournament"));
    }
  },

  /**
   * Search teams
   * Backend: GET /api/teams?search=X&ageCategory=Y
   */
  searchTeams: async (
    search: string,
    ageCategory?: AgeCategory
  ): Promise<Team[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (ageCategory) queryParams.append("ageCategory", ageCategory);

      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      console.error("Failed to search teams:", error);
      return [];
    }
  },

  /**
   * Get teams by tournament and age category
   * Backend: GET /api/teams?tournamentId=X&ageCategory=Y
   * Returns array of teams (with nested players if includePlayers=true)
   */
  getTeams: async (
    tournamentId: string,
    ageCategory: AgeCategory
  ): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?tournamentId=${tournamentId}&ageCategory=${ageCategory}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch teams"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch teams"));
    }
  },

  /**
   * Get all clubs (teams) without tournament filter
   * Backend: GET /api/teams (with optional pagination/search)
   */
  getAllClubs: async (search?: string): Promise<Team[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      
      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch clubs"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch clubs"));
    }
  },

  /**
   * Add a new team
   * Backend: POST /api/teams
   * Required: name, tournamentId, ageCategory
   * Optional: logo, coach
   */
  addTeam: async (payload: CreateTeamPayload): Promise<Team> => {
    try {
      // Frontend validation
      if (!payload.name?.trim()) {
        throw new Error("Team name is required");
      }
      if (!payload.ageCategory) {
        throw new Error("Age category is required");
      }

      // Clean payload
      const cleanPayload: Partial<CreateTeamPayload> = {
        name: payload.name.trim(),
        ageCategory: payload.ageCategory,
      };

      if (payload.tournamentId?.trim()) {
        cleanPayload.tournamentId = payload.tournamentId;
      }
      if (payload.logo?.trim()) {
        cleanPayload.logo = payload.logo.trim();
      } else {
        cleanPayload.logo = null;
      }
      
      if (payload.coach?.trim()) {
        cleanPayload.coach = payload.coach.trim();
      } else {
        cleanPayload.coach = null;
      }
      
      if (payload.adminEmail?.trim()) {
        cleanPayload.adminEmail = payload.adminEmail.trim();
      }

      const response = await axiosInstance.post<ApiResponse<Team>>(
        API_PATHS.TEAMS.ADD_TEAM,
        cleanPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create team"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to add team"));
    }
  },

  /**
   * Assign a team to a tournament
   * Backend: POST /api/teams/:id/join
   */
  assignTeamToTournament: async (
    teamId: string,
    tournamentId: string
  ): Promise<void> => {
    try {
      if (!teamId || !tournamentId) {
        throw new Error("Team ID and Tournament ID are required");
      }

      const response = await axiosInstance.post<ApiResponse<void>>(
        `${API_PATHS.TEAMS.BASE}/${teamId}/join`,
        { tournamentId }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message || "Failed to assign team to tournament"
        );
      }
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to assign team to tournament"));
    }
  },

  /**
   * Remove a team
   * Backend: DELETE /api/teams/:id
   * Returns 204 No Content on success
   */
  removeTeam: async (teamId: string): Promise<void> => {
    try {
      if (!teamId) {
        throw new Error("Team ID is required");
      }

      await axiosInstance.delete(API_PATHS.TEAMS.REMOVE_TEAM(teamId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to remove team"));
    }
  },

  /**
   * Get matches by tournament and age category
   * Backend: GET /api/matches?tournamentId=X&ageCategory=Y
   * Returns array of matches (with nested homeTeam and awayTeam by default)
   */
  getMatches: async (
    tournamentId: string,
    ageCategory: AgeCategory
  ): Promise<Match[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Match[]>>(
        `${API_PATHS.MATCH.GET_MATCHES}?tournamentId=${tournamentId}&ageCategory=${ageCategory}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch matches"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch matches"));
    }
  },

  /**
   * Create a new match
   * Backend: POST /api/matches
   */
  createMatch: async (payload: CreateMatchPayload): Promise<Match> => {
    try {
      // Frontend validation
      if (!payload.homeTeamId) throw new Error("Home team is required");
      if (!payload.awayTeamId) throw new Error("Away team is required");
      if (payload.homeTeamId === payload.awayTeamId) throw new Error("A team cannot play against itself");
      if (!payload.date) throw new Error("Match date is required");
      if (!payload.tournamentId) throw new Error("Tournament ID is required");

      const dateValue = payload.date;
      let isoDate: string;

      if (dateValue.includes("T")) {
        const parts = dateValue.split("T");
        const timePart = parts[1];
        const timeWithSeconds =
          timePart.split(":").length === 2 ? `${timePart}:00` : timePart;
        isoDate = `${parts[0]}T${timeWithSeconds}`;
      } else {
        isoDate = `${dateValue}T00:00:00`;
      }

      const response = await axiosInstance.post<ApiResponse<Match>>(
        API_PATHS.MATCH.CREATE_MATCH,
        {
          ...payload,
          date: isoDate,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create match"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create match"));
    }
  },

  /**
   * Cancel a match
   * Backend: PATCH /api/matches/:id/cancel
   */
  cancelMatch: async (matchId: string): Promise<Match> => {
    try {
      if (!matchId) throw new Error("Match ID is required");

      const response = await axiosInstance.patch<ApiResponse<Match>>(
        API_PATHS.MATCH.CANCEL_MATCH(matchId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to cancel match"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to cancel match"));
    }
  },

  /**
   * Get current user's team info
   * Backend: GET /api/teams/me (requires authentication)
   */
  getMyTeamInfo: async (): Promise<Team> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Team>>(
        API_PATHS.TEAMS.GET_TEAM_INFO
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch team info"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch team info"));
    }
  },

  /**
   * Get players by team ID
   * Backend: GET /api/players?teamId=X
   */
  getTeamPlayers: async (teamId: string): Promise<Player[]> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const response = await axiosInstance.get<ApiResponse<Player[]>>(
        `${API_PATHS.PLAYERS.GET_PLAYERS}?teamId=${teamId}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch players"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch players"));
    }
  },

  /**
   * Add a new player
   * Backend: POST /api/players
   */
  addPlayer: async (payload: CreatePlayerPayload): Promise<Player> => {
    try {
      if (!payload.name?.trim()) throw new Error("Player name is required");
      if (!payload.teamId) throw new Error("Team ID is required");

      const cleanPayload: Partial<CreatePlayerPayload> = {
        name: payload.name.trim(),
        teamId: payload.teamId,
      };

      if (payload.position?.trim()) {
        cleanPayload.position = payload.position.trim();
      } else {
        cleanPayload.position = null;
      }

      if (payload.shirtNumber !== null && payload.shirtNumber !== undefined) {
        cleanPayload.shirtNumber = payload.shirtNumber;
      } else {
        cleanPayload.shirtNumber = null;
      }

      const response = await axiosInstance.post<ApiResponse<Player>>(
        API_PATHS.PLAYERS.ADD_PLAYER,
        cleanPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to add player");
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to add player"));
    }
  },

  /**
   * Remove a player
   * Backend: DELETE /api/players/:id
   */
  removePlayer: async (playerId: string): Promise<void> => {
    try {
      if (!playerId) throw new Error("Player ID is required");

      await axiosInstance.delete(API_PATHS.PLAYERS.REMOVE_PLAYER(playerId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to remove player"));
    }
  },

  /**
   * Get matches for a specific team
   * Backend: GET /api/matches/team?teamId=X
   */
  getTeamMatches: async (teamId: string): Promise<Match[]> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const response = await axiosInstance.get<ApiResponse<Match[]>>(
        `${API_PATHS.MATCH.GET_TEAM_MATCHES}?teamId=${teamId}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch team matches"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch team matches"));
    }
  },

  /**
   * Super Admin: Get all admins
   * Backend: GET /api/admin/list
   */
  getAdmins: async (): Promise<Admin[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Admin[]>>(
        API_PATHS.ADMIN.LIST
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch admins"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch admins"));
    }
  },

  /**
   * Super Admin: Create a new admin
   * Backend: POST /api/admin
   */
  createAdmin: async (payload: CreateAdminPayload): Promise<Admin> => {
    try {
      if (!payload.email || !payload.password || !payload.role) {
        throw new Error("Email, password and role are required");
      }

      const response = await axiosInstance.post<ApiResponse<Admin>>(
        API_PATHS.ADMIN.CREATE,
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create admin"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create admin"));
    }
  },

  /**
   * Super Admin: Delete an admin
   * Backend: DELETE /api/admin/:id
   */
  deleteAdmin: async (id: number): Promise<void> => {
    try {
      if (!id) throw new Error("Admin ID is required");

      await axiosInstance.delete(API_PATHS.ADMIN.DELETE(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete admin"));
    }
  },

  /**
   * Super Admin / Tournament Admin: Create a new tournament
   * Backend: POST /api/tournaments
   */
  createTournament: async (
    payload: CreateTournamentPayload
  ): Promise<Tournament> => {
    try {
      if (!payload.name?.trim()) {
        throw new Error("Tournament name is required");
      }
      if (!payload.ageCategories || payload.ageCategories.length === 0) {
        throw new Error("At least one age category is required");
      }

      const cleanPayload: Partial<CreateTournamentPayload> = {
        name: payload.name.trim(),
        ageCategories: payload.ageCategories,
      };

      if (payload.status) {
        cleanPayload.status = payload.status;
      }

      if (payload.adminEmail?.trim()) {
        cleanPayload.adminEmail = payload.adminEmail.trim();
      }

      const response = await axiosInstance.post<ApiResponse<Tournament>>(
        API_PATHS.TOURNAMENT.CREATE_TOURNAMENT,
        cleanPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create tournament"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create tournament"));
    }
  },

  /**
   * Get all tournaments (for list view)
   */
  getAllTournaments: async (): Promise<Tournament[]> => {
    try {
      // Pass limit=100 to ensure we get a list and bypass the "single active tournament"
      // default behavior in the backend controller
      const response = await axiosInstance.get<ApiResponse<Tournament[]>>(
        `${API_PATHS.TOURNAMENT.GET_TOURNAMENTS}?limit=100`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch tournaments"
        );
      }

      const data = response.data.data;
      return Array.isArray(data) ? data : [data];
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch tournaments"));
    }
  },
  /**
   * Super Admin / Tournament Admin: Delete a tournament
   * Backend: DELETE /api/tournaments/:id
   */
  deleteTournament: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("Tournament ID is required");

      await axiosInstance.delete(API_PATHS.TOURNAMENT.DELETE_TOURNAMENT(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete tournament"));
    }
  },

  /**
   * Remove a team from a tournament
   * Backend: DELETE /api/teams/:id/tournaments/:tournamentId
   */
  removeTeamFromTournament: async (
    teamId: string,
    tournamentId: string
  ): Promise<void> => {
    try {
      if (!teamId || !tournamentId) {
        throw new Error("Team ID and Tournament ID are required");
      }

      await axiosInstance.delete(
        `${API_PATHS.TEAMS.BASE}/${teamId}/tournaments/${tournamentId}`
      );
    } catch (error: unknown) {
      throw new Error(
        extractErrorMessage(error, "Failed to remove team from tournament")
      );
    }
  },

  /**
   * Update a match
   * Backend: PUT /api/matches/:id
   */
  updateMatch: async (
    matchId: string,
    payload: Partial<CreateMatchPayload> & { score?: string }
  ): Promise<Match> => {
    try {
      if (!matchId) throw new Error("Match ID is required");

      const finalPayload: Partial<CreateMatchPayload> & { score?: string } = { ...payload };
      if (payload.date) {
        const dateValue = payload.date;
        if (dateValue.includes("T")) {
          const parts = dateValue.split("T");
          const timePart = parts[1];
          const timeWithSeconds =
            timePart.split(":").length === 2 ? `${timePart}:00` : timePart;
          finalPayload.date = `${parts[0]}T${timeWithSeconds}`;
        } else {
          finalPayload.date = `${dateValue}T00:00:00`;
        }
      }

      const response = await axiosInstance.put<ApiResponse<Match>>(
        API_PATHS.MATCH.UPDATE_MATCH(matchId),
        finalPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to update match"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update match"));
    }
  },

  /**
   * Delete a match
   * Backend: DELETE /api/matches/:id
   */
  deleteMatch: async (matchId: string): Promise<void> => {
    try {
      if (!matchId) throw new Error("Match ID is required");

      await axiosInstance.delete(API_PATHS.MATCH.DELETE_MATCH(matchId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete match"));
    }
  },
};
