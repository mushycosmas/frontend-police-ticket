// =====================
// TICKET STATUS TYPES
// =====================
export type TicketStatus = 
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

// =====================
// TICKET PRIORITY TYPES
// =====================
export type TicketPriority = 
  | 'P1_CRITICAL'
  | 'P2_HIGH'
  | 'P3_MEDIUM'
  | 'P4_LOW';

// =====================
// TICKET CHANNEL TYPES
// =====================
export type TicketChannel = 
  | 'PHONE'
  | 'WALKIN'
  | 'EMAIL'
  | 'CHAT'
  | 'WEB';

// =====================
// TICKET ATTACHMENT TYPE
// =====================
export interface TicketAttachment {
  id: number;
  file: string;
  file_name: string;
  created_at: string;
}

// =====================
// AGENT TYPE
// =====================
export interface Agent {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

// =====================
// TEAM TYPE
// =====================
export interface Team {
  id: number;
  name: string;
  description?: string;
}

// =====================
// CUSTOMER TYPE
// =====================
export interface Customer {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  alternate_phone?: string;
  company_name?: string;
  address?: string;
  city?: string;
  country?: string;
}

// =====================
// TIMELINE ITEM TYPE - ADD THIS
// =====================
export interface TimelineItem {
  id: number;
  date: string;
  action: string;
  message: string;
  type: 'info' | 'comment' | 'update' | 'resolution';
  comment: string | null;
  user: string;
  user_role: string | null;
  is_comment: boolean;
  old_status: string | null;
  new_status: string | null;
  old_priority: string | null;
  new_priority: string | null;
  old_assignee: string | null;
  new_assignee: string | null;
}

// =====================
// MAIN TICKET TYPE
// =====================
export interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;
  
  // Customer information
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer?: Customer;
  customer_detail?: Customer;
  
  // Assignment information
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  assigned_by?: number | null;
  agent?: Agent;
  
  // Team information
  team?: number | null;
  team_name?: string | null;
  
  // Location information
  street?: number | null;
  street_name?: string | null;
  location_full?: string | null;
  
  // Attachments
  attachments: TicketAttachment[];
  
  // History/Timeline
  timeline?: TimelineItem[];
  history?: TicketHistory[];
  lastUpdate?: string;
}

// =====================
// TICKET HISTORY TYPE
// =====================
export type HistoryAction = 
  | 'CREATED'
  | 'UPDATED'
  | 'COMMENTED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'ATTACHMENT'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export interface TicketHistory {
  id: number;
  ticket: number;
  action: HistoryAction;
  message?: string;
  comment?: string;
  old_status?: string;
  new_status?: string;
  old_priority?: string;
  new_priority?: string;
  old_assignee?: string;
  new_assignee?: string;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
}

// =====================
// TICKET UPDATE TYPE
// =====================
export type UpdateType = 'info' | 'update' | 'resolution' | 'comment';

export interface TicketUpdate {
  id?: number;
  date: string;
  message: string;
  type: UpdateType;
  user?: string;
  user_role?: string;
  is_comment?: boolean;
  comment?: string;
  action?: string;
}

// =====================
// TICKET FILTERS TYPE
// =====================
export interface TicketFilters {
  search: string;
  status: TicketStatus | '';
  priority: TicketPriority | '';
  channel?: TicketChannel | '';
  assigned_to?: number | null;
  team?: number | null;
  date_from?: string;
  date_to?: string;
}

// =====================
// TICKET PAGINATION TYPE
// =====================
export interface TicketPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// =====================
// TICKET LIST RESPONSE TYPE
// =====================
export interface TicketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

// =====================
// CREATE/UPDATE TICKET TYPE
// =====================
export interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  channel: TicketChannel;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  street_id?: number | null;
  assigned_to?: number | null;
  team?: number | null;
  attachments?: File[];
}

export interface UpdateTicketData extends Partial<CreateTicketData> {
  status?: TicketStatus;
  resolved_at?: string | null;
}

// =====================
// TICKET STATISTICS TYPE
// =====================
export interface TicketStatistics {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  by_priority: Record<TicketPriority, number>;
  by_status: Record<TicketStatus, number>;
}

// =====================
// TICKET COMMENT TYPE
// =====================
export interface TicketComment {
  id: number;
  ticket: number;
  comment: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
  is_internal?: boolean;
}

// =====================
// STATUS CONFIGURATION
// =====================
export const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  'OPEN': { label: 'Open', color: 'bg-yellow-100 text-yellow-800' },
  'IN_PROGRESS': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  'ESCALATED': { label: 'Escalated', color: 'bg-red-100 text-red-800' },
  'RESOLVED': { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  'CLOSED': { label: 'Closed', color: 'bg-gray-100 text-gray-800' },
  'REOPENED': { label: 'Reopened', color: 'bg-purple-100 text-purple-800' },
} as const;

// =====================
// PRIORITY CONFIGURATION
// =====================
export const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  'P1_CRITICAL': { label: 'Critical', color: 'bg-red-100 text-red-800' },
  'P2_HIGH': { label: 'High', color: 'bg-orange-100 text-orange-800' },
  'P3_MEDIUM': { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  'P4_LOW': { label: 'Low', color: 'bg-gray-100 text-gray-800' },
} as const;

// =====================
// CHANNEL CONFIGURATION
// =====================
export const CHANNEL_CONFIG: Record<TicketChannel, { label: string; icon: string }> = {
  'PHONE': { label: 'Phone', icon: '📞' },
  'WALKIN': { label: 'Walk-in', icon: '🚶' },
  'EMAIL': { label: 'Email', icon: '📧' },
  'CHAT': { label: 'Chat', icon: '💬' },
  'WEB': { label: 'Web Form', icon: '🌐' },
} as const;

// =====================
// HELPER FUNCTIONS
// =====================
export const getStatusLabel = (status: TicketStatus): string => {
  return STATUS_CONFIG[status]?.label ?? status;
};

export const getStatusColor = (status: TicketStatus): string => {
  return STATUS_CONFIG[status]?.color ?? 'bg-gray-100 text-gray-800';
};

export const getPriorityLabel = (priority: TicketPriority): string => {
  return PRIORITY_CONFIG[priority]?.label ?? priority;
};

export const getPriorityColor = (priority: TicketPriority): string => {
  return PRIORITY_CONFIG[priority]?.color ?? 'bg-gray-100 text-gray-800';
};

export const getChannelLabel = (channel: TicketChannel): string => {
  return CHANNEL_CONFIG[channel]?.label ?? channel;
};

export const getChannelIcon = (channel: TicketChannel): string => {
  return CHANNEL_CONFIG[channel]?.icon ?? '📋';
};

export const getChannelConfig = (channel: string): { label: string; icon: string } => {
  return CHANNEL_CONFIG[channel as TicketChannel] ?? { label: channel, icon: '📋' };
};

export const getStatusConfig = (status: string): { label: string; color: string } => {
  return STATUS_CONFIG[status as TicketStatus] ?? { label: status, color: 'bg-gray-100 text-gray-800' };
};

export const getPriorityConfig = (priority: string): { label: string; color: string } => {
  return PRIORITY_CONFIG[priority as TicketPriority] ?? { label: priority, color: 'bg-gray-100 text-gray-800' };
};

export const isValidTicketStatus = (status: string): status is TicketStatus => {
  return Object.keys(STATUS_CONFIG).includes(status);
};

export const isValidTicketPriority = (priority: string): priority is TicketPriority => {
  return Object.keys(PRIORITY_CONFIG).includes(priority);
};

export const isValidTicketChannel = (channel: string): channel is TicketChannel => {
  return Object.keys(CHANNEL_CONFIG).includes(channel);
};