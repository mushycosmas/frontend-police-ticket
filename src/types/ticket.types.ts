export type TicketStatus = 'pending' | 'in-progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type UpdateType = 'info' | 'update' | 'resolution';

export interface TicketUpdate {
  date: string;
  message: string;
  type: UpdateType;
  user?: string;
}

export interface TicketStatusData {
  id: string;
  status: TicketStatus;
  title: string;
  description: string;
  createdAt: string;
  lastUpdate: string;
  assignedTo?: string;
  priority?: Priority;
  updates: TicketUpdate[];
  activities: TicketUpdate[];
}