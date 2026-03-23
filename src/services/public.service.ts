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

    const url = `${BASE_URL}${API_PATHS.PUBLIC.TOURNAMENTS}?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicTournament[]> = await response.json();

    return {
      tournaments: data.data || [],
      total: data.meta?.total || 0,
      page: data.meta?.page || 1,
      limit: data.meta?.limit || 12,
      totalPages: data.meta?.totalPages || 0,
    };
  },

  /**
   * Get full tournament details for public page
   */
  getTournamentDetail: async (id: string): Promise<PublicTournament> => {
    const url = `${BASE_URL}${API_PATHS.PUBLIC.TOURNAMENT_DETAIL(id)}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicTournament> = await response.json();
    if (!data.success || !data.data) {
      throw new Error("Tournament not found");
    }
    return data.data;
  },

  /**
   * Get full team details for public page
   */
  getTeamDetail: async (id: string): Promise<PublicTeam> => {
    const url = `${BASE_URL}${API_PATHS.PUBLIC.TEAM_DETAIL(id)}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicTeam> = await response.json();
    if (!data.success || !data.data) {
      throw new Error("Team not found");
    }
    return data.data;
  },

  /**
   * Get full player profile for public page
   */
  getPlayerDetail: async (id: string): Promise<PublicPlayer> => {
    const url = `${BASE_URL}${API_PATHS.PUBLIC.PLAYER_DETAIL(id)}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicPlayer> = await response.json();
    if (!data.success || !data.data) {
      throw new Error("Player not found");
    }
    return data.data;
  },

  /**
   * Get full match details for public page
   */
  getMatchDetail: async (id: string): Promise<PublicMatch> => {
    const url = `${BASE_URL}${API_PATHS.PUBLIC.MATCH_DETAIL(id)}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicMatch> = await response.json();
    if (!data.success || !data.data) {
      throw new Error("Match not found");
    }
    return data.data;
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
    const url = `${BASE_URL}${API_PATHS.PLAYERS.GET_PLAYERS}?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicPlayer[]> = await response.json();
    return data.data || [];
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
    const url = `${BASE_URL}${API_PATHS.MATCH.GET_MATCHES}?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data: ApiResponse<PublicMatch[]> = await response.json();
    return data.data || [];
  },

  /**
   * Get global statistics summary across all tournaments
   */
  getGlobalStatistics: async (params?: { ageCategory?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.ageCategory) queryParams.set("ageCategory", params.ageCategory);
    if (params?.limit) queryParams.set("limit", String(params.limit));

    const response = await publicAxios.get<ApiResponse<Record<string, unknown>>>(
      `/api/public/statistics/summary?${queryParams.toString()}`
    );
    return response.data.data;
  },

  /**
   * Increment player views securely
   */
  incrementPlayerView: async (id: string): Promise<void> => {
    try {
      await publicAxios.post(API_PATHS.PUBLIC.PLAYER_DETAIL(id) + "/view");
    } catch (error) {
      console.error("Failed to increment player view silently", error);
    }
  },
};
