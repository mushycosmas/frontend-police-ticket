import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface UserPerformanceChartProps {
  stats: {
    total_assigned: number;
    total_open: number;
    total_in_progress: number;
    total_resolved: number;
    total_closed: number;
  };
  tickets: any[];
}

const COLORS = {
  open: "#FBBF24", // yellow
  inProgress: "#60A5FA", // blue
  resolved: "#34D399", // green
  closed: "#9CA3AF", // gray
  assigned: "#8B5CF6", // purple
};

export const UserPerformanceChart: React.FC<UserPerformanceChartProps> = ({ stats, tickets }) => {
  // Data for status distribution pie chart
  const statusData = [
    { name: "Open", value: stats.total_open, color: COLORS.open },
    { name: "In Progress", value: stats.total_in_progress, color: COLORS.inProgress },
    { name: "Resolved", value: stats.total_resolved, color: COLORS.resolved },
    { name: "Closed", value: stats.total_closed, color: COLORS.closed },
  ].filter(item => item.value > 0);

  // Data for performance bar chart
  const performanceData = [
    {
      name: "Tickets",
      Assigned: stats.total_assigned,
      Resolved: stats.total_resolved,
      Closed: stats.total_closed,
      "In Progress": stats.total_in_progress,
    },
  ];

  // Calculate resolution rate
  const resolutionRate = stats.total_assigned > 0 
    ? ((stats.total_resolved + stats.total_closed) / stats.total_assigned * 100).toFixed(1)
    : 0;

  // Calculate completion rate
  const completionRate = stats.total_assigned > 0
    ? ((stats.total_resolved + stats.total_closed) / stats.total_assigned * 100).toFixed(1)
    : 0;

  // Get weekly ticket data from actual tickets
  const getWeeklyData = () => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const now = new Date();
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 28);
    
    const weeklyData = weeks.map((week, index) => {
      const weekStart = new Date(fourWeeksAgo);
      weekStart.setDate(fourWeeksAgo.getDate() + (index * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      const weekTickets = tickets.filter(ticket => {
        const createdDate = new Date(ticket.created_at);
        return createdDate >= weekStart && createdDate < weekEnd;
      });
      
      return {
        name: week,
        Assigned: weekTickets.length,
        Resolved: weekTickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length,
      };
    });
    
    return weeklyData;
  };

  const weeklyData = getWeeklyData();

  // Custom label for pie chart to handle undefined percent
  const renderCustomLabel = (entry: any) => {
    const percent = entry.percent;
    if (percent === undefined) return entry.name;
    return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{stats.total_assigned}</div>
          <div className="text-xs opacity-90">Total Assigned</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{stats.total_resolved + stats.total_closed}</div>
          <div className="text-xs opacity-90">Completed</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{resolutionRate}%</div>
          <div className="text-xs opacity-90">Resolution Rate</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{stats.total_in_progress}</div>
          <div className="text-xs opacity-90">In Progress</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Status Distribution</h4>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} tickets`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </div>

        {/* Performance Bar Chart */}
        <div className="bg-white rounded-lg border p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Assigned" fill={COLORS.assigned} />
              <Bar dataKey="In Progress" fill={COLORS.inProgress} />
              <Bar dataKey="Resolved" fill={COLORS.resolved} />
              <Bar dataKey="Closed" fill={COLORS.closed} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="bg-white rounded-lg border p-4 lg:col-span-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Weekly Performance Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Assigned" stroke={COLORS.assigned} strokeWidth={2} />
              <Line type="monotone" dataKey="Resolved" stroke={COLORS.resolved} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500">Resolution Rate</div>
            <div className="text-xl font-bold text-green-600">{resolutionRate}%</div>
            <div className="text-xs text-gray-400">
              {stats.total_resolved + stats.total_closed} / {stats.total_assigned}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Completion Rate</div>
            <div className="text-xl font-bold text-blue-600">{completionRate}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Open Tickets</div>
            <div className="text-xl font-bold text-yellow-600">{stats.total_open}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">In Progress</div>
            <div className="text-xl font-bold text-purple-600">{stats.total_in_progress}</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Overall Progress</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPerformanceChart;