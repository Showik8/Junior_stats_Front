import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Referee,
  MatchReferee,
  CreateRefereePayload,
  UpdateRefereePayload,
  RefereeRole,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const refereeService = {
  // --- CRUD (Super Admin) ---

  getReferees: async (search?: string): Promise<Referee[]> => {
    try {
      const params = search ? { search } : {};
      const response = await axiosInstance.get<ApiResponse<Referee[]>>(
        API_PATHS.REFEREES.LIST,
        { params }
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch referees");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch referees"));
    }
  },

  createReferee: async (payload: CreateRefereePayload): Promise<Referee> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Referee>>(
        API_PATHS.REFEREES.CREATE,
        payload
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to create referee");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create referee"));
    }
  },

  getReferee: async (id: number): Promise<Referee> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Referee>>(
        API_PATHS.REFEREES.GET_BY_ID(id)
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch referee");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch referee"));
    }
  },

  updateReferee: async (id: number, payload: UpdateRefereePayload): Promise<Referee> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Referee>>(
        API_PATHS.REFEREES.UPDATE(id),
        payload
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to update referee");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update referee"));
    }
  },

  deleteReferee: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(API_PATHS.REFEREES.DELETE(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete referee"));
    }
  },

  // --- Match Assignment (Tournament Admin) ---

  assignToMatch: async (
    matchId: string,
    refereeId: number,
    role?: RefereeRole
  ): Promise<MatchReferee> => {
    try {
      const response = await axiosInstance.post<ApiResponse<MatchReferee>>(
        API_PATHS.REFEREES.ASSIGN,
        { matchId, refereeId, role }
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to assign referee");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to assign referee"));
    }
  },

  removeFromMatch: async (matchId: string, refereeId: number): Promise<void> => {
    try {
      await axiosInstance.delete(
        API_PATHS.REFEREES.REMOVE_ASSIGNMENT(matchId, refereeId)
      );
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to remove referee assignment"));
    }
  },

  getMatchReferees: async (matchId: string): Promise<MatchReferee[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<MatchReferee[]>>(
        API_PATHS.REFEREES.BY_MATCH(matchId)
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch match referees");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch match referees"));
    }
  },

  // --- Referee Dashboard ---

  getMyMatches: async (status?: string): Promise<MatchReferee[]> => {
    try {
      const params = status ? { status } : {};
      const response = await axiosInstance.get<ApiResponse<MatchReferee[]>>(
        API_PATHS.REFEREES.MY_MATCHES,
        { params }
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch matches");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch matches"));
    }
  },

  getMyProfile: async (): Promise<Referee> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Referee>>(
        API_PATHS.REFEREES.ME
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to fetch profile");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch profile"));
    }
  },
};
