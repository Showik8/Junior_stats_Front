import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Standing,
  AgeCategory,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const standingService = {
  getStandings: async (
    tournamentId: string,
    ageCategory?: AgeCategory,
    groupId?: string
  ): Promise<Standing[]> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const params = new URLSearchParams({ tournamentId });
      if (ageCategory) params.append("ageCategory", ageCategory);
      if (groupId) params.append("groupId", groupId);

      const response = await axiosInstance.get<ApiResponse<Standing[]>>(
        `${API_PATHS.STANDINGS.GET_STANDINGS}?${params.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch standings"));
    }
  },

  recalculateStandings: async (
    tournamentId: string,
    ageCategory: AgeCategory
  ): Promise<Standing[]> => {
    try {
      if (!tournamentId || !ageCategory) {
        throw new Error("Tournament ID and age category are required");
      }

      const response = await axiosInstance.post<ApiResponse<Standing[]>>(
        API_PATHS.STANDINGS.RECALCULATE,
        { tournamentId, ageCategory }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to recalculate standings"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to recalculate standings"));
    }
  },
};
