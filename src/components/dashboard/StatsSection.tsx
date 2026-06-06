import React from "react";

interface StatsSectionProps {
  stats: {
    totalTickets?: number;
    openTickets?: number;
    resolvedToday?: number;
    escalatedTickets?: number;
  } | null;
  priorityStats?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, priorityStats }) => {
  const total = stats?.totalTickets || 1;
  
  const statuses = [
    { label: "Open", value: stats?.openTickets || 0, color: "bg-yellow-500" },
    { label: "Resolved", value: stats?.resolvedToday || 0, color: "bg-green-500" },
    { label: "Escalated", value: stats?.escalatedTickets || 0, color: "bg-red-500" },
  ];

  const priorities = [
    { label: "Critical", value: priorityStats?.critical || 0, color: "bg-red-500" },
    { label: "High", value: priorityStats?.high || 0, color: "bg-orange-500" },
    { label: "Medium", value: priorityStats?.medium || 0, color: "bg-yellow-500" },
    { label: "Low", value: priorityStats?.low || 0, color: "bg-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Status Distribution</h3>
        <div className="space-y-3">
          {statuses.map((status) => (
            <div key={status.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{status.label}</span>
                <span className="text-sm font-medium">{status.value}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${status.color} rounded-full transition-all duration-500`} 
                  style={{ width: `${(status.value / total) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Priority Distribution</h3>
        <div className="space-y-3">
          {priorities.map((priority) => (
            <div key={priority.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{priority.label}</span>
                <span className="text-sm font-medium">{priority.value}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${priority.color} rounded-full transition-all duration-500`} 
                  style={{ width: `${(priority.value / total) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};