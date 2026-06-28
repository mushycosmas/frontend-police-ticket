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
  ordering?: string;
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

export interface BulkAssignPayload {
  user_ids: number[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ================= HELPERS =================

/**
 * Normalize API response to always return an array
 */
export const normalizeList = (response: any): any[] => {
  if (!response) return [];
  
  // If response is already an array
  if (Array.isArray(response)) {
    return response;
  }
  
  // If response.data is an array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // If response.data.results is an array (paginated)
  if (response.data?.results && Array.isArray(response.data.results)) {
    return response.data.results;
  }
  
  // If response.results is an array
  if (response.results && Array.isArray(response.results)) {
    return response.results;
  }
  
  // If response.data.data is an array (nested)
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  return [];
};

/**
 * Normalize a single item response
 */
export const normalizeItem = <T>(response: any): T | null => {
  if (!response) return null;
  
  // If response is the item itself
  if (response.id !== undefined) {
    return response as T;
  }
  
  // If response.data is the item
  if (response.data && response.data.id !== undefined) {
    return response.data as T;
  }
  
  return null;
};

// ================= API FUNCTIONS =================

/**
 * Get all teams (without pagination)
 */
export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get("/auth/teams/all_teams/");
    return normalizeList(response.data);
  } catch (error) {
    console.error("Error fetching all teams:", error);
    throw error;
  }
};

/**
 * Get teams with pagination and filtering
 */
export const getTeams = async (params?: TeamListParams): Promise<TeamListResponse> => {
  try {
    const response = await api.get("/auth/teams/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

/**
 * Get single team by ID
 */
export const getTeam = async (id: number): Promise<Team> => {
  try {
    const response = await api.get(`/auth/teams/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error);
    throw error;
  }
};

/**
 * Create new team
 */
export const createTeam = async (data: CreateTeamPayload): Promise<Team> => {
  try {
    const response = await api.post("/auth/teams/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

/**
 * Update team
 */
export const updateTeam = async (id: number, data: UpdateTeamPayload): Promise<Team> => {
  try {
    const response = await api.patch(`/auth/teams/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating team ${id}:`, error);
    throw error;
  }
};

/**
 * Delete team
 */
export const deleteTeam = async (id: number): Promise<ApiResponse> => {
  try {
    await api.delete(`/auth/teams/${id}/`);
    return { success: true, message: "Team deleted successfully" };
  } catch (error: any) {
    console.error(`Error deleting team ${id}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete team",
    };
  }
};

/**
 * Get team members
 */
export const getTeamMembers = async (teamId: number): Promise<TeamMember[]> => {
  try {
    const response = await api.get(`/auth/teams/${teamId}/members/`);
    return normalizeList(response.data);
  } catch (error) {
    console.error(`Error fetching members for team ${teamId}:`, error);
    throw error;
  }
};

/**
 * Add member to team
 */
export const addTeamMember = async (
  teamId: number,
  userId: number,
  role: string = 'MEMBER'
): Promise<TeamMember> => {
  try {
    const payload: AddMemberPayload = {
      user_id: userId,
      role: role as 'LEADER' | 'MEMBER' | 'SUPERVISOR',
    };
    const response = await api.post(`/auth/teams/${teamId}/add_member/`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error adding member to team ${teamId}:`, error);
    throw error;
  }
};

/**
 * Remove member from team
 */
export const removeTeamMember = async (teamId: number, userId: number): Promise<ApiResponse> => {
  try {
    await api.delete(`/auth/teams/${teamId}/remove_member/`, {
      data: { user_id: userId },
    });
    return { success: true, message: "Member removed successfully" };
  } catch (error: any) {
    console.error(`Error removing member from team ${teamId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to remove member",
    };
  }
};

/**
 * Update member role in team
 */
export const updateTeamMemberRole = async (
  teamId: number,
  userId: number,
  role: string
): Promise<TeamMember> => {
  try {
    const response = await api.patch(`/auth/teams/${teamId}/members/${userId}/`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating member role in team ${teamId}:`, error);
    throw error;
  }
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
  try {
    const response = await api.get("/auth/teams/stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return {
      total_teams: 0,
      active_teams: 0,
      total_members: 0,
      avg_members_per_team: 0,
    };
  }
};

/**
 * Get team performance metrics
 */
export const getTeamPerformance = async (
  teamId: number,
  period?: string
): Promise<{
  total_tickets: number;
  resolved_tickets: number;
  avg_response_time: number;
  avg_resolution_time: number;
  satisfaction_rate: number;
}> => {
  try {
    const response = await api.get(`/auth/teams/${teamId}/performance/`, {
      params: { period },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance for team ${teamId}:`, error);
    return {
      total_tickets: 0,
      resolved_tickets: 0,
      avg_response_time: 0,
      avg_resolution_time: 0,
      satisfaction_rate: 0,
    };
  }
};

/**
 * Bulk assign users to team
 */
export const bulkAssignToTeam = async (
  teamId: number,
  userIds: number[]
): Promise<{
  success: boolean;
  assigned_count: number;
  failed_count: number;
  errors?: any[];
}> => {
  try {
    const payload: BulkAssignPayload = { user_ids: userIds };
    const response = await api.post(`/auth/teams/${teamId}/bulk_assign/`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Error bulk assigning to team ${teamId}:`, error);
    return {
      success: false,
      assigned_count: 0,
      failed_count: userIds.length,
      errors: [{ error: error.response?.data?.message || "Bulk assignment failed" }],
    };
  }
};

/**
 * Get available users for team (users not in any team)
 */
export const getAvailableUsers = async (teamId?: number): Promise<any[]> => {
  try {
    const params = teamId ? { exclude_team: teamId } : {};
    const response = await api.get("/auth/users/available/", { params });
    return normalizeList(response.data);
  } catch (error) {
    console.error("Error fetching available users:", error);
    return [];
  }
};

/**
 * Get team activity log
 */
export const getTeamActivity = async (
  teamId: number,
  params?: {
    page?: number;
    page_size?: number;
    action?: string;
  }
): Promise<{ results: any[]; count: number }> => {
  try {
    const response = await api.get(`/auth/teams/${teamId}/activity/`, { params });
    return {
      results: normalizeList(response.data),
      count: response.data?.count || 0,
    };
  } catch (error) {
    console.error(`Error fetching activity for team ${teamId}:`, error);
    return { results: [], count: 0 };
  }
};

/**
 * Get team by name (search)
 */
export const searchTeams = async (query: string): Promise<Team[]> => {
  try {
    const response = await api.get("/auth/teams/search/", {
      params: { q: query },
    });
    return normalizeList(response.data);
  } catch (error) {
    console.error(`Error searching teams with query "${query}":`, error);
    return [];
  }
};