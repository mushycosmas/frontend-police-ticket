// src/types/team.types.ts

/**
 * Team member role within the team
 */
export type TeamMemberRole = 'LEADER' | 'MEMBER' | 'SUPERVISOR';

/**
 * Team status options
 */
export type TeamStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

/**
 * Team member information
 */
export interface TeamMember {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: TeamMemberRole;
  joined_at: string;
  avatar?: string;
}

/**
 * Team performance metrics
 */
export interface TeamMetrics {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  avg_response_time: number; // in hours
  avg_resolution_time: number; // in hours
  satisfaction_rate: number; // percentage
  tickets_by_priority: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Main Team interface
 */
export interface Team {
  id: number;
  name: string;
  description?: string;
  status: TeamStatus;
  department?: string;
  leader_id?: number;
  leader_name?: string;
  member_count: number;
  created_at: string;
  updated_at: string;
  members?: TeamMember[];
  metrics?: TeamMetrics;
  permissions?: string[];
}

/**
 * Team creation payload
 */
export interface CreateTeamPayload {
  name: string;
  description?: string;
  department?: string;
  leader_id?: number;
  status?: TeamStatus;
}

/**
 * Team update payload
 */
export interface UpdateTeamPayload extends Partial<CreateTeamPayload> {
  id: number;
  status?: TeamStatus;
}

/**
 * Team member assignment payload
 */
export interface AssignTeamMemberPayload {
  team_id: number;
  user_id: number;
  role?: TeamMemberRole;
}

/**
 * Team member removal payload
 */
export interface RemoveTeamMemberPayload {
  team_id: number;
  user_id: number;
}

/**
 * Team list query parameters
 */
export interface TeamListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: TeamStatus;
  department?: string;
  ordering?: string;
}

/**
 * Team list response
 */
export interface TeamListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Team[];
}

/**
 * Team statistics
 */
export interface TeamStatistics {
  total_teams: number;
  active_teams: number;
  inactive_teams: number;
  total_members: number;
  avg_members_per_team: number;
  teams_by_department: {
    department: string;
    count: number;
  }[];
}

/**
 * Team activity log
 */
export interface TeamActivity {
  id: number;
  team_id: number;
  team_name: string;
  action: string;
  user_id: number;
  user_name: string;
  details: Record<string, any>;
  created_at: string;
}

/**
 * Team performance report
 */
export interface TeamPerformanceReport {
  team_id: number;
  team_name: string;
  period_start: string;
  period_end: string;
  metrics: TeamMetrics;
  top_performers: {
    user_id: number;
    user_name: string;
    tickets_resolved: number;
    avg_response_time: number;
  }[];
  improvements: string[];
  recommendations: string[];
}

/**
 * Team notification settings
 */
export interface TeamNotificationSettings {
  team_id: number;
  email_notifications: boolean;
  slack_notifications: boolean;
  daily_digest: boolean;
  weekly_report: boolean;
  on_ticket_assigned: boolean;
  on_ticket_resolved: boolean;
  on_ticket_escalated: boolean;
  on_member_joined: boolean;
  on_member_left: boolean;
}

/**
 * Team permission matrix
 */
export interface TeamPermissions {
  can_view_team: boolean;
  can_edit_team: boolean;
  can_delete_team: boolean;
  can_add_members: boolean;
  can_remove_members: boolean;
  can_assign_tickets: boolean;
  can_view_reports: boolean;
  can_manage_settings: boolean;
}

/**
 * Team creation response
 */
export interface CreateTeamResponse {
  success: boolean;
  data?: Team;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Team member response
 */
export interface TeamMemberResponse {
  success: boolean;
  data?: TeamMember;
  message?: string;
}