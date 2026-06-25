import React from 'react';
import { Ticket } from '../../../../types/tickets/tickets.types';
import { StatusBadge, PriorityBadge } from '../../../common/Badge';
import { Button } from '../../../common/Button';
import { timeAgo } from '../../../../utils/helpers';

interface TicketsRowProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
  onDelete: (id: number, ticketNumber: string) => void;
  onResolve: (id: number, ticketNumber: string) => void;
  onClose: (id: number, ticketNumber: string) => void;
  onReturn: (ticket: Ticket) => void;

  isDeleting?: boolean;
  isResolving?: boolean;
  isClosing?: boolean;
  isReturning?: boolean;
}

export const TicketsRow: React.FC<TicketsRowProps> = ({
  ticket,
  onView,
  onDelete,
  onResolve,
  onClose,
  onReturn,
  isDeleting = false,
  isResolving = false,
  isClosing = false,
  isReturning = false,
}) => {
  // Normalize status to avoid mismatch issues from backend
  const status = ticket.status?.toUpperCase();

  const isBusy =
    isDeleting || isResolving || isClosing || isReturning;

  // Safe return condition
  const canReturn = ['ASSIGNED', 'IN_PROGRESS'].includes(status);

  return (
    <tr className="border-t hover:bg-gray-50 transition-colors">

      {/* Ticket Number */}
      <td className="p-3 text-sm font-mono">
        {ticket.ticket_number || `#${ticket.id}`}
      </td>

      {/* Title */}
      <td className="p-3">
        <button
          className="text-blue-600 hover:underline font-medium"
          onClick={() => onView(ticket)}
          disabled={isBusy}
        >
          {ticket.title}
        </button>
      </td>

      {/* Customer */}
      <td className="p-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {ticket.customer_detail?.customer_name || 
             ticket.customer_name || 
             ticket.customer?.full_name ||
             'Unknown'}
          </span>

          {ticket.customer_phone && (
            <span className="text-xs text-gray-500">
              {ticket.customer_phone}
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="p-3">
        <StatusBadge status={ticket.status} />
      </td>

      {/* Priority */}
      <td className="p-3">
        <PriorityBadge priority={ticket.priority} />
      </td>

      {/* Agent */}
      <td className="p-3 text-sm">
        {ticket.assigned_to_name ||
         ticket.assigned_to?.full_name ||
         ticket.assigned_to?.username ||
         ticket.agent?.username ||
         'Unassigned'}
      </td>

      {/* Created */}
      <td className="p-3 text-sm text-gray-500">
        {timeAgo(ticket.created_at)}
      </td>

      {/* Actions */}
      <td className="p-3">
        <div className="flex flex-wrap gap-2">

          {/* View */}
          <Button
            size="sm"
            onClick={() => onView(ticket)}
            disabled={isBusy}
          >
            View
          </Button>

          {/* Return */}
          {canReturn && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onReturn(ticket)}
              loading={isReturning}
              disabled={isBusy}
            >
              Return
            </Button>
          )}

          {/* Resolve */}
          {status === 'IN_PROGRESS' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                onResolve(ticket.id, ticket.ticket_number)
              }
              loading={isResolving}
              disabled={isBusy}
            >
              Resolve
            </Button>
          )}

          {/* Close */}
          {status === 'RESOLVED' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() =>
                onClose(ticket.id, ticket.ticket_number)
              }
              loading={isClosing}
              disabled={isBusy}
            >
              Close
            </Button>
          )}

          {/* Delete */}
          <Button
            size="sm"
            variant="danger"
            onClick={() =>
              onDelete(ticket.id, ticket.ticket_number)
            }
            loading={isDeleting}
            disabled={isBusy}
          >
            Delete
          </Button>

        </div>
      </td>
    </tr>
  );
};