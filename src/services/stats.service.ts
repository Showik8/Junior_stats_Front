import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  TournamentStatsSummary,
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
};
