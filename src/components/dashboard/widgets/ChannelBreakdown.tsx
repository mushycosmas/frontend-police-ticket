import React, { useMemo } from 'react';

interface ChannelBreakdownProps {
  tickets: any[];
}

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({ tickets }) => {
  const channelStats = useMemo(() => {
    const stats: Record<string, { 
      count: number; 
      open: number; 
      assigned: number;
      inProgress: number; 
      resolved: number;
      closed: number;
      reopened: number;
      percentage: number;
    }> = {};
    
    tickets.forEach(ticket => {
      const channel = ticket.channel_name || 'Unknown';
      if (!stats[channel]) {
        stats[channel] = { 
          count: 0, 
          open: 0, 
          assigned: 0,
          inProgress: 0, 
          resolved: 0,
          closed: 0,
          reopened: 0,
          percentage: 0 
        };
      }
      stats[channel].count++;
      
      if (ticket.status === 'OPEN') stats[channel].open++;
      else if (ticket.status === 'ASSIGNED') stats[channel].assigned++;
      else if (ticket.status === 'IN_PROGRESS') stats[channel].inProgress++;
      else if (ticket.status === 'RESOLVED') stats[channel].resolved++;
      else if (ticket.status === 'CLOSED') stats[channel].closed++;
      else if (ticket.status === 'REOPENED') stats[channel].reopened++;
    });
    
    const total = tickets.length;
    Object.keys(stats).forEach(key => {
      stats[key].percentage = Math.round((stats[key].count / total) * 100);
    });
    
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  }, [tickets]);

  const total = tickets.length;

  const getChannelColor = (channel: string) => {
    const colors = [
      'bg-blue-50 border-blue-200 hover:bg-blue-100',
      'bg-purple-50 border-purple-200 hover:bg-purple-100',
      'bg-pink-50 border-pink-200 hover:bg-pink-100',
      'bg-green-50 border-green-200 hover:bg-green-100',
      'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      'bg-red-50 border-red-200 hover:bg-red-100',
      'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      'bg-teal-50 border-teal-200 hover:bg-teal-100',
      'bg-orange-50 border-orange-200 hover:bg-orange-100',
      'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
    ];
    const hash = channel.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📡 Channels</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Total: {total}</span>
          <span>|</span>
          <span>{Object.keys(channelStats).length} sources</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {channelStats.map(([channel, data]) => (
          <div
            key={channel}
            className={`p-3 rounded-lg border-2 ${getChannelColor(channel)} transition-all cursor-pointer group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate flex-1">
                {channel}
              </span>
              <span className="text-lg font-bold text-gray-900 ml-2">{data.count}</span>
            </div>
            
            <div className="mt-2 flex h-1.5 rounded-full overflow-hidden">
              {data.open > 0 && (
                <div className="h-full bg-yellow-500" style={{ width: `${(data.open / data.count) * 100}%` }} title={`Open: ${data.open}`} />
              )}
              {data.assigned > 0 && (
                <div className="h-full bg-blue-500" style={{ width: `${(data.assigned / data.count) * 100}%` }} title={`Assigned: ${data.assigned}`} />
              )}
              {data.inProgress > 0 && (
                <div className="h-full bg-indigo-500" style={{ width: `${(data.inProgress / data.count) * 100}%` }} title={`In Progress: ${data.inProgress}`} />
              )}
              {data.resolved > 0 && (
                <div className="h-full bg-green-500" style={{ width: `${(data.resolved / data.count) * 100}%` }} title={`Resolved: ${data.resolved}`} />
              )}
              {data.closed > 0 && (
                <div className="h-full bg-gray-500" style={{ width: `${(data.closed / data.count) * 100}%` }} title={`Closed: ${data.closed}`} />
              )}
              {data.reopened > 0 && (
                <div className="h-full bg-purple-500" style={{ width: `${(data.reopened / data.count) * 100}%` }} title={`Reopened: ${data.reopened}`} />
              )}
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{data.count} tickets</span>
              <span>{data.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      {channelStats.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <span className="text-4xl block mb-2">📭</span>
          No channels yet
        </div>
      )}
    </div>
  );
};