import api from "./axios";
import publicApi from "./publicApi";

/**
 * ======================
 * 🔐 LOGIN
 * ======================
 */
export const loginUser = (data) =>
  publicApi.post("/auth/login/", data);

/**
 * ======================
 * 👤 GET CURRENT USER
 * ======================
 */
export const getMe = () => api.get("/auth/me/");

/**
 * ======================
 * 🚪 LOGOUT
 * ======================
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
};