import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getTickets } from "../api/ticketApi";
import { DashboardStats, Ticket } from "../types";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { KPISection } from "../components/dashboard/KPISection";
import { RecentTickets } from "../components/dashboard/RecentTickets";
import { StatsSection } from "../components/dashboard/StatsSection";
import TicketViewModal from "../components/tickets/TicketViewModal";
import OverdueTicketsWidget from "../components/dashboard/OverdueTicketsWidget";

// ─── Helper Functions ──────────────────────────────────────────

const normalizePriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'CRITICAL': 'P1_CRITICAL',
    'P1_CRITICAL': 'P1_CRITICAL',
    'HIGH': 'P2_HIGH',
    'P2_HIGH': 'P2_HIGH',
    'MEDIUM': 'P3_MEDIUM',
    'P3_MEDIUM': 'P3_MEDIUM',
    'LOW': 'P4_LOW',
    'P4_LOW': 'P4_LOW',
  };
  return priorityMap[priority?.toUpperCase()] || 'P3_MEDIUM';
};

const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'OPEN': 'OPEN',
    'ASSIGNED': 'ASSIGNED',
    'IN_PROGRESS': 'IN_PROGRESS',
    'RESOLVED': 'RESOLVED',
    'CLOSED': 'CLOSED',
    'REOPENED': 'REOPENED',
  };
  return statusMap[status?.toUpperCase()] || status;
};

// ─── Color Helpers ─────────────────────────────────────────────

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'OPEN': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'ASSIGNED': 'bg-blue-100 text-blue-800 border-blue-200',
    'IN_PROGRESS': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'RESOLVED': 'bg-green-100 text-green-800 border-green-200',
    'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200',
    'REOPENED': 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'CRITICAL': 'bg-red-100 text-red-800',
    'P1_CRITICAL': 'bg-red-100 text-red-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'P2_HIGH': 'bg-orange-100 text-orange-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'P3_MEDIUM': 'bg-yellow-100 text-yellow-800',
    'LOW': 'bg-green-100 text-green-800',
    'P4_LOW': 'bg-green-100 text-green-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

const getCategoryColor = (category: string): string => {
  const colors = [
    'bg-indigo-100 text-indigo-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800',
    'bg-amber-100 text-amber-800',
    'bg-emerald-100 text-emerald-800',
    'bg-rose-100 text-rose-800',
    'bg-fuchsia-100 text-fuchsia-800',
    'bg-sky-100 text-sky-800',
  ];
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// ─── Sub-Components ────────────────────────────────────────────

// 📊 Status Distribution Widget - ALL 6 STATUSES
const StatusDistribution: React.FC<{ tickets: any[] }> = ({ tickets }) => {
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

// 📊 Category Breakdown Widget
const CategoryBreakdown: React.FC<{ tickets: any[] }> = ({ tickets }) => {
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

// 📡 Channel Breakdown Widget
const ChannelBreakdown: React.FC<{ tickets: any[] }> = ({ tickets }) => {
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

// 👥 Agent Workload Widget
const AgentWorkload: React.FC<{ tickets: any[] }> = ({ tickets }) => {
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

// ⏱️ Time-Based Stats Widget
const TimeStats: React.FC<{ tickets: any[] }> = ({ tickets }) => {
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

// 🏷️ Quick Filters Widget - ALL 6 STATUSES
const QuickFilters: React.FC<{ 
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
}> = ({ onFilter, activeFilter, ticketCounts }) => {
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

// 📈 Trends Widget
const TrendsWidget: React.FC<{ tickets: any[] }> = ({ tickets }) => {
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

// ─── MAIN DASHBOARD ────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [priorityStats, setPriorityStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showView, setShowView] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTickets = useCallback((tickets: any[], filter: string) => {
    if (filter === 'all') return tickets;
    
    if (filter === 'critical') return tickets.filter(t => t.priority === 'CRITICAL');
    if (filter === 'high') return tickets.filter(t => t.priority === 'HIGH');
    if (filter === 'medium') return tickets.filter(t => t.priority === 'MEDIUM');
    if (filter === 'low') return tickets.filter(t => t.priority === 'LOW');
    
    if (filter === 'open') return tickets.filter(t => t.status === 'OPEN');
    if (filter === 'assigned') return tickets.filter(t => t.status === 'ASSIGNED');
    if (filter === 'in_progress') return tickets.filter(t => t.status === 'IN_PROGRESS');
    if (filter === 'resolved') return tickets.filter(t => t.status === 'RESOLVED');
    if (filter === 'closed') return tickets.filter(t => t.status === 'CLOSED');
    if (filter === 'reopened') return tickets.filter(t => t.status === 'REOPENED');
    
    return tickets;
  }, []);

  const getTicketCounts = useCallback((tickets: any[]) => {
    return {
      all: tickets.length,
      critical: tickets.filter(t => t.priority === 'CRITICAL').length,
      high: tickets.filter(t => t.priority === 'HIGH').length,
      medium: tickets.filter(t => t.priority === 'MEDIUM').length,
      low: tickets.filter(t => t.priority === 'LOW').length,
      open: tickets.filter(t => t.status === 'OPEN').length,
      assigned: tickets.filter(t => t.status === 'ASSIGNED').length,
      in_progress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVED').length,
      closed: tickets.filter(t => t.status === 'CLOSED').length,
      reopened: tickets.filter(t => t.status === 'REOPENED').length,
    };
  }, []);

  const calculateStats = useCallback((tickets: any[]) => {
    const totalTickets = tickets.length;
    
    const openTickets = tickets.filter(t => 
      t.status === "OPEN" || t.status === "ASSIGNED" || t.status === "IN_PROGRESS" || t.status === "REOPENED"
    ).length;
    
    const resolvedToday = tickets.filter(t => 
      t.status === "RESOLVED" || t.status === "CLOSED"
    ).length;
    
    const escalatedTickets = tickets.filter(t => 
      t.status === "ESCALATED"
    ).length;

    let critical = 0, high = 0, medium = 0, low = 0;
    tickets.forEach(ticket => {
      const priority = ticket.priority?.toUpperCase() || '';
      if (priority === 'CRITICAL' || priority === 'P1_CRITICAL') critical++;
      else if (priority === 'HIGH' || priority === 'P2_HIGH') high++;
      else if (priority === 'MEDIUM' || priority === 'P3_MEDIUM') medium++;
      else if (priority === 'LOW' || priority === 'P4_LOW') low++;
    });

    setPriorityStats({ critical, high, medium, low });

    const newStats: DashboardStats = {
      totalTickets,
      openTickets,
      resolvedToday,
      escalatedTickets,
      avgCsat: "4.5",
      slaBreaches: 0,
      qaPassRate: "85%",
    };

    setStats(newStats);
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTickets();
      const tickets = Array.isArray(res.data) ? res.data : res.data?.results || [];
      
      const mappedTickets = tickets.map((ticket: any) => ({
        ...ticket,
        display_status: mapStatus(ticket.status),
        display_priority: normalizePriority(ticket.priority)
      }));
      
      setAllTickets(mappedTickets);
      
      const filtered = filterTickets(mappedTickets, activeFilter);
      setFilteredTickets(filtered);
      setRecentTickets(filtered.slice(0, 5));
      calculateStats(filtered);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats, filterTickets, activeFilter]);

  const handleFilter = useCallback((filterValue: string) => {
    setActiveFilter(filterValue);
    const filtered = filterTickets(allTickets, filterValue);
    setFilteredTickets(filtered);
    setRecentTickets(filtered.slice(0, 5));
    calculateStats(filtered);
  }, [allTickets, filterTickets, calculateStats]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleViewTicket = useCallback((ticket: any) => {
    setSelectedTicketId(ticket.id);
    setShowView(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowView(false);
    setSelectedTicketId(null);
  }, []);

  const ticketCounts = useMemo(() => getTicketCounts(allTickets), [allTickets, getTicketCounts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <DashboardHeader username={user?.username || user?.full_name || "User"} />
      
      {/* KPI Section */}
      <KPISection stats={stats} />
      
      {/* Quick Filters */}
      <QuickFilters 
        onFilter={handleFilter} 
        activeFilter={activeFilter}
        ticketCounts={ticketCounts}
      />
      
      {/* ✅ NEW: Status Distribution - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <StatusDistribution tickets={filteredTickets} />
      </div>
      
      {/* Two Column Layout: Category & Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown tickets={filteredTickets} />
        <ChannelBreakdown tickets={filteredTickets} />
      </div>
      
      {/* Three Column Layout: Overdue, Agent Workload, Time Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverdueTicketsWidget />
        <AgentWorkload tickets={filteredTickets} />
        <TimeStats tickets={filteredTickets} />
      </div>
      
      {/* Two Column Layout: Recent Tickets & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTickets tickets={recentTickets} onViewTicket={handleViewTicket} />
        </div>
        <div>
          <TrendsWidget tickets={filteredTickets} />
        </div>
      </div>
      
      {/* Stats Section - Full Width */}
      <StatsSection stats={stats} priorityStats={priorityStats} />
      
      {/* Ticket View Modal */}
      <TicketViewModal
        show={showView}
        ticketId={selectedTicketId}
        onHide={handleCloseModal}
        onRefresh={loadDashboard}
      />
    </div>
  );
};

export default Dashboard;