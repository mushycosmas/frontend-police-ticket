import React from 'react';
import { TicketStatus, TicketPriority } from '../../types';
import { statusConfig, priorityConfig } from '../../utils/helpers';

export const StatusBadge = ({ status }: { status: TicketStatus | string }) => {
  const cfg = statusConfig[status as TicketStatus];
  
  if (!cfg) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        {status || 'UNKNOWN'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: TicketPriority | string }) => {
  const cfg = priorityConfig[priority as TicketPriority];

  if (!cfg) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200">
        {priority || 'UNKNOWN'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
};
