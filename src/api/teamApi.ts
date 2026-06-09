// src/api/teamApi.ts
import api from "./axios";

// ================= TYPES =================
export interface Team {
  id: number;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  department?: string;
  leader_id?: number;
  leader_name?: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  role: 'LEADER' | 'MEMBER' | 'SUPERVISOR';
  joined_at: string;
}

export interface TeamListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  department?: string;
}

export interface TeamListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Team[];
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
  department?: string;
  leader_id?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateTeamPayload {
  id?: number;
  name?: string;
  description?: string;
  department?: string;
  leader_id?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface AddMemberPayload {
  user_id: number;
  role?: 'LEADER' | 'MEMBER' | 'SUPERVISOR';
}

// ================= API FUNCTIONS =================

/**
 * Get all teams with optional filtering
 */
export const getTeams = async (params?: TeamListParams): Promise<TeamListResponse> => {
  const response = await api.get("/auth/teams/", { params });
  return response.data;
};

/**
 * Get single team by ID
 */
export const getTeam = async (id: number): Promise<Team> => {
  const response = await api.get(`/auth/teams/${id}/`);
  return response.data;
};

/**
 * Create new team
 */
export const createTeam = async (data: CreateTeamPayload): Promise<Team> => {
  const response = await api.post("/auth/teams/", data);
  return response.data;
};

/**
 * Update team
 */
export const updateTeam = async (id: number, data: UpdateTeamPayload): Promise<Team> => {
  const response = await api.patch(`/auth/teams/${id}/`, data);
  return response.data;
};

/**
 * Delete team
 */
export const deleteTeam = async (id: number): Promise<void> => {
  await api.delete(`/auth/teams/${id}/`);
};

/**
 * Get team members
 */
export const getTeamMembers = async (teamId: number): Promise<TeamMember[]> => {
  const response = await api.get(`/auth/teams/${teamId}/members/`);
  return response.data;
};

/**
 * Add member to team
 */
export const addTeamMember = async (teamId: number, userId: number, role?: string): Promise<TeamMember> => {
  const response = await api.post(`/auth/teams/${teamId}/add_member/`, { 
    user_id: userId,
    role: role || 'MEMBER'
  });
  return response.data;
};

/**
 * Remove member from team
 */
export const removeTeamMember = async (teamId: number, userId: number): Promise<void> => {
  await api.delete(`/auth/teams/${teamId}/remove_member/`, { 
    data: { user_id: userId } 
  });
};

/**
 * Update member role in team
 */
export const updateTeamMemberRole = async (teamId: number, userId: number, role: string): Promise<TeamMember> => {
  const response = await api.patch(`/auth/teams/${teamId}/members/${userId}/`, { role });
  return response.data;
};

/**
 * Get team statistics
 */
export const getTeamStats = async (): Promise<{
  total_teams: number;
  active_teams: number;
  total_members: number;
  avg_members_per_team: number;
}> => {
  const response = await api.get("/auth/teams/stats/");
  return response.data;
};

/**
 * Get team performance metrics
 */
export const getTeamPerformance = async (teamId: number, period?: string): Promise<{
  total_tickets: number;
  resolved_tickets: number;
  avg_response_time: number;
  avg_resolution_time: number;
  satisfaction_rate: number;
}> => {
  const response = await api.get(`/auth/teams/${teamId}/performance/`, { 
    params: { period } 
  });
  return response.data;
};

/**
 * Bulk assign users to team
 */
export const bulkAssignToTeam = async (teamId: number, userIds: number[]): Promise<{
  success: boolean;
  assigned_count: number;
  failed_count: number;
  errors?: any[];
}> => {
  const response = await api.post(`/auth/teams/${teamId}/bulk_assign/`, { user_ids: userIds });
  return response.data;
};