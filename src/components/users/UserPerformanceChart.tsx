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

/* =========================
   TYPES
========================= */
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

/* =========================
   COLORS
========================= */
const COLORS = {
  open: "#FBBF24",
  inProgress: "#60A5FA",
  resolved: "#34D399",
  closed: "#9CA3AF",
  assigned: "#8B5CF6",
};

/* =========================
   COMPONENT
========================= */
export const UserPerformanceChart: React.FC<UserPerformanceChartProps> = ({
  stats,
  tickets,
}) => {
  const statusData = [
    { name: "Open", value: stats.total_open, color: COLORS.open },
    { name: "In Progress", value: stats.total_in_progress, color: COLORS.inProgress },
    { name: "Resolved", value: stats.total_resolved, color: COLORS.resolved },
    { name: "Closed", value: stats.total_closed, color: COLORS.closed },
  ].filter((item) => item.value > 0);

  const performanceData = [
    {
      name: "Tickets",
      Assigned: stats.total_assigned,
      Resolved: stats.total_resolved,
      Closed: stats.total_closed,
      "In Progress": stats.total_in_progress,
    },
  ];

  const resolutionRate =
    stats.total_assigned > 0
      ? (
          ((stats.total_resolved + stats.total_closed) /
            stats.total_assigned) *
          100
        ).toFixed(1)
      : "0";

  const weeklyData = ["Week 1", "Week 2", "Week 3", "Week 4"].map((w, i) => {
    const start = i * 7;
    const slice = tickets.slice(start, start + 7);

    return {
      name: w,
      Assigned: slice.length,
      Resolved: slice.filter(
        (t) => t.status === "RESOLVED" || t.status === "CLOSED"
      ).length,
    };
  });

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-purple-600 text-white p-3 rounded">
          <div className="text-2xl font-bold">{stats.total_assigned}</div>
          <div className="text-xs">Assigned</div>
        </div>

        <div className="bg-green-600 text-white p-3 rounded">
          <div className="text-2xl font-bold">
            {stats.total_resolved + stats.total_closed}
          </div>
          <div className="text-xs">Completed</div>
        </div>

        <div className="bg-blue-600 text-white p-3 rounded">
          <div className="text-2xl font-bold">{resolutionRate}%</div>
          <div className="text-xs">Resolution Rate</div>
        </div>

        <div className="bg-yellow-500 text-white p-3 rounded">
          <div className="text-2xl font-bold">{stats.total_in_progress}</div>
          <div className="text-xs">In Progress</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" label>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Assigned" fill="#8B5CF6" />
              <Bar dataKey="Resolved" fill="#34D399" />
              <Bar dataKey="Closed" fill="#9CA3AF" />
              <Bar dataKey="In Progress" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="lg:col-span-2 border rounded p-4">
          <h3 className="font-semibold mb-2">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Assigned" stroke="#8B5CF6" />
              <Line type="monotone" dataKey="Resolved" stroke="#34D399" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserPerformanceChart;