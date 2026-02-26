import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Sponsor,
  CreateSponsorPayload,
  UpdateSponsorPayload,
  SponsorTier,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const sponsorService = {
  /**
   * Get all sponsors with optional pagination/search
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    includeTournaments?: boolean;
  }): Promise<{ sponsors: Sponsor[]; total: number; page: number; limit: number; totalPages: number }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.limit) queryParams.set("limit", String(params.limit));
      if (params?.search) queryParams.set("search", params.search);
      if (params?.includeTournaments) queryParams.set("includeTournaments", "true");

      const response = await axiosInstance.get<ApiResponse<Sponsor[]>>(
        `${API_PATHS.SPONSORS.BASE}?${queryParams.toString()}`
      );

      return {
        sponsors: response.data.data || [],
        total: response.data.meta?.total || 0,
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 20,
        totalPages: response.data.meta?.totalPages || 0,
      };
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch sponsors"));
    }
  },

  /**
   * Get a single sponsor by ID
   */
  getById: async (id: string, includeTournaments = false): Promise<Sponsor> => {
    try {
      if (!id) throw new Error("Sponsor ID is required");

      const queryParams = includeTournaments ? "?includeTournaments=true" : "";
      const response = await axiosInstance.get<ApiResponse<Sponsor>>(
        `${API_PATHS.SPONSORS.GET_BY_ID(id)}${queryParams}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Sponsor not found");
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch sponsor"));
    }
  },

  /**
   * Create a new sponsor
   */
  create: async (payload: CreateSponsorPayload): Promise<Sponsor> => {
    try {
      if (!payload.name?.trim()) throw new Error("Sponsor name is required");
      if (!payload.logoUrl?.trim()) throw new Error("Logo URL is required");

      const response = await axiosInstance.post<ApiResponse<Sponsor>>(
        API_PATHS.SPONSORS.BASE,
        {
          name: payload.name.trim(),
          logoUrl: payload.logoUrl.trim(),
          website: payload.website?.trim() || undefined,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to create sponsor");
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to create sponsor"));
    }
  },

  /**
   * Update an existing sponsor
   */
  update: async (id: string, payload: UpdateSponsorPayload): Promise<Sponsor> => {
    try {
      if (!id) throw new Error("Sponsor ID is required");

      const response = await axiosInstance.put<ApiResponse<Sponsor>>(
        API_PATHS.SPONSORS.GET_BY_ID(id),
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to update sponsor");
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update sponsor"));
    }
  },

  /**
   * Delete a sponsor
   */
  delete: async (id: string): Promise<void> => {
    try {
      if (!id) throw new Error("Sponsor ID is required");

      await axiosInstance.delete(API_PATHS.SPONSORS.GET_BY_ID(id));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to delete sponsor"));
    }
  },

  /**
   * Assign sponsor to a tournament with optional tier
   */
  assignToTournament: async (
    sponsorId: string,
    tournamentId: string,
    tier?: SponsorTier
  ): Promise<void> => {
    try {
      if (!sponsorId || !tournamentId) {
        throw new Error("Sponsor ID and Tournament ID are required");
      }

      const response = await axiosInstance.post<ApiResponse<unknown>>(
        API_PATHS.SPONSORS.ASSIGN_TOURNAMENT(sponsorId),
        { tournamentId, tier }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message || "Failed to assign sponsor to tournament"
        );
      }
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to assign sponsor to tournament"));
    }
  },

  /**
   * Remove sponsor from a tournament
   */
  removeFromTournament: async (
    sponsorId: string,
    tournamentId: string
  ): Promise<void> => {
    try {
      if (!sponsorId || !tournamentId) {
        throw new Error("Sponsor ID and Tournament ID are required");
      }

      await axiosInstance.delete(
        API_PATHS.SPONSORS.REMOVE_TOURNAMENT(sponsorId, tournamentId)
      );
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to remove sponsor from tournament"));
    }
  },
};
