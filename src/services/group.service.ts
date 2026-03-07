import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Group,
  CreateGroupPayload,
  AgeCategory,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const groupService = {
  getGroups: async (
    tournamentId: string,
    ageCategory?: AgeCategory
  ): Promise<Group[]> => {
    try {
      if (!tournamentId) throw new Error("Tournament ID is required");

      const params = new URLSearchParams({ tournamentId });
      if (ageCategory) params.append("ageCategory", ageCategory);

      const response = await axiosInstance.get<ApiResponse<Group[]>>(
        `${API_PATHS.GROUPS.GET_GROUPS}?${params.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch groups"));
    }
  },

  createGroup: async (payload: CreateGroupPayload): Promise<Group> => {
    try {
      if (!payload.name?.trim()) throw new Error("Group name is required");
      if (!payload.tournamentId) throw new Error("Tournament ID is required");
      if (!payload.ageCategory) throw new Error("Age category is required");

      const response = await axiosInstance.post<ApiResponse<Group>>(
        API_PATHS.GROUPS.CREATE_GROUP,
        {
          name: payload.name.trim(),
          tournamentId: payload.tournamentId,
          ageCategory: payload.ageCategory,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create group"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create group"));
    }
  },

  updateGroup: async (
    groupId: string,
    payload: { name?: string }
  ): Promise<Group> => {
    try {
      if (!groupId) throw new Error("Group ID is required");

      const response = await axiosInstance.put<ApiResponse<Group>>(
        API_PATHS.GROUPS.UPDATE_GROUP(groupId),
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to update group"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update group"));
    }
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    try {
      if (!groupId) throw new Error("Group ID is required");

      await axiosInstance.delete(API_PATHS.GROUPS.DELETE_GROUP(groupId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete group"));
    }
  },
};
