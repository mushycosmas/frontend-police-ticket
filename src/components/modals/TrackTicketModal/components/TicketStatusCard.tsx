import React from 'react';
import { TicketStatusData } from '../../../../types/ticket.types';

// Update status colors for your backend statuses
const getStatusColor = (status: string) => {
  const colors = {
    'OPEN': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-200',
    'RESOLVED': 'bg-green-100 text-green-800 border-green-200',
    'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  const texts = {
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'RESOLVED': 'Resolved',
    'CLOSED': 'Closed'
  };
  return texts[status as keyof typeof texts] || status;
};

const getPriorityColor = (priority?: string) => {
  const colors = {
    'LOW': 'bg-gray-100 text-gray-700',
    'MEDIUM': 'bg-blue-100 text-blue-700',
    'HIGH': 'bg-orange-100 text-orange-700',
    'URGENT': 'bg-red-100 text-red-700'
  };
  return priority ? colors[priority as keyof typeof colors] : 'bg-gray-100 text-gray-700';
};

const getPriorityText = (priority?: string) => {
  const texts = {
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High',
    'URGENT': 'Urgent'
  };
  return priority ? texts[priority as keyof typeof texts] : 'Not specified';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface TicketStatusCardProps {
  ticket: TicketStatusData;
}

export const TicketStatusCard: React.FC<TicketStatusCardProps> = ({ ticket }) => {
  return (
    <div className="bg-gradient-to-r from-brand-primary/5 to-transparent p-6 rounded-xl border-2 border-brand-primary/20">
      <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{ticket.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>
          <p className="text-xs text-gray-500 mt-3 font-mono">ID: {ticket.ticket_number}</p>
        </div>
        <div className="flex gap-2">
          {ticket.priority && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
              {getPriorityText(ticket.priority)} Priority
            </div>
          )}
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Customer</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">{ticket.customer_name}</p>
          <p className="text-xs text-gray-500">{ticket.customer_phone}</p>
          <p className="text-xs text-gray-500">{ticket.customer_email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Created</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">{formatDate(ticket.created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">{ticket.location_full || ticket.street_name || 'Not specified'}</p>
        </div>
        {ticket.assigned_to_name && (
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Assigned To</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{ticket.assigned_to_name}</p>
          </div>
        )}
      </div>
      
      {/* Show attachments if any */}
       {ticket.attachments && ticket.attachments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Attachments</p>
          <div className="flex gap-2 flex-wrap">
            {ticket.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-primary hover:underline flex items-center gap-1"
              >
                📎 {attachment.file_name}
              </a>
            ))}
          </div>
        </div>
      )} 
    </div>
  );
};