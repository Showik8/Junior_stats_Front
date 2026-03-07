import axios from "axios";
import {
  getToken,
  setToken,
  getRefreshToken,
  clearAuth,
} from "./auth";
import { BASE_URL, API_PATHS } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor: attach access token ─────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: silent refresh on 401 ─────────────────────────────
let isRefreshing = false;
// Queue of requests waiting for a new access token
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors (not on the refresh endpoint itself)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== API_PATHS.ADMIN.REFRESH
    ) {
      const refreshToken = getRefreshToken();

      // No refresh token available — clear auth and redirect
      if (!refreshToken) {
        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint
        const refreshResponse = await axios.post(
          `${BASE_URL}${API_PATHS.ADMIN.REFRESH}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token in refresh response");

        setToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
