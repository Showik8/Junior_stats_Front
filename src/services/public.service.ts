import axios from "axios";
import { BASE_URL } from "@/app/utils/apiPaths";
import { API_PATHS } from "@/app/utils/apiPaths";
import { ApiResponse } from "@/types/admin";
import { 
  MOCK_TOURNAMENTS, 
  MOCK_TEAMS, 
  MOCK_MATCHES, 
  MOCK_PLAYERS,
  getMockTeamDetail,
  getMockTournamentDetail,
  getMockMatchDetail 
} from "@/data/mockData";

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

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  }): Promise<{ tournaments: any[]; total: number; page: number; limit: number; totalPages: number }> => {
    // MOCK DATA IMPLEMENTATION
    let data = [...MOCK_TOURNAMENTS];
    
    if (params?.status) {
      data = data.filter(t => t.status === params.status);
    }
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      data = data.filter(t => t.name.toLowerCase().includes(searchTerm));
    }

    return {
      tournaments: data,
      total: data.length,
      page: params?.page || 1,
      limit: params?.limit || 12,
      totalPages: 1,
    };

    /* REAL API IMPLEMENTATION (COMMENTED)
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.limit) queryParams.set("limit", String(params.limit));
    if (params?.status) queryParams.set("status", params.status);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.ageCategory) queryParams.set("ageCategory", params.ageCategory);

    const url = `${API_PATHS.PUBLIC.TOURNAMENTS}?${queryParams.toString()}`;
    const response = await publicAxios.get<ApiResponse<any[]>>(url);

    return {
      tournaments: response.data.data || [],
      total: response.data.meta?.total || 0,
      page: response.data.meta?.page || 1,
      limit: response.data.meta?.limit || 12,
      totalPages: response.data.meta?.totalPages || 0,
    };
    */
  },

  /**
   * Get full tournament details for public page
   */
  getTournamentDetail: async (id: string): Promise<any> => {
    // MOCK DATA IMPLEMENTATION
    const tournament = getMockTournamentDetail(id) || getMockTournamentDetail("t1"); // Fallback to t1 for testing if id not found
    if(tournament) return tournament;

    /* REAL API IMPLEMENTATION (COMMENTED)
    const response = await publicAxios.get<ApiResponse<any>>(
      API_PATHS.PUBLIC.TOURNAMENT_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Tournament not found");
    }
    return response.data.data;
    */
     throw new Error("Tournament not found");
  },

  /**
   * Get full team details for public page
   */
  getTeamDetail: async (id: string): Promise<any> => {
    // MOCK DATA IMPLEMENTATION
    const team = getMockTeamDetail(id);
    if (team) return team;
    
    // Fallback for testing
    return getMockTeamDetail("tm1");

    /* REAL API IMPLEMENTATION (COMMENTED)
    const response = await publicAxios.get<ApiResponse<any>>(
      API_PATHS.PUBLIC.TEAM_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Team not found");
    }
    return response.data.data;
    */
  },

  /**
   * Get full player profile for public page
   */
  getPlayerDetail: async (id: string): Promise<any> => {
    // MOCK DATA IMPLEMENTATION
    const player = MOCK_PLAYERS.find(p => p.id === id);
    if (player) return player;
    
    // Fallback
    return MOCK_PLAYERS[0];

    /* REAL API IMPLEMENTATION (COMMENTED)
    const response = await publicAxios.get<ApiResponse<any>>(
      API_PATHS.PUBLIC.PLAYER_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Player not found");
    }
    return response.data.data;
    */
  },

  /**
   * Get full match details for public page
   */
  getMatchDetail: async (id: string): Promise<any> => {
    // MOCK DATA IMPLEMENTATION
    const match = getMockMatchDetail(id);
    if (match) return match;

    /* REAL API IMPLEMENTATION (COMMENTED)
    const response = await publicAxios.get<ApiResponse<any>>(
      API_PATHS.PUBLIC.MATCH_DETAIL(id)
    );
    if (!response.data.success || !response.data.data) {
      throw new Error("Match not found");
    }
    return response.data.data;
    */
    throw new Error("Match not found");
  },

  /**
   * Get all teams
   */
  getAllTeams: async (): Promise<any[]> => {
    return MOCK_TEAMS;
  },

  /**
   * Get all players
   */
  getAllPlayers: async (): Promise<any[]> => {
    return MOCK_PLAYERS;
  },

  /**
   * Get all matches across all tournaments
   */
  getAllMatches: async (): Promise<any[]> => {
    // MOCK DATA IMPLEMENTATION
    return MOCK_MATCHES;

    /* REAL API IMPLEMENTATION (COMMENTED)
    const response = await publicAxios.get<ApiResponse<any[]>>(
      API_PATHS.PUBLIC.MATCHES
    );
    return response.data.data || [];
    */
  },
};
