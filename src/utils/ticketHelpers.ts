// ─── Helper Functions ──────────────────────────────────────────
export const normalizePriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'CRITICAL': 'P1_CRITICAL',
    'P1_CRITICAL': 'P1_CRITICAL',
    'HIGH': 'P2_HIGH',
    'P2_HIGH': 'P2_HIGH',
    'MEDIUM': 'P3_MEDIUM',
    'P3_MEDIUM': 'P3_MEDIUM',
    'LOW': 'P4_LOW',
    'P4_LOW': 'P4_LOW',
  };
  return priorityMap[priority?.toUpperCase()] || 'P3_MEDIUM';
};

export const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'OPEN': 'OPEN',
    'ASSIGNED': 'ASSIGNED',
    'IN_PROGRESS': 'IN_PROGRESS',
    'RESOLVED': 'RESOLVED',
    'CLOSED': 'CLOSED',
    'REOPENED': 'REOPENED',
  };
  return statusMap[status?.toUpperCase()] || status;
};

export const getTicketCounts = (tickets: any[]) => ({
  all: tickets.length,
  critical: tickets.filter(t => t.priority === 'CRITICAL').length,
  high: tickets.filter(t => t.priority === 'HIGH').length,
  medium: tickets.filter(t => t.priority === 'MEDIUM').length,
  low: tickets.filter(t => t.priority === 'LOW').length,
  open: tickets.filter(t => t.status === 'OPEN').length,
  assigned: tickets.filter(t => t.status === 'ASSIGNED').length,
  in_progress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
  resolved: tickets.filter(t => t.status === 'RESOLVED').length,
  closed: tickets.filter(t => t.status === 'CLOSED').length,
  reopened: tickets.filter(t => t.status === 'REOPENED').length,
});