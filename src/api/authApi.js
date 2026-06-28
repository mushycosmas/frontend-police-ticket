// src/api/authApi.js
import api from "./axios";
import publicApi from "./publicApi";

// ============================================================
//  LOGIN
// ============================================================
export const loginUser = (data) => publicApi.post("/auth/login/", data);

// ============================================================
// 👤 GET CURRENT USER
// ============================================================
export const getMe = () => api.get("/auth/me/");

// ============================================================
// 🚪 LOGOUT
// ============================================================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};

// ============================================================
//  REFRESH TOKEN
// ============================================================
export const refreshToken = (refresh) => {
  return publicApi.post("/auth/refresh/", { refresh });
};

// ============================================================
// 👤 PROFILE
// ============================================================
export const getProfile = () => {
  return api.get("/auth/profile/");
};

export const updateProfile = (data) => {
  return api.patch("/auth/profile/", data);
};

// ============================================================
// CHANGE PASSWORD
// ============================================================
export const changePassword = (data) => {
  return api.post("/auth/change-password/", data);
};

// ============================================================
//  CHECK DEFAULT PASSWORD
// ============================================================
export const checkDefaultPassword = () => {
  return api.get("/auth/check-default-password/");
};

// ============================================================
// USER PERMISSIONS
// ============================================================
export const getUserPermissions = (userId) => {
  return api.get(`/auth/users/${userId}/permissions/`);
};

export const getCurrentUserPermissions = () => {
  return api.get("/auth/me/permissions/");
};