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
  ApiResponse
} from "@/types/admin";

/**
 * Admin Service - Handles all API calls to backend
 * All methods handle backend response format: { success: boolean, data: T, error?: {...} }
 * All errors are properly typed and thrown for component error handling
 */

export const adminService = {
  /**
   * Get tournament information
   * Backend returns active tournament if no query params, or list with pagination
   * For MVP, we get the active tournament (single object or first in array)
   */
  getTournamentInfo: async (): Promise<Tournament> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Tournament | Tournament[]>>(
        API_PATHS.TOURNAMENT.GET_TOURNAMENTS
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch tournament");
      }

      // Backend returns single tournament object when no query params (active tournament)
      // Or array when pagination is used
      const data = response.data.data;
      const tournament = Array.isArray(data) ? data[0] : data;
      
      if (!tournament) {
        throw new Error("No active tournament found");
      }
      
      return tournament;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to fetch tournament";
      throw new Error(message);
    }
  },

  /**
   * Get teams by tournament and age category
   * Backend: GET /api/teams?tournamentId=X&ageCategory=Y
   * Returns array of teams (with nested players if includePlayers=true)
   */
  getTeams: async (tournamentId: string, ageCategory: AgeCategory): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?tournamentId=${tournamentId}&ageCategory=${ageCategory}`
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch teams");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to fetch teams";
      throw new Error(message);
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
      if (!payload.tournamentId) {
        throw new Error("Tournament ID is required");
      }
      if (!payload.ageCategory) {
        throw new Error("Age category is required");
      }

      const response = await axiosInstance.post<ApiResponse<Team>>(
        API_PATHS.TEAMS.ADD_TEAM, 
        payload
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to create team");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to add team";
      throw new Error(message);
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
      // 204 No Content - no response body
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to remove team";
      throw new Error(message);
    }
  },

  /**
   * Get matches by tournament and age category
   * Backend: GET /api/matches?tournamentId=X&ageCategory=Y
   * Returns array of matches (with nested homeTeam and awayTeam by default)
   */
  getMatches: async (tournamentId: string, ageCategory: AgeCategory): Promise<Match[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Match[]>>(
        `${API_PATHS.MATCH.GET_MATCHES}?tournamentId=${tournamentId}&ageCategory=${ageCategory}`
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch matches");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to fetch matches";
      throw new Error(message);
    }
  },

  /**
   * Create a new match
   * Backend: POST /api/matches
   * Required: homeTeamId, awayTeamId, date, tournamentId
   * Optional: status (defaults to "SCHEDULED"), ageCategory (auto-derived from teams)
   * Backend validates: teams exist, same tournament, same age category, not same team
   */
  createMatch: async (payload: CreateMatchPayload): Promise<Match> => {
    try {
      // Frontend validation
      if (!payload.homeTeamId) {
        throw new Error("Home team is required");
      }
      if (!payload.awayTeamId) {
        throw new Error("Away team is required");
      }
      if (payload.homeTeamId === payload.awayTeamId) {
        throw new Error("A team cannot play against itself");
      }
      if (!payload.date) {
        throw new Error("Match date is required");
      }
      if (!payload.tournamentId) {
        throw new Error("Tournament ID is required");
      }

      // Convert datetime-local format to ISO string for backend
      const dateValue = payload.date;
      const isoDate = dateValue.includes('T') ? dateValue : `${dateValue}:00`;

      const response = await axiosInstance.post<ApiResponse<Match>>(
        API_PATHS.MATCH.CREATE_MATCH,
        {
          ...payload,
          date: isoDate,
        }
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to create match");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to create match";
      throw new Error(message);
    }
  },

  /**
   * Cancel a match
   * Backend: PATCH /api/matches/:id/cancel
   * Sets match status to "CANCELED"
   */
  cancelMatch: async (matchId: string): Promise<Match> => {
    try {
      if (!matchId) {
        throw new Error("Match ID is required");
      }

      const response = await axiosInstance.patch<ApiResponse<Match>>(
        API_PATHS.MATCH.CANCEL_MATCH(matchId)
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to cancel match");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to cancel match";
      throw new Error(message);
    }
  },

  /**
   * Get current user's team info
   * Backend: GET /api/teams/me (requires authentication)
   * Returns the first team assigned to the logged-in admin
   */
  getMyTeamInfo: async (): Promise<Team> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Team>>(
        API_PATHS.TEAMS.GET_TEAM_INFO
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch team info");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to fetch team info";
      throw new Error(message);
    }
  },

  /**
   * Get players by team ID
   * Backend: GET /api/players?teamId=X
   * Returns array of players
   */
  getTeamPlayers: async (teamId: string): Promise<Player[]> => {
    try {
      if (!teamId) {
        throw new Error("Team ID is required");
      }

      const response = await axiosInstance.get<ApiResponse<Player[]>>(
        `${API_PATHS.PLAYERS.GET_PLAYERS}?teamId=${teamId}`
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch players");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to fetch players";
      throw new Error(message);
    }
  },

  /**
   * Add a new player
   * Backend: POST /api/players
   * Required: name, teamId
   * Optional: position, shirtNumber (validated for uniqueness within team)
   */
  addPlayer: async (payload: CreatePlayerPayload): Promise<Player> => {
    try {
      // Frontend validation
      if (!payload.name?.trim()) {
        throw new Error("Player name is required");
      }
      if (!payload.teamId) {
        throw new Error("Team ID is required");
      }
      // Validate shirt number if provided
      if (payload.shirtNumber !== null && payload.shirtNumber !== undefined) {
        if (payload.shirtNumber < 1 || payload.shirtNumber > 99) {
          throw new Error("Shirt number must be between 1 and 99");
        }
      }

      const response = await axiosInstance.post<ApiResponse<Player>>(
        API_PATHS.PLAYERS.ADD_PLAYER,
        payload
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to add player");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to add player";
      throw new Error(message);
    }
  },

  /**
   * Remove a player
   * Backend: DELETE /api/players/:id
   * Returns 204 No Content on success
   */
  removePlayer: async (playerId: string): Promise<void> => {
    try {
      if (!playerId) {
        throw new Error("Player ID is required");
      }

      await axiosInstance.delete(API_PATHS.PLAYERS.REMOVE_PLAYER(playerId));
      // 204 No Content - no response body
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to remove player";
      throw new Error(message);
    }
  },

  /**
   * Get matches for a specific team
   * Backend: GET /api/matches/team?teamId=X
   * Returns array of matches (with nested teams and tournament)
   */
  getTeamMatches: async (teamId: string): Promise<Match[]> => {
    try {
      if (!teamId) {
        throw new Error("Team ID is required");
      }

      const response = await axiosInstance.get<ApiResponse<Match[]>>(
        `${API_PATHS.MATCH.GET_TEAM_MATCHES}?teamId=${teamId}`
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch team matches");
      }
      
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || "Failed to fetch team matches";
      throw new Error(message);
    }
  },
};
