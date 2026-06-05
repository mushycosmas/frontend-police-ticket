import React from 'react';
import { TicketStatusData } from '../../../../types/ticket.types';
import { getStatusColor, getStatusText, getPriorityColor, getPriorityText, formatDate } from '../../../../utils/ticketUtils';

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
          <p className="text-xs text-gray-500 mt-3 font-mono">ID: {ticket.id}</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Created</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">{formatDate(ticket.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last Update</p>
          <p className="text-sm font-semibold text-gray-700 mt-1">{formatDate(ticket.lastUpdate)}</p>
        </div>
        {ticket.assignedTo && (
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Assigned To</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{ticket.assignedTo}</p>
          </div>
        )}
      </div>
    </div>
  );
};