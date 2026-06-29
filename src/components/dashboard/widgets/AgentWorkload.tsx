import React, { useMemo } from 'react';

interface AgentWorkloadProps {
  tickets: any[];
}

export const AgentWorkload: React.FC<AgentWorkloadProps> = ({ tickets }) => {
  const agentStats = useMemo(() => {
    const stats: Record<string, { 
      count: number; 
      open: number;
      assigned: number; 
      inProgress: number;
      resolved: number;
      closed: number;
      reopened: number;
    }> = {};
    
    tickets.forEach(ticket => {
      const agent = ticket.assigned_to_name || 'Unassigned';
      if (!stats[agent]) {
        stats[agent] = { 
          count: 0, 
          open: 0,
          assigned: 0, 
          inProgress: 0,
          resolved: 0,
          closed: 0,
          reopened: 0
        };
      }
      stats[agent].count++;
      
      if (ticket.status === 'OPEN') stats[agent].open++;
      else if (ticket.status === 'ASSIGNED') stats[agent].assigned++;
      else if (ticket.status === 'IN_PROGRESS') stats[agent].inProgress++;
      else if (ticket.status === 'RESOLVED') stats[agent].resolved++;
      else if (ticket.status === 'CLOSED') stats[agent].closed++;
      else if (ticket.status === 'REOPENED') stats[agent].reopened++;
    });
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
  }, [tickets]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Agent Workload</h3>
      <div className="space-y-3">
        {agentStats.map(([agent, data]) => (
          <div key={agent} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {agent.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{agent}</p>
                <div className="flex space-x-1 text-xs">
                  <span className="text-yellow-600">📂 {data.open}</span>
                  <span className="text-blue-600">📌 {data.assigned}</span>
                  <span className="text-indigo-600">🔄 {data.inProgress}</span>
                  <span className="text-green-600">✅ {data.resolved}</span>
                  <span className="text-gray-600">✔️ {data.closed}</span>
                  <span className="text-purple-600">🔁 {data.reopened}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">{data.count}</span>
              <p className="text-xs text-gray-500">tickets</p>
            </div>
          </div>
        ))}
        {agentStats.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">No agents assigned</div>
        )}
      </div>
    </div>
  );
};