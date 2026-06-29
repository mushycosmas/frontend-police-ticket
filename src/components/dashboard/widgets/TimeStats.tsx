import React, { useMemo } from 'react';

interface TimeStatsProps {
  tickets: any[];
}

export const TimeStats: React.FC<TimeStatsProps> = ({ tickets }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const todayTickets = tickets.filter(t => t.created_at?.startsWith(todayStr));
  const thisWeek = tickets.filter(t => {
    const created = new Date(t.created_at);
    const diff = (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const avgResolutionTime = useMemo(() => {
    const resolved = tickets.filter(t => t.resolved_at);
    if (resolved.length === 0) return 0;
    const total = resolved.reduce((acc, t) => {
      const created = new Date(t.created_at).getTime();
      const resolved = new Date(t.resolved_at).getTime();
      return acc + (resolved - created);
    }, 0);
    return Math.round(total / resolved.length / (1000 * 60));
  }, [tickets]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">⏱️ Time Insights</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{todayTickets.length}</p>
          <p className="text-sm text-gray-600">Created Today</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{thisWeek.length}</p>
          <p className="text-sm text-gray-600">This Week</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg col-span-2">
          <p className="text-2xl font-bold text-green-600">
            {avgResolutionTime > 0 ? `${avgResolutionTime}m` : 'N/A'}
          </p>
          <p className="text-sm text-gray-600">Avg Resolution Time</p>
        </div>
      </div>
    </div>
  );
};