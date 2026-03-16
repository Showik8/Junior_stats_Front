import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import { MatchLineup, SubmitLineupDto } from "@/types/lineup.types";
import { ApiResponse } from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const lineupService = {
  getMatchLineups: async (matchId: string): Promise<MatchLineup[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<MatchLineup[]>>(
        API_PATHS.LINEUPS.GET_MATCH_LINEUPS(matchId)
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch lineups");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch lineups"));
    }
  },

  getTeamLineup: async (matchId: string, teamId: string): Promise<MatchLineup> => {
    try {
      const response = await axiosInstance.get<ApiResponse<MatchLineup>>(
        API_PATHS.LINEUPS.GET_TEAM_LINEUP(matchId, teamId)
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch lineup");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch lineup"));
    }
  },

  submitLineup: async (matchId: string, teamId: string, data: SubmitLineupDto): Promise<MatchLineup> => {
    try {
      const response = await axiosInstance.post<ApiResponse<{ message: string; data: MatchLineup }>>(
        API_PATHS.LINEUPS.SUBMIT(matchId, teamId),
        data
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to submit lineup");
      }
      return response.data.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to submit lineup"));
    }
  },
};
