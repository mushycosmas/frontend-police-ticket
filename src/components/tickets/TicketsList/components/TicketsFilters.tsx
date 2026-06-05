import React from 'react';
import { Input } from '../../../common/Input';
import { TicketStatus, TicketPriority } from '../../../../types/tickets/tickets.types';

interface TicketsFiltersProps {
  search: string;
  filterStatus: TicketStatus | '';
  filterPriority: TicketPriority | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TicketStatus | '') => void;
  onPriorityChange: (value: TicketPriority | '') => void;
}

const STATUS_OPTIONS: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED', 'REOPENED'];
const PRIORITY_OPTIONS: TicketPriority[] = ['P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW'];

export const TicketsFilters: React.FC<TicketsFiltersProps> = ({
  search,
  filterStatus,
  filterPriority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="Search tickets, customers, IDs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value as TicketStatus | '')}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={filterPriority}
          onChange={(e) => onPriorityChange(e.target.value as TicketPriority | '')}
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};