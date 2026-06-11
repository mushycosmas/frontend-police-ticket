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
// TICKET PRIORITY TYPES (aligned with backend)
// =====================
export type TicketPriority = 
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW';

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
// CUSTOMER TYPE
// =====================
export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  nida_number?: string;
  gender?: string;
  alternate_phone?: string;
  company_name?: string;
  address?: string;
  city?: string;
  country?: string;
}

// =====================
// TIMELINE ITEM TYPE (for frontend display)
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

  // Customer (nested object)
  customer: Customer;
  customer_detail?: Customer;   // alias for customer

  // Assignment
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  assigned_by?: number | null;

  // Team
  team?: number | null;
  team_name?: string | null;

  // Location
  street?: number | null;
  street_name?: string | null;
  location_full?: string | null;
  location_details?: {
    street: string | null;
    ward: string | null;
    district: string | null;
    region: string | null;
  } | null;

  // Attachments & history
  attachments: TicketAttachment[];
  history?: TicketHistory[];
  timeline?: TimelineItem[];   // computed for UI

  // Optional statistics
  total_tickets?: number;
}

// =====================
// TICKET HISTORY TYPE (backend)
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
// TICKET FILTERS
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
// PAGINATION
// =====================
export interface TicketPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// =====================
// API RESPONSE (list)
// =====================
export interface TicketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ticket[];
}

// =====================
// CREATE / UPDATE DATA
// =====================
export interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  channel: TicketChannel;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_nida?: string;
  customer_gender?: string;
  category?: number | null;
  street_id?: number | null;
  assigned_to?: number | null;
  team?: number | null;
  assigned_by?: number | null;   // ✅ added missing field
  attachments?: File[];
}

export interface UpdateTicketData extends Partial<CreateTicketData> {
  status?: TicketStatus;
  resolved_at?: string | null;
}

// =====================
// TICKET STATISTICS
// =====================
export interface TicketStatistics {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  escalated: number;
  by_priority: Record<TicketPriority, number>;
  by_status: Record<TicketStatus, number>;
}

// =====================
// CONFIGURATIONS & HELPERS
// =====================
export const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  ESCALATED: { label: 'Escalated', color: 'bg-red-100 text-red-800' },
  RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-800' },
  REOPENED: { label: 'Reopened', color: 'bg-purple-100 text-purple-800' },
} as const;

export const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  CRITICAL: { label: 'Critical', color: 'bg-red-100 text-red-800' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
} as const;

export const CHANNEL_CONFIG: Record<TicketChannel, { label: string; icon: string }> = {
  PHONE: { label: 'Phone', icon: '📞' },
  WALKIN: { label: 'Walk-in', icon: '🚶' },
  EMAIL: { label: 'Email', icon: '📧' },
  CHAT: { label: 'Chat', icon: '💬' },
  WEB: { label: 'Web Form', icon: '🌐' },
} as const;

// Helper functions
export const getStatusLabel = (status: TicketStatus): string => STATUS_CONFIG[status]?.label ?? status;
export const getStatusColor = (status: TicketStatus): string => STATUS_CONFIG[status]?.color ?? 'bg-gray-100 text-gray-800';
export const getPriorityLabel = (priority: TicketPriority): string => PRIORITY_CONFIG[priority]?.label ?? priority;
export const getPriorityColor = (priority: TicketPriority): string => PRIORITY_CONFIG[priority]?.color ?? 'bg-gray-100 text-gray-800';
export const getChannelLabel = (channel: TicketChannel): string => CHANNEL_CONFIG[channel]?.label ?? channel;
export const getChannelIcon = (channel: TicketChannel): string => CHANNEL_CONFIG[channel]?.icon ?? '📋';

export const getStatusConfig = (status: string): { label: string; color: string } =>
  STATUS_CONFIG[status as TicketStatus] ?? { label: status, color: 'bg-gray-100 text-gray-800' };

export const getPriorityConfig = (priority: string): { label: string; color: string } =>
  PRIORITY_CONFIG[priority as TicketPriority] ?? { label: priority, color: 'bg-gray-100 text-gray-800' };

export const getChannelConfig = (channel: string): { label: string; icon: string } =>
  CHANNEL_CONFIG[channel as TicketChannel] ?? { label: channel, icon: '📋' };

// Type guards
export const isValidTicketStatus = (status: string): status is TicketStatus =>
  Object.keys(STATUS_CONFIG).includes(status);

export const isValidTicketPriority = (priority: string): priority is TicketPriority =>
  Object.keys(PRIORITY_CONFIG).includes(priority);

export const isValidTicketChannel = (channel: string): channel is TicketChannel =>
  Object.keys(CHANNEL_CONFIG).includes(channel);