import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // Expires in 1 day
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
};

export const setUserRole = (role: string) => {
  Cookies.set(ROLE_KEY, role, { expires: 1 });
};

export const getUserRole = () => {
  return Cookies.get(ROLE_KEY);
};
