import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { KPICard } from "../components/dashboard/KPICard";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import { ticketService } from "../services/ticket.service";
import { DashboardStats, Ticket } from "../types";
import { timeAgo } from "../utils/helpers";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET USER FROM LOCALSTORAGE (REPLACED CONTEXT)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    Promise.all([
      ticketService.getStats(),
      ticketService.getAll({ limit: 5, page: 1 }),
    ])
      .then(([s, t]) => {
        setStats(s);
        setRecentTickets(t.tickets);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>

          <p className="text-brand-muted text-sm mt-1">
            Welcome back{" "}
            <span className="font-semibold text-brand-primary">
              {user?.fullName || "User"}
            </span>
          </p>
        </div>

        <Link to="/tickets/create">
          <button className="btn-primary flex items-center gap-2">
            <span className="text-lg">✚</span> New Ticket
          </button>
        </Link>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Tickets" value={stats?.totalTickets ?? 0} icon="🎫" color="default" />

        <KPICard title="Open Tickets" value={stats?.openTickets ?? 0} icon="📬" color="warning" />

        <KPICard title="Resolved Today" value={stats?.resolvedToday ?? 0} icon="✅" color="success" />

        <KPICard title="Escalated" value={stats?.escalatedTickets ?? 0} icon="🔺" color="danger" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="CSAT Score"
          value={`${stats?.avgCsat ?? "N/A"} / 5`}
          icon="⭐"
          color="success"
        />

        <KPICard
          title="QA Pass Rate"
          value={stats?.qaPassRate ?? "0%"}
          icon="🔍"
          color={
            parseFloat(stats?.qaPassRate ?? "0") >= 80 ? "success" : "danger"
          }
        />

        <KPICard
          title="SLA Breaches"
          value={stats?.slaBreaches ?? 0}
          icon="⏱️"
          color={stats?.slaBreaches === 0 ? "success" : "danger"}
        />
      </div>

      {/* Recent Tickets */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-brand-primary">
            Recent Tickets
          </h2>

          <Link to="/tickets" className="text-sm text-brand-primary hover:underline">
            View all →
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="text-center py-10 text-brand-muted text-sm">
            No tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  {["ID", "Title", "Customer", "Status", "Priority", "Created"].map((h) => (
                    <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold text-brand-muted uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-brand-border">
                {recentTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-brand-gray">
                    <td className="py-3 pr-4 font-mono text-xs text-brand-muted">
                      #{String(t.id).padStart(4, "0")}
                    </td>

                    <td className="py-3 pr-4 font-medium text-brand-primary truncate">
                      <Link to={`/tickets/${t.id}`}>{t.title}</Link>
                    </td>

                    <td className="py-3 pr-4 text-brand-muted">
                      {t.customer?.fullName ?? "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <StatusBadge status={t.status} />
                    </td>

                    <td className="py-3 pr-4">
                      <PriorityBadge priority={t.priority} />
                    </td>

                    <td className="py-3 text-brand-muted text-xs">
                      {timeAgo(t.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};