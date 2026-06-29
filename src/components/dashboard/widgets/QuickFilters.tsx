import React from 'react';

interface QuickFiltersProps {
  onFilter: (filter: string) => void;
  activeFilter: string;
  ticketCounts: {
    all: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    open: number;
    assigned: number;
    in_progress: number;
    resolved: number;
    closed: number;
    reopened: number;
  };
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ 
  onFilter, 
  activeFilter, 
  ticketCounts 
}) => {
  const filters = [
    { label: '📋 All', value: 'all', count: ticketCounts.all },
    { label: '🔴 Critical', value: 'critical', count: ticketCounts.critical },
    { label: '🟠 High', value: 'high', count: ticketCounts.high },
    { label: '🔵 Medium', value: 'medium', count: ticketCounts.medium },
    { label: '⚪ Low', value: 'low', count: ticketCounts.low },
    { label: '📂 Open', value: 'open', count: ticketCounts.open },
    { label: '📌 Assigned', value: 'assigned', count: ticketCounts.assigned },
    { label: '🔄 In Progress', value: 'in_progress', count: ticketCounts.in_progress },
    { label: '✅ Resolved', value: 'resolved', count: ticketCounts.resolved },
    { label: '✔️ Closed', value: 'closed', count: ticketCounts.closed },
    { label: '🔁 Reopened', value: 'reopened', count: ticketCounts.reopened },
  ];

  const visibleFilters = filters.filter(f => f.count > 0 || f.value === 'all');

  const getBadgeColor = (value: string) => {
    const colorMap: Record<string, string> = {
      'all': 'bg-gray-200 text-gray-600',
      'critical': 'bg-red-200 text-red-800',
      'high': 'bg-orange-200 text-orange-800',
      'medium': 'bg-blue-200 text-blue-800',
      'low': 'bg-gray-200 text-gray-600',
      'open': 'bg-yellow-200 text-yellow-800',
      'assigned': 'bg-blue-200 text-blue-800',
      'in_progress': 'bg-indigo-200 text-indigo-800',
      'resolved': 'bg-green-200 text-green-800',
      'closed': 'bg-gray-200 text-gray-600',
      'reopened': 'bg-purple-200 text-purple-800',
    };
    return colorMap[value] || 'bg-gray-200 text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🏷️ Quick Filters</h3>
        {activeFilter !== 'all' && (
          <button
            onClick={() => onFilter('all')}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear filter ✕
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleFilters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilter(filter.value)}
            className={`px-4 py-2 rounded-full border-2 transition-all text-sm font-medium flex items-center space-x-2 ${
              activeFilter === filter.value
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeFilter === filter.value
                ? 'bg-blue-200 text-blue-800'
                : getBadgeColor(filter.value)
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};