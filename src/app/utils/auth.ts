import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ROLE_KEY = "user_role";

/** Secure flag: only send cookies over HTTPS in production */
const IS_SECURE = typeof window !== "undefined" && window.location.protocol === "https:";

const baseCookieOptions: Cookies.CookieAttributes = {
  sameSite: "strict",
  secure: IS_SECURE,
};

// ─── Access Token (15 minutes) ───────────────────────────────────────────────

export const setToken = (token: string) => {
  // 15 minutes in fractional days (for js-cookie)
  Cookies.set(TOKEN_KEY, token, { ...baseCookieOptions, expires: 1 / 96 });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

// ─── Refresh Token (7 days) ───────────────────────────────────────────────────

export const setRefreshToken = (token: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { ...baseCookieOptions, expires: 7 });
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = () => {
  Cookies.remove(REFRESH_TOKEN_KEY);
};

// ─── Role ─────────────────────────────────────────────────────────────────────

export const setUserRole = (role: string) => {
  Cookies.set(ROLE_KEY, role, { ...baseCookieOptions, expires: 7 });
};

export const getUserRole = () => {
  return Cookies.get(ROLE_KEY);
};

export const removeUserRole = () => {
  Cookies.remove(ROLE_KEY);
};

// ─── Clear all auth state ─────────────────────────────────────────────────────

export const clearAuth = () => {
  removeToken();
  removeRefreshToken();
  removeUserRole();
};
