import api from "./axios";

// Get all teams
export const getTeams = () => api.get("/auth/teams/");

// Get single team
export const getTeam = (id: number) => api.get(`/auth/teams/${id}/`);

// Create team
export const createTeam = (data: any) => api.post("/auth/teams/", data);

// Update team
export const updateTeam = (id: number, data: any) => api.patch(`/auth/teams/${id}/`, data);

// Delete team
export const deleteTeam = (id: number) => api.delete(`/auth/teams/${id}/`);

// Get team members
export const getTeamMembers = (teamId: number) => api.get(`/auth/teams/${teamId}/members/`);

// Add member to team


// Add member to team
export const addTeamMember = (teamId: number, userId: number) => 
  api.post(`/auth/teams/${teamId}/add_member/`, { user_id: userId });

// Remove member from team
export const removeTeamMember = (teamId: number, userId: number) => 
  api.delete(`/auth/teams/${teamId}/remove_member/?user_id=${userId}`);