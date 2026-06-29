import React, { useMemo } from 'react';

interface StatusDistributionProps {
  tickets: any[];
}

export const StatusDistribution: React.FC<StatusDistributionProps> = ({ tickets }) => {
  const statusStats = useMemo(() => {
    const stats: Record<string, { count: number; tickets: any[] }> = {};
    
    // Initialize ALL 6 statuses with 0
    const allStatuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED'];
    allStatuses.forEach(status => {
      stats[status] = { count: 0, tickets: [] };
    });
    
    // Count tickets by status
    tickets.forEach(ticket => {
      const status = ticket.status || 'UNKNOWN';
      if (!stats[status]) stats[status] = { count: 0, tickets: [] };
      stats[status].count++;
      stats[status].tickets.push(ticket);
    });
    
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  }, [tickets]);

  const total = tickets.length;

  const getStatusBadgeColor = (status: string): string => {
    const colors: Record<string, string> = {
      'OPEN': 'bg-yellow-100 text-yellow-800',
      'ASSIGNED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-indigo-100 text-indigo-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
      'REOPENED': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDotColor = (status: string): string => {
    const colors: Record<string, string> = {
      'OPEN': 'bg-yellow-500',
      'ASSIGNED': 'bg-blue-500',
      'IN_PROGRESS': 'bg-indigo-500',
      'RESOLVED': 'bg-green-500',
      'CLOSED': 'bg-gray-500',
      'REOPENED': 'bg-purple-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string): string => {
    const icons: Record<string, string> = {
      'OPEN': '📂',
      'ASSIGNED': '📌',
      'IN_PROGRESS': '🔄',
      'RESOLVED': '✅',
      'CLOSED': '✔️',
      'REOPENED': '🔁',
    };
    return icons[status] || '📋';
  };

  const getStatusDescription = (status: string): string => {
    const descriptions: Record<string, string> = {
      'OPEN': 'Awaiting assignment',
      'ASSIGNED': 'Awaiting action',
      'IN_PROGRESS': 'Being worked on',
      'RESOLVED': 'Ready for closure',
      'CLOSED': 'Completed',
      'REOPENED': 'Reopened for review',
    };
    return descriptions[status] || '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Status Distribution</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Total: {total}</span>
          <span>|</span>
          <span>{statusStats.filter(([_, data]) => data.count > 0).length} active</span>
        </div>
      </div>

      <div className="space-y-4">
        {statusStats.map(([status, data]) => {
          const percentage = total > 0 ? Math.round((data.count / total) * 100) : 0;
          
          return (
            <div key={status} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(status)}</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusBadgeColor(status)}`}>
                    {status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {data.count} tickets
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
                  <span className="w-12 text-xs text-gray-400 text-right">
                    {data.count > 0 ? `${data.count}` : '—'}
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${getStatusDotColor(status)}`}
                  style={{ 
                    width: `${percentage}%`,
                    background: data.count > 0 ? undefined : 'transparent'
                  }}
                />
              </div>
              
              {/* Status description */}
              {data.count > 0 && (
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>{data.count} tickets</span>
                  <span>{getStatusDescription(status)}</span>
                </div>
              )}
            </div>
          );
        })}

        {statusStats.every(([_, data]) => data.count === 0) && (
          <div className="text-center py-8 text-gray-500 text-sm">
            <span className="text-4xl block mb-2">📭</span>
            No tickets yet
          </div>
        )}
      </div>

      {/* Quick summary stats */}
      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">
              {statusStats.filter(([status, data]) => 
                status === 'RESOLVED' || status === 'CLOSED'
              ).reduce((acc, [_, data]) => acc + data.count, 0)}
            </p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">
              {statusStats.filter(([status, data]) => 
                status === 'OPEN' || status === 'ASSIGNED' || status === 'REOPENED'
              ).reduce((acc, [_, data]) => acc + data.count, 0)}
            </p>
            <p className="text-xs text-gray-500">Awaiting</p>
          </div>
          <div className="text-center p-2 bg-indigo-50 rounded-lg">
            <p className="text-lg font-bold text-indigo-600">
              {statusStats.filter(([status, data]) => 
                status === 'IN_PROGRESS'
              ).reduce((acc, [_, data]) => acc + data.count, 0)}
            </p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
        </div>
      )}
    </div>
  );
};