import axios from "axios";
import { BASE_URL, API_PATHS } from "@/app/utils/apiPaths";
import { ApiResponse } from "@/types/admin";
import type {
  PublicTournament,
  PublicTournamentsResponse,
  PublicTeam,
  PublicPlayer,
  PublicMatch,
} from "@/types/public";

/**
 * Public axios instance — no auth token needed
 */
const publicAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const publicService = {
  /**
   * Get public tournaments list with enriched data
   */
  getTournaments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    ageCategory?: string;
  }): Promise<PublicTournamentsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.limit) queryParams.set("limit", String(params.limit));
    if (params?.status) queryParams.set("status", params.status);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.ageCategory) queryParams.set("ageCategory", params.ageCategory);

    const url = `${API_PATHS.PUBLIC.TOURNAMENTS}?${queryParams.toString()}`;
    const response = await publicAxios.get<ApiResponse<PublicTournament[]>>(url);

    return {
      tournaments: response.data.data || [],
      total: response.data.meta?.total || 0,
      page: response.data.meta?.page || 1,
      limit: response.data.meta?.limit || 12,
      totalPages: response.data.meta?.totalPages || 0,
    };
  },

  /**
   * Get full tournament details for public page
   */
  getTournamentDetail: async (id: string): Promise<PublicTournament> => {
    const response = await publicAxios.get<ApiResponse<PublicTournament>>(
      API_PATHS.PUBLIC.TOURNAMENT_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Tournament not found");
    }
    return response.data.data;
  },

  /**
   * Get full team details for public page
   */
  getTeamDetail: async (id: string): Promise<PublicTeam> => {
    const response = await publicAxios.get<ApiResponse<PublicTeam>>(
      API_PATHS.PUBLIC.TEAM_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Team not found");
    }
    return response.data.data;
  },

  /**
   * Get full player profile for public page
   */
  getPlayerDetail: async (id: string): Promise<PublicPlayer> => {
    const response = await publicAxios.get<ApiResponse<PublicPlayer>>(
      API_PATHS.PUBLIC.PLAYER_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Player not found");
    }
    return response.data.data;
  },

  /**
   * Get full match details for public page
   */
  getMatchDetail: async (id: string): Promise<PublicMatch> => {
    const response = await publicAxios.get<ApiResponse<PublicMatch>>(
      API_PATHS.PUBLIC.MATCH_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Match not found");
    }
    return response.data.data;
  },

  /**
   * Get all teams
   */
  getAllTeams: async (params?: Record<string, string | number>): Promise<PublicTeam[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.set(key, String(value));
      });
    }
    const response = await publicAxios.get<ApiResponse<PublicTeam[]>>(
      `${API_PATHS.TEAMS.GET_TEAMS}?${queryParams.toString()}`
    );
    return response.data.data || [];
  },

  /**
   * Get all players
   */
  getAllPlayers: async (params?: Record<string, string | number>): Promise<PublicPlayer[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.set(key, String(value));
      });
    }
    const response = await publicAxios.get<ApiResponse<PublicPlayer[]>>(
      `${API_PATHS.PLAYERS.GET_PLAYERS}?${queryParams.toString()}`
    );
    return response.data.data || [];
  },

  /**
   * Get all matches across all tournaments
   */
  getAllMatches: async (params?: Record<string, string | number>): Promise<PublicMatch[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.set(key, String(value));
      });
    }
    const response = await publicAxios.get<ApiResponse<PublicMatch[]>>(
      `${API_PATHS.MATCH.GET_MATCHES}?${queryParams.toString()}`
    );
    return response.data.data || [];
  },
};
