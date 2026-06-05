import React from 'react';
import { TicketUpdate } from '../../../../types/ticket.types';
import { TimelineItem } from './TimelineItem';

interface ActivityTimelineProps {
  updates: TicketUpdate[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ updates }) => {
  return (
    <div>
      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Activity Timeline
      </h4>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {updates.map((update, index) => (
          <TimelineItem 
            key={index} 
            update={update} 
            isLast={index === updates.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};