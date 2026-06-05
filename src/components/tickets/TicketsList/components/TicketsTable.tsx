import React from 'react';
import { Ticket } from '../../../../types/tickets/tickets.types';
import { TicketsRow } from './TicketsRow';

interface TicketsTableProps {
  tickets: Ticket[];
  onView: (ticket: Ticket) => void;
  onDelete: (id: number) => void;
  onResolve: (id: number) => void;
  onClose: (id: number) => void;
  isDeleting?: boolean;
  isResolving?: boolean;
  isClosing?: boolean;
}

// Updated columns - changed 'ID' to 'Ticket #'
const COLUMNS = ['Ticket #', 'Title', 'Customer', 'Channel', 'Status', 'Priority', 'Agent', 'Created', 'Actions'];

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  onView,
  onDelete,
  onResolve,
  onClose,
  isDeleting = false,
  isResolving = false,
  isClosing = false,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} className="text-left p-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <TicketsRow
              key={ticket.id}
              ticket={ticket}
              onView={onView}
              onDelete={onDelete}
              onResolve={onResolve}
              onClose={onClose}
              isDeleting={isDeleting}
              isResolving={isResolving}
              isClosing={isClosing}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};