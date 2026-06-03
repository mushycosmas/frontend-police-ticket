import { TicketStatus, TicketPriority, TicketChannel } from '../types';
export const statusConfig: Record<
  TicketStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  OPEN:        { label: 'Open',        color: 'text-amber-700',  bg: 'bg-amber-50',  dot: 'bg-amber-500'  },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700',   bg: 'bg-blue-50',   dot: 'bg-blue-500'   },
  ESCALATED:   { label: 'Escalated',   color: 'text-red-700',    bg: 'bg-red-50',    dot: 'bg-red-500'    },
  RESOLVED:    { label: 'Resolved',    color: 'text-green-700',  bg: 'bg-green-50',  dot: 'bg-green-500'  },
  CLOSED:      { label: 'Closed',      color: 'text-gray-600',   bg: 'bg-gray-100',  dot: 'bg-gray-400'   },
  REOPENED:    { label: 'Reopened',    color: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-500' },
};
export const priorityConfig: Record<
  TicketPriority,
  { label: string; color: string; bg: string }
> = {
  P1_CRITICAL: { label: 'P1 — Critical', color: 'text-red-700',    bg: 'bg-red-100'    },
  P2_HIGH:     { label: 'P2 — High',     color: 'text-orange-700', bg: 'bg-orange-100' },
  P3_MEDIUM:   { label: 'P3 — Medium',   color: 'text-yellow-700', bg: 'bg-yellow-100' },
  P4_LOW:      { label: 'P4 — Low',      color: 'text-green-700',  bg: 'bg-green-100'  },
};
export const channelConfig: Record<TicketChannel, { label: string; icon: string }> = {
  PHONE:    { label: 'Phone',     icon: '📞' },
  WALK_IN:  { label: 'Walk-in',   icon: '🚶' },
  EMAIL:    { label: 'Email',     icon: '📧' },
  CHAT:     { label: 'Chat',      icon: '💬' },
  WEB_FORM: { label: 'Web Form',  icon: '🌐' },
};
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
export const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
export const getRoleLabel = (role: string) => {
  const map: Record<string, string> = {
    ADMIN: 'Administrator', MANAGER: 'Manager',
    TEAM_LEAD: 'Team Lead', AGENT: 'Agent',
    QA_ANALYST: 'QA Analyst', CUSTOMER: 'Customer',
  };
  return map[role] ?? role;
};
