import React from 'react';
import { formatDate } from '../../../../utils/ticketUtils';
import { TicketIcon } from './TicketIcon';

interface TimelineItemProps {
  update: any; // Using any to match API response structure
  isLast: boolean;
}

// Helper to get action type for styling
const getActionType = (action: string): string => {
  switch (action) {
    case 'CREATED':
      return 'info';
    case 'COMMENTED':
      return 'comment';
    case 'ASSIGNED':
    case 'UNASSIGNED':
      return 'assignment';
    case 'STATUS_CHANGED':
    case 'PRIORITY_CHANGED':
      return 'update';
    case 'ATTACHMENT':
      return 'attachment';
    case 'RESOLVED':
    case 'CLOSED':
      return 'resolution';
    default:
      return 'info';
  }
};

// Helper to get user name from update
const getUserName = (update: any): string => {
  if (update.user) return update.user;
  if (update.created_by_name) return update.created_by_name;
  if (update.created_by) return `User #${update.created_by}`;
  return 'System';
};

// Helper to get display message
const getDisplayMessage = (update: any): string => {
  if (update.message) return update.message;
  
  switch (update.action) {
    case 'CREATED':
      return 'Ticket created';
    case 'COMMENTED':
      return update.comment || 'Added a comment';
    case 'ASSIGNED':
      if (update.new_assignee) {
        return `Assigned to ${update.new_assignee}`;
      }
      return 'Ticket assigned';
    case 'STATUS_CHANGED':
      return `Status changed from ${update.old_status || 'unknown'} to ${update.new_status || 'unknown'}`;
    case 'PRIORITY_CHANGED':
      return `Priority changed from ${update.old_priority || 'unknown'} to ${update.new_priority || 'unknown'}`;
    case 'ATTACHMENT':
      return `Added attachment: ${update.metadata?.attachments?.join(', ') || 'file'}`;
    case 'RESOLVED':
      return 'Ticket resolved';
    case 'CLOSED':
      return 'Ticket closed';
    default:
      return 'Activity recorded';
  }
};

export const TimelineItem: React.FC<TimelineItemProps> = ({ update, isLast }) => {
  const actionType = getActionType(update.action);
  const userName = getUserName(update);
  const displayMessage = getDisplayMessage(update);
  const updateDate = update.date || update.created_at;

  // Get styles based on action type
  const getBgColor = () => {
    switch (actionType) {
      case 'resolution':
        return 'bg-green-100';
      case 'comment':
        return 'bg-blue-100';
      case 'assignment':
        return 'bg-purple-100';
      case 'attachment':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getHoverColor = () => {
    switch (actionType) {
      case 'resolution':
        return 'hover:bg-green-200';
      case 'comment':
        return 'hover:bg-blue-200';
      case 'assignment':
        return 'hover:bg-purple-200';
      case 'attachment':
        return 'hover:bg-yellow-200';
      default:
        return 'hover:bg-gray-200';
    }
  };

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center ${getHoverColor()} transition-colors`}>
          <TicketIcon type={actionType} />
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent mt-2"></div>
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
            <p className="text-xs text-gray-500 font-medium">
              {formatDate(updateDate)}
            </p>
            <div className="flex gap-2">
              {userName && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {userName}
                </span>
              )}
              {update.user_role && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {update.user_role}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{displayMessage}</p>
          
          {/* Show comment content if it's a comment */}
          {update.action === 'COMMENTED' && update.comment && (
            <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
              <p className="text-sm text-gray-600 italic">
                "{update.comment}"
              </p>
            </div>
          )}
          
          {/* Show old/new status for status change */}
          {update.action === 'STATUS_CHANGED' && update.old_status && update.new_status && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-gray-500">From:</span>
              <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                {update.old_status}
              </span>
              <span>→</span>
              <span className="text-gray-500">To:</span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                {update.new_status}
              </span>
            </div>
          )}
          
          {/* Show old/new priority for priority change */}
          {update.action === 'PRIORITY_CHANGED' && update.old_priority && update.new_priority && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-gray-500">From:</span>
              <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                {update.old_priority}
              </span>
              <span>→</span>
              <span className="text-gray-500">To:</span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                {update.new_priority}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};