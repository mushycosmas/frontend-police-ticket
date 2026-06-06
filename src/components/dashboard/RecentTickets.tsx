import React from "react";
import { timeAgo } from "../../utils/helpers";

interface RecentTicketsProps {
  tickets: any[];
  onViewTicket: (ticket: any) => void;
}

// Helper to format priority for display
const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    'CRITICAL': 'Critical',
    'P1_CRITICAL': 'Critical',
    'HIGH': 'High',
    'P2_HIGH': 'High',
    'MEDIUM': 'Medium',
    'P3_MEDIUM': 'Medium',
    'LOW': 'Low',
    'P4_LOW': 'Low',
  };
  return labels[priority?.toUpperCase()] || 'Medium';
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'CRITICAL': 'bg-red-100 text-red-800',
    'P1_CRITICAL': 'bg-red-100 text-red-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'P2_HIGH': 'bg-orange-100 text-orange-800',
    'MEDIUM': 'bg-blue-100 text-blue-800',
    'P3_MEDIUM': 'bg-blue-100 text-blue-800',
    'LOW': 'bg-gray-100 text-gray-800',
    'P4_LOW': 'bg-gray-100 text-gray-800',
  };
  return colors[priority?.toUpperCase()] || 'bg-blue-100 text-blue-800';
};

// Helper to format status
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'RESOLVED': 'Resolved',
    'ESCALATED': 'Escalated',
    'CLOSED': 'Closed',
    'REOPENED': 'Reopened',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'OPEN': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'RESOLVED': 'bg-green-100 text-green-800',
    'ESCALATED': 'bg-red-100 text-red-800',
    'CLOSED': 'bg-gray-100 text-gray-800',
    'REOPENED': 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
      {getPriorityLabel(priority)}
    </span>
  );
};

export const RecentTickets: React.FC<RecentTicketsProps> = ({ tickets, onViewTicket }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Recent Tickets</h2>
        <button 
          onClick={() => window.location.href = '/tickets'} 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All →
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No tickets found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Ticket #</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Title</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Customer</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Status</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Priority</th>
                <th className="text-left p-3 text-xs font-medium text-gray-600">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="border-t hover:bg-gray-50 cursor-pointer" 
                  onClick={() => onViewTicket(ticket)}
                >
                  <td className="p-3 font-mono text-xs text-blue-600">
                    {ticket.ticket_number}
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{ticket.title}</div>
                    {ticket.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs">
                        {ticket.description.substring(0, 60)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">
                    {ticket.customer_detail?.customer_name || ticket.customer_name || "N/A"}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="p-3">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {timeAgo(ticket.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};