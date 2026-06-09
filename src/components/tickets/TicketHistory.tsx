// components/tickets/TicketHistory.tsx
import React from "react";
import { TimelineItem } from "../../types/tickets/tickets.types";

interface TicketHistoryProps {
  history: TimelineItem[];
  loading?: boolean;
  onRefresh?: () => void;
}

const TicketHistory: React.FC<TicketHistoryProps> = ({
  history,
  loading = false,
  onRefresh,
}) => {
  const getActionIcon = (action?: string): string => {
    const icons: Record<string, string> = {
      CREATED: "🎉",
      UPDATED: "📝",
      COMMENTED: "💬",
      STATUS_CHANGED: "🔄",
      PRIORITY_CHANGED: "⚡",
      ASSIGNED: "👤",
      UNASSIGNED: "🚫",
      ATTACHMENT: "📎",
      RESOLVED: "✅",
      CLOSED: "🔒",
      REOPENED: "🔓",
    };
    return icons[action || ""] || "📌";
  };

  const getActionColor = (action?: string): string => {
    const colors: Record<string, string> = {
      CREATED: "text-green-600",
      UPDATED: "text-blue-600",
      COMMENTED: "text-purple-600",
      STATUS_CHANGED: "text-orange-600",
      PRIORITY_CHANGED: "text-red-600",
      ASSIGNED: "text-indigo-600",
      UNASSIGNED: "text-gray-600",
      ATTACHMENT: "text-pink-600",
      RESOLVED: "text-green-600",
      CLOSED: "text-gray-600",
      REOPENED: "text-yellow-600",
    };
    return colors[action || ""] || "text-gray-600";
  };

  const getActionLabel = (action?: string): string => {
    const labels: Record<string, string> = {
      CREATED: "Ticket Created",
      UPDATED: "Ticket Updated",
      COMMENTED: "Comment Added",
      STATUS_CHANGED: "Status Changed",
      PRIORITY_CHANGED: "Priority Changed",
      ASSIGNED: "Assigned",
      UNASSIGNED: "Unassigned",
      ATTACHMENT: "Attachment Added",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
      REOPENED: "Reopened",
    };
    return labels[action || ""] || action || "Update";
  };

  const getTypeBadge = (type?: string): string => {
    const typeColors: Record<string, string> = {
      info: "bg-blue-100 text-blue-800",
      comment: "bg-purple-100 text-purple-800",
      update: "bg-yellow-100 text-yellow-800",
      resolution: "bg-green-100 text-green-800",
    };
    return typeColors[type || "update"] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type?: string): string => {
    const labels: Record<string, string> = {
      info: "Information",
      comment: "Comment",
      update: "Update",
      resolution: "Resolution",
    };
    return labels[type || "update"] || type || "Update";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading history...</span>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 font-medium">No history available</p>
        <p className="text-gray-400 text-sm mt-1">There are no activities recorded for this ticket yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">Activity Timeline</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {history.length} {history.length === 1 ? "event" : "events"}
          </span>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh history"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {history.map((item, index) => (
          <div key={item.id || index} className="relative group">
            {/* Timeline line */}
            {index < history.length - 1 && (
              <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-300 transition-colors"></div>
            )}
            
            {/* Timeline item */}
            <div className="relative flex gap-3">
              {/* Icon circle */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 group-hover:border-blue-400 flex items-center justify-center transition-all group-hover:shadow-md">
                <span className="text-xl">{getActionIcon(item.action)}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-4">
                <div className={`rounded-lg p-4 transition-all ${
                  item.is_comment 
                    ? 'bg-purple-50 hover:bg-purple-100 border border-purple-100' 
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                }`}>
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${getActionColor(item.action)}`}>
                        {getActionLabel(item.action)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        By: <span className="font-medium">{item.user || "System"}</span>
                      </span>
                      {item.user_role && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                          {item.user_role}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadge(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400" title={getFullDate(item.date)}>
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message */}
                  {item.message && (
                    <div className="mb-3">
                      <p className="text-gray-700">{item.message}</p>
                    </div>
                  )}
                  
                  {/* Comment content */}
                  {item.comment && (
                    <div className="bg-white rounded-lg p-3 border border-purple-200 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500">💬</span>
                        <p className="text-gray-700 flex-1 whitespace-pre-wrap">{item.comment}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Change Details */}
                  {(item.old_status || item.new_status) && (
                    <div className="flex items-center gap-2 mt-2 text-sm bg-white rounded p-2 border border-gray-100">
                      <span className="text-gray-500">Status:</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {item.old_status || "—"}
                      </span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {item.new_status || "—"}
                      </span>
                    </div>
                  )}
                  
                  {/* Priority Change Details */}
                  {(item.old_priority || item.new_priority) && (
                    <div className="flex items-center gap-2 mt-2 text-sm bg-white rounded p-2 border border-gray-100">
                      <span className="text-gray-500">Priority:</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {item.old_priority || "—"}
                      </span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {item.new_priority || "—"}
                      </span>
                    </div>
                  )}
                  
                  {/* Assignment Change Details */}
                  {item.new_assignee && (
                    <div className="flex items-center gap-2 mt-2 text-sm bg-white rounded p-2 border border-gray-100">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">
                        Assigned to: <span className="font-semibold text-indigo-700">{item.new_assignee}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketHistory;