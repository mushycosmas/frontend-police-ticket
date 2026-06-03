export type Role =
  | 'ADMIN'
  | 'MANAGER'
  | 'TEAM_LEAD'
  | 'AGENT'
  | 'QA_ANALYST'
  | 'CUSTOMER';
export type TicketStatus =
  | 'SUBMITTED'
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';
export type TicketPriority =
  | 'P1_CRITICAL'
  | 'P2_HIGH'
  | 'P3_MEDIUM'
  | 'P4_LOW';
export type TicketChannel =
  | 'PHONE'
  | 'WALK_IN'
  | 'EMAIL'
  | 'CHAT'
  | 'WEB_FORM';
export type ServiceCategory =
  | 'WATER'
  | 'ELECTRICITY'
  | 'HEALTH'
  | 'EDUCATION'
  | 'ROADS'
  | 'COMMUNICATIONS'
  | 'EMERGENCY'
  | 'OTHER';
export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'EMERGENCY';
export type PreferredContactMethod = 'PHONE' | 'SMS' | 'EMAIL';
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  isAvailable: boolean;
  teamId?: number;
}
export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  channel?: TicketChannel;
  createdAt: string;
}
export interface Ticket {
  id: number;
  ticketNumber?: string;
  customerId: number;
  agentId?: number;
  teamLeadId?: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  region?: string;
  district?: string;
  ward?: string;
  street?: string;
  gpsCoordinates?: string;
  serviceCategory?: ServiceCategory;
  serviceRequested?: string;
  urgency?: UrgencyLevel;
  assignedDepartment?: string;
  assignedOfficer?: User;
  resolutionNotes?: string;
  resolutionDate?: string;
  preferredContact?: PreferredContactMethod;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  customer?: Customer;
  agent?: User;
  teamLead?: User;
  escalations?: Escalation[];
  qaReview?: QAReview;
  csatFeedback?: CsatFeedback;
  auditLogs?: AuditLog[];
}
export interface Escalation {
  id: number;
  ticketId: number;
  escalatedById: number;
  escalatedToId: number;
  reason: string;
  escalatedAt: string;
  escalatedBy?: User;
  escalatedTo?: User;
}
export interface QAReview {
  id: number;
  ticketId: number;
  reviewerId: number;
  score: number;
  comments?: string;
  result: 'PASS' | 'FAIL';
  reviewedAt: string;
  reviewer?: User;
}
export interface CsatFeedback {
  id: number;
  ticketId: number;
  customerId: number;
  rating: number;
  comment?: string;
  submittedAt: string;
}
export interface AuditLog {
  id: number;
  ticketId: number;
  actorId: number;
  action: string;
  details?: string;
  timestamp: string;
  actor?: User;
}
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedToday: number;
  escalatedTickets: number;
  avgCsat: string;
  slaBreaches: number;
  qaPassRate: string;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
