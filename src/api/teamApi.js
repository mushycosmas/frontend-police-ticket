import api from "./axios";

// =====================
// TEAMS API
// =====================

// GET ALL TEAMS (pagination + search supported)
export const getTeams = () => {
  return api.get("/auth/teams/");
};

// GET SINGLE TEAM
export const getTeam = (id) => {
  return api.get(`/auth/teams/${id}/`);
};

// CREATE TEAM
export const createTeam = (data) => {
  return api.post("/auth/teams/", data);
};

// UPDATE TEAM (partial update)
export const updateTeam = (id, data) => {
  return api.patch(`/auth/teams/${id}/`, data);
};

// DELETE TEAM
export const deleteTeam = (id) => {
  return api.delete(`/auth/teams/${id}/`);
};