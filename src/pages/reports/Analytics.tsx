import React, { useEffect, useState } from "react";
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
import { getTickets } from "../../api/ticketApi";

type Ticket = {
  id: number;
  ticket_number: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  resolved_at?: string;
  channel?: string;
};

type AnalyticsData = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  escalated: number;
  criticalPriority: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
};

const COLORS = {
  open: "#FBBF24",
  inProgress: "#60A5FA",
  resolved: "#34D399",
  closed: "#9CA3AF",
  escalated: "#F87171",
  critical: "#EF4444",
  high: "#F97316",
  medium: "#FBBF24",
  low: "#10B981",
};

const Analytics: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsData>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    escalated: 0,
    criticalPriority: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  // =========================
  // LOAD REAL DATA
  // =========================
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await getTickets();
      const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setTickets(data);
      calculateStats(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CALCULATE STATS
  // =========================
  const calculateStats = (ticketsData: Ticket[]) => {
    let open = 0,
      inProgress = 0,
      resolved = 0,
      closed = 0,
      escalated = 0;
    let critical = 0,
      high = 0,
      medium = 0,
      low = 0;

    ticketsData.forEach((ticket) => {
      // Status counts
      const status = ticket.status;
      if (status === "OPEN") open++;
      else if (status === "IN_PROGRESS") inProgress++;
      else if (status === "RESOLVED") resolved++;
      else if (status === "CLOSED") closed++;
      else if (status === "ESCALATED") escalated++;

      // Priority counts (handle both formats)
      const priority = ticket.priority;
      if (priority === "P1_CRITICAL" || priority === "CRITICAL") critical++;
      else if (priority === "P2_HIGH" || priority === "HIGH") high++;
      else if (priority === "P3_MEDIUM" || priority === "MEDIUM") medium++;
      else if (priority === "P4_LOW" || priority === "LOW") low++;
    });

    setStats({
      total: ticketsData.length,
      open,
      inProgress,
      resolved,
      closed,
      escalated,
      criticalPriority: critical,
      highPriority: high,
      mediumPriority: medium,
      lowPriority: low,
    });
  };

  // =========================
  // CHART DATA
  // =========================
  const statusChartData = [
    { name: "Open", value: stats.open, color: COLORS.open },
    { name: "In Progress", value: stats.inProgress, color: COLORS.inProgress },
    { name: "Resolved", value: stats.resolved, color: COLORS.resolved },
    { name: "Closed", value: stats.closed, color: COLORS.closed },
    { name: "Escalated", value: stats.escalated, color: COLORS.escalated },
  ].filter((item) => item.value > 0);

  const priorityChartData = [
    { name: "Critical", value: stats.criticalPriority, color: COLORS.critical },
    { name: "High", value: stats.highPriority, color: COLORS.high },
    { name: "Medium", value: stats.mediumPriority, color: COLORS.medium },
    { name: "Low", value: stats.lowPriority, color: COLORS.low },
  ].filter((item) => item.value > 0);

  // Weekly trend data
  const getWeeklyTrend = () => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const now = new Date();
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 28);

    return weeks.map((week, index) => {
      const weekStart = new Date(fourWeeksAgo);
      weekStart.setDate(fourWeeksAgo.getDate() + index * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekTickets = tickets.filter((ticket) => {
        const createdDate = new Date(ticket.created_at);
        return createdDate >= weekStart && createdDate < weekEnd;
      });

      return {
        name: week,
        Created: weekTickets.length,
        Resolved: weekTickets.filter(
          (t) => t.status === "RESOLVED" || t.status === "CLOSED"
        ).length,
      };
    });
  };

  const weeklyData = getWeeklyTrend();

  // Resolution rate
  const resolutionRate =
    stats.total > 0
      ? (((stats.resolved + stats.closed) / stats.total) * 100).toFixed(1)
      : 0;

  // =========================
  // REUSABLE CARD
  // =========================
  const StatCard = ({
    title,
    value,
    color,
    icon,
  }: {
    title: string;
    value: number;
    color?: string;
    icon?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className={`text-3xl font-bold mt-1 ${color ?? "text-gray-800"}`}>
            {value}
          </h2>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of ticket performance and system activity
        </p>
      </div>

      {/* TOP STATS ROW 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tickets" value={stats.total} icon="🎫" />
        <StatCard
          title="Open"
          value={stats.open}
          color="text-yellow-600"
          icon="📬"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="text-blue-600"
          icon="⚙️"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          color="text-green-600"
          icon="✅"
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          color="text-gray-600"
          icon="🔒"
        />
      </div>

      {/* RESOLUTION RATE & METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-5 text-white">
          <p className="text-sm opacity-90">Resolution Rate</p>
          <p className="text-3xl font-bold mt-1">{resolutionRate}%</p>
          <p className="text-xs opacity-75 mt-1">
            {stats.resolved + stats.closed} / {stats.total} tickets
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-sm p-5 text-white">
          <p className="text-sm opacity-90">Escalated</p>
          <p className="text-3xl font-bold mt-1">{stats.escalated}</p>
          <p className="text-xs opacity-75 mt-1">Needs attention</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-5 text-white">
          <p className="text-sm opacity-90">Critical Priority</p>
          <p className="text-3xl font-bold mt-1">{stats.criticalPriority}</p>
          <p className="text-xs opacity-75 mt-1">Immediate action</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-5 text-white">
          <p className="text-sm opacity-90">High Priority</p>
          <p className="text-3xl font-bold mt-1">{stats.highPriority}</p>
          <p className="text-xs opacity-75 mt-1">Urgent</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Status Distribution
          </h3>
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">No data</div>
          )}
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Priority Distribution
          </h3>
          {priorityChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">No data</div>
          )}
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Weekly Performance Trend
        </h3>
        {weeklyData.some((d) => d.Created > 0 || d.Resolved > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Created"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Resolved"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-400">No data</div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Status Summary</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Open</span>
                <span>{stats.open}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.open / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Progress</span>
                <span>{stats.inProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Resolved</span>
                <span>{stats.resolved}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Closed</span>
                <span>{stats.closed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${(stats.closed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Priority Summary</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Critical</span>
                <span>{stats.criticalPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.criticalPriority / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>High</span>
                <span>{stats.highPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Medium</span>
                <span>{stats.mediumPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.mediumPriority / stats.total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Low</span>
                <span>{stats.lowPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.lowPriority / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;