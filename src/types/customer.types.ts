import { TicketStatus, TicketPriority } from "./index";

export interface Customer {
  id: number;
  full_name?: string;
  customer_name?: string;
  email?: string;
  customer_email?: string;
  phone?: string;
  customer_phone?: string;
  alternate_phone?: string;
  company_name?: string;
  address?: string;
  city?: string;
  country?: string;
  total_tickets: number;
  total_resolved: number;
  total_open: number;
  created_at: string;
  updated_at?: string;
}

export interface CustomerTicket {
  id: number;
  ticket_number: string;
  title: string;
  description?: string;
  status: TicketStatus;  // Make sure this is included
  priority: TicketPriority;  // Make sure this is included
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;
  assigned_to_name?: string | null;
  assigned_to_id?: number | null;
  team_name?: string | null;
  channel?: string;
}