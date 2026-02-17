import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  TeamAdminAssignment,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const teamAdminService = {
  /**
   * Get all team admin assignments
   */
  getAll: async (): Promise<TeamAdminAssignment[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<TeamAdminAssignment[]>>(
        API_PATHS.TEAM_ADMINS.BASE
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch team admin assignments"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch team admin assignments"));
    }
  },

  /**
   * Get team admin assignment by ID
   */
  getById: async (id: number): Promise<TeamAdminAssignment> => {
    try {
      if (!id) throw new Error("Assignment ID is required");

      const response = await axiosInstance.get<ApiResponse<TeamAdminAssignment>>(
        API_PATHS.TEAM_ADMINS.GET_BY_ID(id)
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
  getByAdmin: async (adminId: number): Promise<TeamAdminAssignment[]> => {
    try {
      if (!adminId) throw new Error("Admin ID is required");

      const response = await axiosInstance.get<ApiResponse<TeamAdminAssignment[]>>(
        API_PATHS.TEAM_ADMINS.BY_ADMIN(adminId)
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch admin team assignments"));
    }
  },

  /**
   * Get assignments by team ID
   */
  getByTeam: async (teamId: string): Promise<TeamAdminAssignment[]> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const response = await axiosInstance.get<ApiResponse<TeamAdminAssignment[]>>(
        API_PATHS.TEAM_ADMINS.BY_TEAM(teamId)
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch team assignments"));
    }
  },

  /**
   * Create a new team admin assignment
   */
  create: async (adminId: number, teamId: string): Promise<TeamAdminAssignment> => {
    try {
      if (!adminId || !teamId) {
        throw new Error("Admin ID and Team ID are required");
      }

      const response = await axiosInstance.post<ApiResponse<TeamAdminAssignment>>(
        API_PATHS.TEAM_ADMINS.BASE,
        { adminId, teamId }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create assignment"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create team admin assignment"));
    }
  },

  /**
   * Delete a team admin assignment
   */
  delete: async (id: number): Promise<void> => {
    try {
      if (!id) throw new Error("Assignment ID is required");

      await axiosInstance.delete(API_PATHS.TEAM_ADMINS.GET_BY_ID(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete assignment"));
    }
  },
};
