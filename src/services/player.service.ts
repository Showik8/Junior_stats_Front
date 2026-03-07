import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import {
  Player,
  CreatePlayerPayload,
  UpdatePlayerPayload,
  ApiResponse,
} from "@/types/admin";
import { extractErrorMessage } from "./helpers";

export const playerService = {
  getTeamPlayers: async (teamId: string): Promise<Player[]> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const response = await axiosInstance.get<ApiResponse<Player[]>>(
        `${API_PATHS.PLAYERS.GET_PLAYERS}?teamId=${teamId}`
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch players"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch players"));
    }
  },

  getPlayer: async (playerId: string): Promise<Player> => {
    try {
      if (!playerId) throw new Error("Player ID is required");

      const response = await axiosInstance.get<ApiResponse<Player>>(
        API_PATHS.PLAYERS.GET_PLAYER(playerId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch player"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch player"));
    }
  },

  addPlayer: async (payload: CreatePlayerPayload): Promise<Player> => {
    try {
      if (!payload.name?.trim()) throw new Error("Player name is required");
      if (!payload.teamId) throw new Error("Team ID is required");

      const cleanPayload: Partial<CreatePlayerPayload> = {
        name: payload.name.trim(),
        teamId: payload.teamId,
      };

      if (payload.position?.trim()) {
        cleanPayload.position = payload.position.trim();
      } else {
        cleanPayload.position = null;
      }

      if (payload.shirtNumber !== null && payload.shirtNumber !== undefined) {
        cleanPayload.shirtNumber = payload.shirtNumber;
      } else {
        cleanPayload.shirtNumber = null;
      }

      if (payload.photoUrl?.trim()) {
        cleanPayload.photoUrl = payload.photoUrl.trim();
      } else {
        cleanPayload.photoUrl = null;
      }

      if (payload.birthDate) {
        cleanPayload.birthDate = payload.birthDate;
      } else {
        cleanPayload.birthDate = null;
      }

      const response = await axiosInstance.post<ApiResponse<Player>>(
        API_PATHS.PLAYERS.ADD_PLAYER,
        cleanPayload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || "Failed to add player");
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to add player"));
    }
  },

  updatePlayer: async (
    playerId: string,
    payload: UpdatePlayerPayload
  ): Promise<Player> => {
    try {
      if (!playerId) throw new Error("Player ID is required");

      const response = await axiosInstance.put<ApiResponse<Player>>(
        API_PATHS.PLAYERS.UPDATE_PLAYER(playerId),
        payload
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to update player"
        );
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to update player"));
    }
  },

  removePlayer: async (playerId: string): Promise<void> => {
    try {
      if (!playerId) throw new Error("Player ID is required");

      await axiosInstance.delete(API_PATHS.PLAYERS.REMOVE_PLAYER(playerId));
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to remove player"));
    }
  },

  getPlayerCount: async (teamId: string): Promise<number> => {
    try {
      if (!teamId) throw new Error("Team ID is required");

      const response = await axiosInstance.get<ApiResponse<{ count: number }>>(
        API_PATHS.PLAYERS.GET_PLAYER_COUNT(teamId)
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || "Failed to fetch player count"
        );
      }

      return response.data.data.count;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, "Failed to fetch player count"));
    }
  },
};
