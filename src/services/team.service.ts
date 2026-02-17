import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Team,
  CreateTeamPayload,
  AgeCategory,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const teamService = {
  searchTeams: async (
    search: string,
    ageCategory?: AgeCategory
  ): Promise<Team[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (ageCategory) queryParams.append("ageCategory", ageCategory);

      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      console.error("Failed to search teams:", error);
      return [];
    }
  },

  getTeams: async (
    tournamentId: string,
    ageCategory: AgeCategory
  ): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?tournamentId=${tournamentId}&ageCategory=${ageCategory}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch teams"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch teams"));
    }
  },

  getAllClubs: async (search?: string): Promise<Team[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      
      const response = await axiosInstance.get<ApiResponse<Team[]>>(
        `${API_PATHS.TEAMS.GET_TEAMS}?${queryParams.toString()}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch clubs"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch clubs"));
    }
  },

  addTeam: async (payload: CreateTeamPayload): Promise<Team> => {
    try {
      if (!payload.name?.trim()) {
        throw new Error("Team name is required");
      }
      if (!payload.ageCategory) {
        throw new Error("Age category is required");
      }

      const cleanPayload: Partial<CreateTeamPayload> = {
        name: payload.name.trim(),
        ageCategory: payload.ageCategory,
      };

      if (payload.tournamentId?.trim()) {
        cleanPayload.tournamentId = payload.tournamentId;
      }
      if (payload.logo?.trim()) {
        cleanPayload.logo = payload.logo.trim();
      } else {
        cleanPayload.logo = null;
      }
      
      if (payload.coach?.trim()) {
        cleanPayload.coach = payload.coach.trim();
      } else {
        cleanPayload.coach = null;
      }
      
      if (payload.adminEmail?.trim()) {
        cleanPayload.adminEmail = payload.adminEmail.trim();
      }

      const response = await axiosInstance.post<ApiResponse<Team>>(
        API_PATHS.TEAMS.ADD_TEAM,
        cleanPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create team"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to add team"));
    }
  },

  updateTeam: async (
    teamId: string,
    payload: Partial<CreateTeamPayload>
  ): Promise<Team> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const cleanPayload: Partial<CreateTeamPayload> = {};
      
      if (payload.name?.trim()) cleanPayload.name = payload.name.trim();
      if (payload.logo !== undefined) cleanPayload.logo = payload.logo;
      if (payload.coach !== undefined) cleanPayload.coach = payload.coach;
      if (payload.ageCategory) cleanPayload.ageCategory = payload.ageCategory;
      if (payload.adminEmail !== undefined) cleanPayload.adminEmail = payload.adminEmail;

      const response = await axiosInstance.put<ApiResponse<Team>>(
        API_PATHS.TEAMS.UPDATE_TEAM(teamId),
        cleanPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to update team"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update team"));
    }
  },

  assignTeamToTournament: async (
    teamId: string,
    tournamentId: string
  ): Promise<void> => {
    try {
      if (!teamId || !tournamentId) {
        throw new Error("Team ID and Tournament ID are required");
      }

      const response = await axiosInstance.post<ApiResponse<void>>(
        `${API_PATHS.TEAMS.BASE}/${teamId}/join`,
        { tournamentId }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message || "Failed to assign team to tournament"
        );
      }
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to assign team to tournament"));
    }
  },

  removeTeam: async (teamId: string): Promise<void> => {
    try {
      if (!teamId) {
        throw new Error("Team ID is required");
      }

      await axiosInstance.delete(API_PATHS.TEAMS.REMOVE_TEAM(teamId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to remove team"));
    }
  },

  removeTeamFromTournament: async (
    teamId: string,
    tournamentId: string
  ): Promise<void> => {
    try {
      if (!teamId || !tournamentId) {
        throw new Error("Team ID and Tournament ID are required");
      }

      await axiosInstance.delete(
        `${API_PATHS.TEAMS.BASE}/${teamId}/tournaments/${tournamentId}`
      );
    } catch (error: unknown) {
      throw new Error(
        extractErrorMessage(error, "Failed to remove team from tournament")
      );
    }
  },

  getMyTeamInfo: async (): Promise<Team> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Team>>(
        API_PATHS.TEAMS.GET_TEAM_INFO
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch team info"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch team info"));
    }
  },

  getTeamStats: async (teamId: string): Promise<unknown> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const response = await axiosInstance.get<ApiResponse<unknown>>(
        API_PATHS.TEAMS.GET_TEAM_STATS(teamId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch team stats"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch team stats"));
    }
  },
};
