// =====================
// TICKET STATUS TYPES
// =====================
export type TicketStatus = 
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
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
  | 'WEB'
  | string;

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
  channel: TicketChannel | { id: number; name: string; status?: string } | number | string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;

  // Channel fields
  channel_id?: number;
  channel_name?: string;
  channel_status?: string;

  // Customer (nested object)
  customer: Customer;
  customer_detail?: Customer;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;

  // Assignment
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  assigned_by?: number | null;
  assigned_by_name?: string | null;

  // Team
  team?: number | null;
  team_name?: string | null;

  // Category
  category?: number | null;
  category_id?: number | null;
  category_name?: string | null;
  category_description?: string | null;

  // Location
  street?: number | null;
  street_id?: number | null;
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
  timeline?: TimelineItem[];

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
  | 'CATEGORY_CHANGED'
  | 'CHANNEL_CHANGED'
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
  old_category?: string;
  new_category?: string;
  old_channel?: string;
  new_channel?: string;
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
  category?: number | null;
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
  channel: TicketChannel | number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_nida?: string;
  customer_gender?: string;
  category?: number | null;
  category_id?: number | null;
  street_id?: number | null;
  assigned_to?: number | null;
  team?: number | null;
  assigned_by?: number | null;
  attachments?: File[];
}

export interface UpdateTicketData extends Partial<CreateTicketData> {
  status?: TicketStatus;
  resolved_at?: string | null;
  priority?: TicketPriority;
  category_id?: number | null;
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
  assigned: number;
  by_priority: Record<TicketPriority, number>;
  by_status: Record<TicketStatus, number>;
}

// =====================
// CONFIGURATIONS & HELPERS
// =====================
export const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-yellow-100 text-yellow-800' },
  ASSIGNED: { label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-800' },
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

export const CHANNEL_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  // Standard channels
  PHONE: { label: 'Phone', icon: '📞', color: 'blue' },
  WALKIN: { label: 'Walk-in', icon: '🚶', color: 'green' },
  EMAIL: { label: 'Email', icon: '📧', color: 'purple' },
  CHAT: { label: 'Chat', icon: '💬', color: 'indigo' },
  WEB: { label: 'Web Form', icon: '🌐', color: 'teal' },
  
  // Database channels
  'loss report portal': { label: 'Loss Report Portal', icon: '📋', color: 'blue' },
  'taarifa za uhalifu': { label: 'Taarifa za Uhalifu', icon: '🚨', color: 'red' },
  'polisi web/tovuti': { label: 'Police Website', icon: '🌐', color: 'green' },
  'fire arms portal': { label: 'Firearms Portal', icon: '🔫', color: 'orange' },
  'hrmis': { label: 'HRMIS', icon: '👥', color: 'purple' },
  'ticket support system': { label: 'Support System', icon: '🎫', color: 'indigo' },
};

// =====================
// HELPER FUNCTIONS
// =====================

// Status Helpers
export const getStatusLabel = (status: TicketStatus): string => 
  STATUS_CONFIG[status]?.label ?? status;

export const getStatusColor = (status: TicketStatus): string => 
  STATUS_CONFIG[status]?.color ?? 'bg-gray-100 text-gray-800';

export const getStatusConfig = (status: string): { label: string; color: string } =>
  STATUS_CONFIG[status as TicketStatus] ?? { label: status, color: 'bg-gray-100 text-gray-800' };

// Priority Helpers
export const getPriorityLabel = (priority: TicketPriority): string => 
  PRIORITY_CONFIG[priority]?.label ?? priority;

export const getPriorityColor = (priority: TicketPriority): string => 
  PRIORITY_CONFIG[priority]?.color ?? 'bg-gray-100 text-gray-800';

export const getPriorityConfig = (priority: string): { label: string; color: string } =>
  PRIORITY_CONFIG[priority as TicketPriority] ?? { label: priority, color: 'bg-gray-100 text-gray-800' };

// Channel Helpers
export const getChannelName = (channel: any): string => {
  if (!channel) return 'Unknown';
  
  // If it's a string, return it
  if (typeof channel === 'string') {
    return channel;
  }
  
  // If it's an object with a name property
  if (typeof channel === 'object' && channel !== null && 'name' in channel) {
    return channel.name || 'Unknown';
  }
  
  // If it's an object with an id
  if (typeof channel === 'object' && channel !== null && 'id' in channel) {
    return channel.name || `Channel ${channel.id}`;
  }
  
  // If it's a number
  if (typeof channel === 'number') {
    return `Channel ${channel}`;
  }
  
  return 'Unknown';
};

export const getChannelConfig = (channel: any): { label: string; icon: string; color: string } => {
  const channelName = getChannelName(channel);
  
  // Try exact match first
  if (CHANNEL_CONFIG[channelName]) {
    return CHANNEL_CONFIG[channelName];
  }
  
  // Try case-insensitive match
  const lowerKey = channelName.toLowerCase();
  for (const [key, value] of Object.entries(CHANNEL_CONFIG)) {
    if (key.toLowerCase() === lowerKey) {
      return value;
    }
  }
  
  // Return default
  return { 
    label: channelName || 'Unknown', 
    icon: '📋', 
    color: 'gray' 
  };
};

export const getChannelLabel = (channel: any): string => {
  return getChannelConfig(channel).label;
};

export const getChannelIcon = (channel: any): string => {
  return getChannelConfig(channel).icon;
};

export const getChannelColor = (channel: any): string => {
  return getChannelConfig(channel).color;
};

// Type Guards
export const isValidTicketStatus = (status: string): status is TicketStatus =>
  Object.keys(STATUS_CONFIG).includes(status);

export const isValidTicketPriority = (priority: string): priority is TicketPriority =>
  Object.keys(PRIORITY_CONFIG).includes(priority);

export const isValidTicketChannel = (channel: string): boolean =>
  Object.keys(CHANNEL_CONFIG).includes(channel);