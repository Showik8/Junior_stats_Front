import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  TournamentStatsSummary,
  PlayerStatEntry,
  AgeCategory,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const statsService = {
  getTournamentStatsSummary: async (
    tournamentId: string,
    ageCategory?: AgeCategory,
    limit?: number
  ): Promise<TournamentStatsSummary> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const params = new URLSearchParams();
      if (ageCategory) params.append("ageCategory", ageCategory);
      if (limit) params.append("limit", limit.toString());

      const queryString = params.toString();
      const url = `${API_PATHS.TOURNAMENT_STATS.SUMMARY(tournamentId)}${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get<ApiResponse<TournamentStatsSummary>>(url);

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch tournament statistics"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch tournament statistics"));
    }
  },

  /**
   * Get top scorers for a tournament
   */
  getTopScorers: async (
    tournamentId: string,
    params?: { ageCategory?: AgeCategory; limit?: number; year?: number }
  ): Promise<PlayerStatEntry[]> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const queryParams = new URLSearchParams();
      if (params?.ageCategory) queryParams.append("ageCategory", params.ageCategory);
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.year) queryParams.append("year", params.year.toString());

      const queryString = queryParams.toString();
      const url = `${API_PATHS.TOURNAMENT_STATS.TOP_SCORERS(tournamentId)}${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get<ApiResponse<{ topScorers: PlayerStatEntry[] }>>(url);

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data.topScorers || [];
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch top scorers"));
    }
  },

  /**
   * Get top assist providers for a tournament
   */
  getTopAssists: async (
    tournamentId: string,
    params?: { ageCategory?: AgeCategory; limit?: number; year?: number }
  ): Promise<PlayerStatEntry[]> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const queryParams = new URLSearchParams();
      if (params?.ageCategory) queryParams.append("ageCategory", params.ageCategory);
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.year) queryParams.append("year", params.year.toString());

      const queryString = queryParams.toString();
      const url = `${API_PATHS.TOURNAMENT_STATS.TOP_ASSISTS(tournamentId)}${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get<ApiResponse<{ topAssists: PlayerStatEntry[] }>>(url);

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data.topAssists || [];
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch top assists"));
    }
  },

  /**
   * Get players with most matches played in a tournament
   */
  getMostMatchesPlayed: async (
    tournamentId: string,
    params?: { ageCategory?: AgeCategory; limit?: number; year?: number }
  ): Promise<PlayerStatEntry[]> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const queryParams = new URLSearchParams();
      if (params?.ageCategory) queryParams.append("ageCategory", params.ageCategory);
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.year) queryParams.append("year", params.year.toString());

      const queryString = queryParams.toString();
      const url = `${API_PATHS.TOURNAMENT_STATS.MOST_MATCHES(tournamentId)}${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get<ApiResponse<{ mostMatchesPlayed: PlayerStatEntry[] }>>(url);

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data.mostMatchesPlayed || [];
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch most matches played"));
    }
  },
};
