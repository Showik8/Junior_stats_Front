import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Match,
  CreateMatchPayload,
  AgeCategory,
  ApiResponse,
  SubmitMatchReportPayload,
  SaveMatchReportDraftPayload,
} from "@/types/admin";
import { extractErrorMessage, formatMatchDate } from "./helpers";

export const matchService = {
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

  getMatch: async (matchId: string): Promise<Match> => {
    try {
      if (!matchId) throw new Error("Match ID is required");

      const response = await axiosInstance.get<ApiResponse<Match>>(
        `${API_PATHS.MATCH.GET_MATCH(matchId)}?includeRelations=true`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch match"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch match"));
    }
  },

  createMatch: async (payload: CreateMatchPayload): Promise<Match> => {
    try {
      if (!payload.homeTeamId) throw new Error("Home team is required");
      if (!payload.awayTeamId) throw new Error("Away team is required");
      if (payload.homeTeamId === payload.awayTeamId) throw new Error("A team cannot play against itself");
      if (!payload.date) throw new Error("Match date is required");
      if (!payload.tournamentId) throw new Error("Tournament ID is required");

      const response = await axiosInstance.post<ApiResponse<Match>>(
        API_PATHS.MATCH.CREATE_MATCH,
        {
          ...payload,
          date: formatMatchDate(payload.date),
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

  updateMatch: async (
    matchId: string,
    payload: Partial<CreateMatchPayload> & { score?: string }
  ): Promise<Match> => {
    try {
      if (!matchId) throw new Error("Match ID is required");

      const finalPayload: Partial<CreateMatchPayload> & { score?: string } = {
        ...payload,
        ...(payload.date ? { date: formatMatchDate(payload.date) } : {}),
      };

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

  deleteMatch: async (matchId: string): Promise<void> => {
    try {
      if (!matchId) throw new Error("Match ID is required");

      await axiosInstance.delete(API_PATHS.MATCH.DELETE_MATCH(matchId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete match"));
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitMatchReport: async (matchId: string, payload: SubmitMatchReportPayload): Promise<void> => {
    try {
      if (!matchId) throw new Error("Match ID is required");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_PATHS.MATCH_REPORTS.SUBMIT(matchId),
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || "Failed to submit match report");
      }
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to submit match report"));
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveMatchReportDraft: async (matchId: string, payload: SaveMatchReportDraftPayload): Promise<void> => {
    try {
      if (!matchId) throw new Error("Match ID is required");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_PATHS.MATCH_REPORTS.DRAFT(matchId),
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || "Failed to save match report draft");
      }
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to save match report draft"));
    }
  },

  /**
   * Get match statistics for a tournament
   */
  getMatchStats: async (tournamentId: string): Promise<unknown> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const response = await axiosInstance.get<ApiResponse<unknown>>(
        API_PATHS.MATCH.GET_MATCH_STATS(tournamentId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch match stats"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch match stats"));
    }
  },

  /**
   * Get knockout bracket for a tournament
   */
  getKnockoutBracket: async (tournamentId: string): Promise<unknown> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const response = await axiosInstance.get<ApiResponse<unknown>>(
        API_PATHS.MATCH.GET_KNOCKOUT_BRACKET(tournamentId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch knockout bracket"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch knockout bracket"));
    }
  },
};
