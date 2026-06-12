import React from 'react';
import { TicketsRow } from './TicketsRow';
import { Ticket } from '../../../../types/tickets/tickets.types'; // adjust path if needed

const COLUMNS = [
  'Ticket #',
  'Title',
  'Customer',
  'Channel',
  'Status',
  'Priority',
  'Agent',
  'Created',
  'Actions'
];

type TicketsTableProps = {
  tickets: Ticket[];

  onView: (ticket: Ticket) => void;

  onDelete: (id: number, ticketNumber: string) => void;
  onResolve: (id: number, ticketNumber: string) => void;
  onClose: (id: number, ticketNumber: string) => void;

  onReturn: (ticket: Ticket) => void;

  isDeleting?: boolean;
  isResolving?: boolean;
  isClosing?: boolean;
  isReturning?: boolean;
};

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
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
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left p-3 text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
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
              onReturn={onReturn}
              isDeleting={isDeleting}
              isResolving={isResolving}
              isClosing={isClosing}
              isReturning={isReturning}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};