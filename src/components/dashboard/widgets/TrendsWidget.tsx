import React from 'react';

interface TrendsWidgetProps {
  tickets: any[];
}

export const TrendsWidget: React.FC<TrendsWidgetProps> = ({ tickets }) => {
  const total = tickets.length;
  const closed = tickets.filter(t => t.status === 'CLOSED').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
  const resolutionRate = total > 0 ? Math.round(((closed + resolved) / total) * 100) : 0;

  const criticalCount = tickets.filter(t => t.priority === 'CRITICAL').length;
  const criticalOpen = tickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'CLOSED' && t.status !== 'RESOLVED').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Trends</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Resolution Rate</span>
            <span className="text-sm font-semibold text-gray-900">{resolutionRate}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-500 bg-green-500"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Critical Issues</p>
            <p className="text-xs text-gray-500">{criticalOpen} open / {criticalCount} total</p>
          </div>
          <span className="text-2xl font-bold text-red-600">{criticalCount}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Team Efficiency</p>
            <p className="text-xs text-gray-500">{total} tickets handled</p>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {total > 0 ? Math.round((closed + resolved) / total * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};