import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Tournament,
  ApiResponse,
  CreateTournamentPayload,
  UpdateTournamentPayload,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const tournamentService = {
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

  getAllTournaments: async (): Promise<Tournament[]> => {
    try {
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

      if (payload.status) cleanPayload.status = payload.status;
      if (payload.adminEmail?.trim()) cleanPayload.adminEmail = payload.adminEmail.trim();
      if (payload.format) cleanPayload.format = payload.format;
      if (payload.description?.trim()) cleanPayload.description = payload.description.trim();
      if (payload.startDate) cleanPayload.startDate = payload.startDate;
      if (payload.endDate) cleanPayload.endDate = payload.endDate;
      if (payload.location?.trim()) cleanPayload.location = payload.location.trim();
      if (payload.rules?.trim()) cleanPayload.rules = payload.rules.trim();
      if (payload.logoUrl?.trim()) cleanPayload.logoUrl = payload.logoUrl.trim();
      if (payload.bannerUrl?.trim()) cleanPayload.bannerUrl = payload.bannerUrl.trim();

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

  updateTournament: async (
    tournamentId: string,
    payload: UpdateTournamentPayload
  ): Promise<Tournament> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const response = await axiosInstance.put<ApiResponse<Tournament>>(
        API_PATHS.TOURNAMENT.UPDATE_TOURNAMENT(tournamentId),
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to update tournament"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update tournament"));
    }
  },

  deleteTournament: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("Tournament ID is required");

      await axiosInstance.delete(API_PATHS.TOURNAMENT.DELETE_TOURNAMENT(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete tournament"));
    }
  },
};
