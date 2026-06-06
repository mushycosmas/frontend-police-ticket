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
  onClearFilters: () => void;
  hasFilters: boolean;
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
  onClearFilters,
  hasFilters,
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

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {/* Active status filter tag */}
              {filterStatus && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Status: {filterStatus.replace('_', ' ')}
                  <button
                    onClick={() => onStatusChange('')}
                    className="ml-1 hover:text-blue-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Active priority filter tag */}
              {filterPriority && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Priority: {filterPriority.replace('_', ' ')}
                  <button
                    onClick={() => onPriorityChange('')}
                    className="ml-1 hover:text-blue-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Active search filter tag */}
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Search: {search}
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-1 hover:text-blue-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            {/* Clear all button */}
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};