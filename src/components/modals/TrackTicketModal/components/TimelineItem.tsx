import React from 'react';
import { TicketUpdate } from '../../../../types/ticket.types';
import { formatDate } from '../../../../utils/ticketUtils';
import { TicketIcon } from './TicketIcon';  // ← Import the component

interface TimelineItemProps {
  update: TicketUpdate;
  isLast: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ update, isLast }) => {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
          <TicketIcon type={update.type} />  {/* ← Use the component, not getTypeIcon */}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gradient-to-b from-brand-primary/30 to-transparent mt-2"></div>
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
            <p className="text-xs text-gray-500 font-medium">
              {formatDate(update.date)}
            </p>
            {update.user && (
              <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                {update.user}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{update.message}</p>
        </div>
      </div>
    </div>
  );
};