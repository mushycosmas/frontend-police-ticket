export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type UpdateType = 'info' | 'update' | 'resolution';

export interface Attachment {
  id: number;
  file: string;
  file_name: string;
  created_at: string;
}

export interface TicketUpdate {
  date: string;
  message: string;
  type: UpdateType;
  user?: string;
}

export interface TicketStatusData {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  created_at: string;
  updated_at?: string;
  lastUpdate?: string;
  assigned_to_id?: number | null;
  assigned_to_name?: string | null;
  team_id?: number | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  street_name?: string;
  location_full?: string;
  attachments: Attachment[];
  channel: string;
  updates?: TicketUpdate[];  // ← Make this optional
  activities?: TicketUpdate[];
}