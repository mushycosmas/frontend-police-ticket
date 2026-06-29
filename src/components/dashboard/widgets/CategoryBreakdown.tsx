import React, { useMemo } from 'react';
import { getCategoryColor } from '../../../utils/colorHelpers';

interface CategoryBreakdownProps {
  tickets: any[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ tickets }) => {
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; tickets: any[] }> = {};
    tickets.forEach(ticket => {
      const category = ticket.category_name || 'Uncategorized';
      if (!stats[category]) stats[category] = { count: 0, tickets: [] };
      stats[category].count++;
      stats[category].tickets.push(ticket);
    });
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  }, [tickets]);

  const total = tickets.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📂 Categories</h3>
        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>
      <div className="space-y-3">
        {categoryStats.map(([category, data]) => (
          <div key={category} className="group">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium px-2 py-1 rounded ${getCategoryColor(category)}`}>
                {category}
              </span>
              <span className="text-sm font-semibold text-gray-700">{data.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(data.count / total) * 100}%`,
                  background: 'linear-gradient(90deg, #4F46E5, #7C3AED)'
                }}
              />
            </div>
          </div>
        ))}
        {categoryStats.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">No categories yet</div>
        )}
      </div>
    </div>
  );
};