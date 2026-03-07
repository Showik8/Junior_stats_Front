import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  AuditLog,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const auditService = {
  /**
   * Get audit logs with pagination and filtering
   */
  getAuditLogs: async (params?: {
    entity?: string;
    entityId?: string;
    adminId?: number;
    page?: number;
    limit?: number;
    sortOrder?: "asc" | "desc";
  }): Promise<{ logs: AuditLog[]; total: number; page: number; limit: number; totalPages: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.entity) queryParams.set("entity", params.entity);
      if (params?.entityId) queryParams.set("entityId", params.entityId);
      if (params?.adminId) queryParams.set("adminId", String(params.adminId));
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.limit) queryParams.set("limit", String(params.limit));
      if (params?.sortOrder) queryParams.set("sortOrder", params.sortOrder);

      const response = await axiosInstance.get<ApiResponse<AuditLog[]>>(
        `${API_PATHS.AUDIT_LOGS.LIST}?${queryParams.toString()}`
      );

      return {
        logs: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 20,
        totalPages: response.data.meta?.totalPages || 0,
      };
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch audit logs"));
    }
  },

  /**
   * Get audit logs for a specific entity
   */
  getEntityAuditLogs: async (entity: string, entityId: string): Promise<AuditLog[]> => {
    try {
      if (!entity || !entityId) {
        throw new Error("Entity type and entity ID are required");
      }

      const response = await axiosInstance.get<ApiResponse<AuditLog[]>>(
        API_PATHS.AUDIT_LOGS.ENTITY(entity, entityId)
      );

      if (!response.data.success || !response.data.data) {
        return [];
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch entity audit logs"));
    }
  },
};
