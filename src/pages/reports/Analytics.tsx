import React, { useEffect, useState } from "react";

type Ticket = {
  id: number;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
};

type AnalyticsData = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
};

const Analytics: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<AnalyticsData>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  // =========================
  // MOCK DATA (replace API later)
  // =========================
  useEffect(() => {
    const data: Ticket[] = [
      { id: 1, status: "OPEN", priority: "HIGH" },
      { id: 2, status: "IN_PROGRESS", priority: "MEDIUM" },
      { id: 3, status: "RESOLVED", priority: "LOW" },
      { id: 4, status: "CLOSED", priority: "HIGH" },
      { id: 5, status: "OPEN", priority: "MEDIUM" },
      { id: 6, status: "IN_PROGRESS", priority: "HIGH" },
      { id: 7, status: "RESOLVED", priority: "LOW" },
      { id: 8, status: "OPEN", priority: "LOW" },
    ];

    setTickets(data);
  }, []);

  // =========================
  // CALCULATE STATS
  // =========================
  useEffect(() => {
    setStats({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "OPEN").length,
      inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      closed: tickets.filter((t) => t.status === "CLOSED").length,

      highPriority: tickets.filter((t) => t.priority === "HIGH").length,
      mediumPriority: tickets.filter((t) => t.priority === "MEDIUM").length,
      lowPriority: tickets.filter((t) => t.priority === "LOW").length,
    });
  }, [tickets]);

  // =========================
  // REUSABLE CARD
  // =========================
  const StatCard = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: number;
    color?: string;
  }) => (
    <div className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color ?? "text-black"}`}>
        {value}
      </h2>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of ticket performance and system activity
        </p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={stats.total} />
        <StatCard title="Open" value={stats.open} color="text-blue-600" />
        <StatCard title="In Progress" value={stats.inProgress} color="text-yellow-600" />
        <StatCard title="Resolved" value={stats.resolved} color="text-green-600" />
        <StatCard title="Closed" value={stats.closed} color="text-gray-600" />
      </div>

      {/* PRIORITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700">High Priority</h3>
          <p className="text-red-600 text-2xl font-bold mt-2">
            {stats.highPriority}
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700">Medium Priority</h3>
          <p className="text-yellow-600 text-2xl font-bold mt-2">
            {stats.mediumPriority}
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700">Low Priority</h3>
          <p className="text-green-600 text-2xl font-bold mt-2">
            {stats.lowPriority}
          </p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Performance Overview
        </h3>

        <div className="h-48 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
          Chart Area (Recharts / Chart.js here)
        </div>
      </div>

    </div>
  );
};

export default Analytics;