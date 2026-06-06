import api from "./axios";

// ======================
// USERS CRUD
// ======================

// Get all users with optional params
export const getUsers = (params?: { search?: string; role?: string; team?: number }) =>
    api.get("/auth/users/", { params });

// Get single user by id
export const getUser = (id: number) => api.get(`/auth/users/${id}/`);

// Create new user
export const createUser = (data: any) => api.post("/auth/users/", data);

// Update user
export const updateUser = (id: number, data: any) => api.patch(`/auth/users/${id}/`, data);

// Delete user
export const deleteUser = (id: number) => api.delete(`/auth/users/${id}/`);

// Reset user password
export const resetUserPassword = (id: number) => api.post(`/auth/users/${id}/reset_password/`);

// ======================
// USER TICKETS
// ======================

// Get tickets assigned to a user
export const getUserTickets = (userId: number, params?: { status?: string; priority?: string }) =>
    api.get(`/auth/users/${userId}/tickets/`, { params });

// Get user statistics
export const getUserStats = (userId: number) => api.get(`/auth/users/${userId}/stats/`);

// ======================
// TEAMS
// ======================

// Get all teams
export const getTeams = () => api.get("/auth/teams/");

// Get team by id
export const getTeam = (id: number) => api.get(`/auth/teams/${id}/`);

// Get team members
export const getTeamMembers = (teamId: number) => api.get(`/auth/teams/${teamId}/members/`);

// ======================
// SEARCH
// ======================

// Search users
export const searchUsers = (query: string) => api.get("/auth/users/", { params: { search: query } });

// Get users by role
export const getUsersByRole = (role: string) => api.get("/auth/users/", { params: { role } });