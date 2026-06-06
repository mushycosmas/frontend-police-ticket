export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role: 'ADMIN' | 'MANAGER' | 'TEAM_LEAD' | 'AGENT' | 'QA_ANALYST';
  team_id?: number | null;
  team_name?: string | null;
  is_active: boolean;
  last_login?: string;
  date_joined?: string;
}

export interface UserTicket {
  id: number;
  ticket_number: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at?: string;
  customer_name?: string;
}

export interface UserStats {
  total_assigned: number;
  total_resolved: number;
  total_in_progress: number;
  total_open: number;
  total_closed: number;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  lead_id?: number;
  member_count?: number;
}