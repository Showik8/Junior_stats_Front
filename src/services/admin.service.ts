import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Admin,
  CreateAdminPayload,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const adminCrudService = {
  getAdmins: async (): Promise<Admin[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Admin[]>>(
        API_PATHS.ADMIN.LIST
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch admins"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch admins"));
    }
  },

  createAdmin: async (payload: CreateAdminPayload): Promise<Admin> => {
    try {
      if (!payload.email || !payload.password || !payload.role) {
        throw new Error("Email, password and role are required");
      }

      const response = await axiosInstance.post<ApiResponse<Admin>>(
        API_PATHS.ADMIN.CREATE,
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to create admin"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create admin"));
    }
  },

  updateAdmin: async (
    id: number,
    payload: Partial<CreateAdminPayload>
  ): Promise<Admin> => {
    try {
      if (!id) throw new Error("Admin ID is required");

      const response = await axiosInstance.put<ApiResponse<Admin>>(
        API_PATHS.ADMIN.UPDATE(id),
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to update admin"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update admin"));
    }
  },

  deleteAdmin: async (id: number): Promise<void> => {
    try {
      if (!id) throw new Error("Admin ID is required");

      await axiosInstance.delete(API_PATHS.ADMIN.DELETE(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete admin"));
    }
  },
};
