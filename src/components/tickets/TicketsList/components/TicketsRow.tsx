import React from 'react';
import { Ticket, getChannelConfig } from '../../../../types/tickets/tickets.types';
import { StatusBadge, PriorityBadge } from '../../../common/Badge';
import { Button } from '../../../common/Button';
import { timeAgo } from '../../../../utils/helpers';

interface TicketsRowProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
  onDelete: (id: number, ticketNumber: string) => void;
  onResolve: (id: number, ticketNumber: string) => void;
  onClose: (id: number, ticketNumber: string) => void;
  isDeleting?: boolean;
  isResolving?: boolean;
  isClosing?: boolean;
}

export const TicketsRow: React.FC<TicketsRowProps> = ({
  ticket,
  onView,
  onDelete,
  onResolve,
  onClose,
  isDeleting = false,
  isResolving = false,
  isClosing = false,
}) => {
  // Get channel config safely using the helper function
  const channel = getChannelConfig(ticket.channel);

  return (
    <tr className="border-t hover:bg-gray-50 transition-colors">
      <td className="p-3 text-sm font-mono">
        {ticket.ticket_number || `#${ticket.id}`}
      </td>
      
      <td className="p-3">
        <button
          className="text-blue-600 hover:underline font-medium"
          onClick={() => onView(ticket)}
          disabled={isDeleting || isResolving || isClosing}
        >
          {ticket.title}
        </button>
      </td>
      
      <td className="p-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {ticket.customer_name || 'Unknown'}
          </span>
          {ticket.customer_phone && (
            <span className="text-xs text-gray-500">
              {ticket.customer_phone}
            </span>
          )}
        </div>
      </td>
      
      <td className="p-3">
        <span className="flex items-center gap-1 text-sm">
          <span>{channel.icon}</span>
          <span>{channel.label}</span>
        </span>
      </td>
      
      <td className="p-3">
        <StatusBadge status={ticket.status} />
      </td>
      
      <td className="p-3">
        <PriorityBadge priority={ticket.priority} />
      </td>
      
      <td className="p-3 text-sm">
        {ticket.assigned_to_name || ticket.agent?.username || 'Unassigned'}
      </td>
      
      <td className="p-3 text-sm text-gray-500">
        {timeAgo(ticket.created_at)}
      </td>
      
      <td className="p-3 flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onView(ticket)}
          disabled={isDeleting || isResolving || isClosing}
        >
          View
        </Button>
        
        <Button 
          size="sm" 
          variant="danger" 
          onClick={() => onDelete(ticket.id, ticket.ticket_number)}
          loading={isDeleting}
          disabled={isDeleting || isResolving || isClosing}
        >
          Delete
        </Button>
        
        {ticket.status === 'IN_PROGRESS' && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => onResolve(ticket.id, ticket.ticket_number)}
            loading={isResolving}
            disabled={isDeleting || isResolving || isClosing}
          >
            Resolve
          </Button>
        )}
        
        {ticket.status === 'RESOLVED' && (
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => onClose(ticket.id, ticket.ticket_number)}
            loading={isClosing}
            disabled={isDeleting || isResolving || isClosing}
          >
            Close
          </Button>
        )}
      </td>
    </tr>
  );
};