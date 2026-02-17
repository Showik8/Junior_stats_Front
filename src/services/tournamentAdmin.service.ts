import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  TournamentAdminAssignment,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const tournamentAdminService = {
  /**
   * Get all tournament admin assignments
   */
  getAll: async (): Promise<TournamentAdminAssignment[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<TournamentAdminAssignment[]>>(
        API_PATHS.TOURNAMENT_ADMINS.BASE
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch tournament admin assignments"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch tournament admin assignments"));
    }
  },

  /**
   * Get tournament admin assignment by ID
   */
  getById: async (id: number): Promise<TournamentAdminAssignment> => {
    try {
      if (!id) throw new Error("Assignment ID is required");

      const response = await axiosInstance.get<ApiResponse<TournamentAdminAssignment>>(
        API_PATHS.TOURNAMENT_ADMINS.GET_BY_ID(id)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch assignment"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch assignment"));
    }
  },

  /**
   * Get assignments by admin ID
   */
  getByAdmin: async (adminId: number): Promise<TournamentAdminAssignment[]> => {
    try {
      if (!adminId) throw new Error("Admin ID is required");

      const response = await axiosInstance.get<ApiResponse<TournamentAdminAssignment[]>>(
        API_PATHS.TOURNAMENT_ADMINS.BY_ADMIN(adminId)
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch admin assignments"));
    }
  },

  /**
   * Get assignments by tournament ID
   */
  getByTournament: async (tournamentId: string): Promise<TournamentAdminAssignment[]> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const response = await axiosInstance.get<ApiResponse<TournamentAdminAssignment[]>>(
        API_PATHS.TOURNAMENT_ADMINS.BY_TOURNAMENT(tournamentId)
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch tournament assignments"));
    }
  },

  /**
   * Create a new tournament admin assignment
   */
  create: async (adminId: number, tournamentId: string): Promise<TournamentAdminAssignment> => {
    try {
      if (!adminId || !tournamentId) {
        throw new Error("Admin ID and Tournament ID are required");
      }

      const response = await axiosInstance.post<ApiResponse<TournamentAdminAssignment>>(
        API_PATHS.TOURNAMENT_ADMINS.BASE,
        { adminId, tournamentId }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create assignment"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create tournament admin assignment"));
    }
  },

  /**
   * Delete a tournament admin assignment
   */
  delete: async (id: number): Promise<void> => {
    try {
      if (!id) throw new Error("Assignment ID is required");

      await axiosInstance.delete(API_PATHS.TOURNAMENT_ADMINS.GET_BY_ID(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete assignment"));
    }
  },
};
