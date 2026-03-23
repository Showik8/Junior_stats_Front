import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import type {
  FootballSchool,
  CreateSchoolPayload,
  UpdateSchoolPayload,
  TransferPlayerPayload,
  SchoolStats,
  PlayerTransfer,
  SchoolListMeta,
} from "../types/school.types";
import type { ApiResponse } from "@/types/admin";

export const schoolService = {
  getSchools: async (
    params?: { page?: number; limit?: number; search?: string; city?: string }
  ): Promise<{ schools: FootballSchool[]; meta: SchoolListMeta }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.search) queryParams.append("search", params.search);
    if (params?.city) queryParams.append("city", params.city);

    const response = await axiosInstance.get<ApiResponse<FootballSchool[]>>(
      `${API_PATHS.SCHOOLS.LIST}?${queryParams.toString()}`
    );

    return {
      schools: response.data.data || [],
      meta: response.data.meta as SchoolListMeta,
    };
  },

  getSchoolById: async (id: string): Promise<FootballSchool> => {
    const response = await axiosInstance.get<ApiResponse<FootballSchool>>(
      API_PATHS.SCHOOLS.DETAIL(id)
    );
    return response.data.data!;
  },

  getMySchool: async (): Promise<FootballSchool> => {
    const response = await axiosInstance.get<ApiResponse<FootballSchool>>(
      API_PATHS.SCHOOLS.MY_SCHOOL
    );
    return response.data.data!;
  },

  createSchool: async (data: CreateSchoolPayload): Promise<FootballSchool> => {
    const response = await axiosInstance.post<ApiResponse<FootballSchool>>(
      API_PATHS.SCHOOLS.CREATE,
      data
    );
    return response.data.data!;
  },

  updateSchool: async (id: string, data: UpdateSchoolPayload): Promise<FootballSchool> => {
    const response = await axiosInstance.put<ApiResponse<FootballSchool>>(
      API_PATHS.SCHOOLS.UPDATE(id),
      data
    );
    return response.data.data!;
  },

  deleteSchool: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_PATHS.SCHOOLS.DELETE(id));
  },

  getSchoolStats: async (id: string): Promise<SchoolStats> => {
    const response = await axiosInstance.get<ApiResponse<SchoolStats>>(
      API_PATHS.SCHOOLS.STATS(id)
    );
    return response.data.data!;
  },

  assignTeamToSchool: async (schoolId: string, teamId: string) => {
    const response = await axiosInstance.post(
      API_PATHS.SCHOOLS.ASSIGN_TEAM(schoolId),
      { teamId }
    );
    return response.data.data;
  },

  removeTeamFromSchool: async (schoolId: string, teamId: string): Promise<void> => {
    await axiosInstance.delete(API_PATHS.SCHOOLS.REMOVE_TEAM(schoolId, teamId));
  },

  transferPlayer: async (
    schoolId: string,
    data: TransferPlayerPayload
  ): Promise<PlayerTransfer> => {
    const response = await axiosInstance.post<ApiResponse<PlayerTransfer>>(
      API_PATHS.SCHOOLS.TRANSFER(schoolId),
      data
    );
    return response.data.data!;
  },

  getTransferHistory: async (
    schoolId: string,
    params?: { playerId?: string; page?: number; limit?: number }
  ): Promise<{ transfers: PlayerTransfer[]; meta: SchoolListMeta }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.playerId) queryParams.append("playerId", params.playerId);

    const response = await axiosInstance.get<ApiResponse<PlayerTransfer[]>>(
      `${API_PATHS.SCHOOLS.TRANSFERS(schoolId)}?${queryParams.toString()}`
    );

    return {
      transfers: response.data.data || [],
      meta: response.data.meta as SchoolListMeta,
    };
  },

  assignSchoolAdmin: async (schoolId: string, adminId: number) => {
    const response = await axiosInstance.post(
      API_PATHS.SCHOOLS.ASSIGN_ADMIN,
      { schoolId, adminId }
    );
    return response.data.data;
  },

  removeSchoolAdmin: async (schoolId: string, adminId: number): Promise<void> => {
    await axiosInstance.delete(API_PATHS.SCHOOLS.REMOVE_ADMIN(schoolId, adminId));
  },

  getPublicSchools: async (
    params?: { page?: number; search?: string }
  ): Promise<{ schools: FootballSchool[]; meta: SchoolListMeta }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.search) queryParams.append("search", params.search);

    const response = await axiosInstance.get<ApiResponse<FootballSchool[]>>(
      `${API_PATHS.PUBLIC.SCHOOLS}?${queryParams.toString()}`
    );

    return {
      schools: response.data.data || [],
      meta: response.data.meta as SchoolListMeta,
    };
  },

  getPublicSchool: async (id: string): Promise<FootballSchool> => {
    const response = await axiosInstance.get<ApiResponse<FootballSchool>>(
      API_PATHS.PUBLIC.SCHOOL_DETAIL(id)
    );
    return response.data.data!;
  },
};
