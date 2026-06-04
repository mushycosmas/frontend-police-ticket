import React, { useEffect, useState } from "react";

import { KPICard } from "../components/dashboard/KPICard";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import TicketViewModal from "../components/tickets/TicketViewModal";

import { getTickets } from "../api/ticketApi";
import { DashboardStats, Ticket } from "../types";
import { timeAgo } from "../utils/helpers";

/**
 * Safe status normalizer (prevents TS errors)
 */
const normalizeStatus = (status: any): string =>
  String(status || "").toUpperCase();

export const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [showView, setShowView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // =========================
  // LOAD DASHBOARD
  // =========================
  const loadDashboard = async () => {
    setLoading(true);

    try {
      const res = await getTickets();

      const tickets: Ticket[] = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setRecentTickets(tickets.slice(0, 5));

      // =========================
      // SAFE STATS CALCULATION
      // =========================
      const openTickets = tickets.filter(
        (t) => normalizeStatus(t.status) === "OPEN"
      ).length;

      const resolvedToday = tickets.filter(
        (t) => normalizeStatus(t.status) === "RESOLVED"
      ).length;

      const escalatedTickets = tickets.filter(
        (t) => normalizeStatus(t.status) === "ESCALATED"
      ).length;

      setStats({
        totalTickets: tickets.length,
        openTickets,
        resolvedToday,
        escalatedTickets,
        avgCsat: "4.5",
        qaPassRate: "85%",
        slaBreaches: 2,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <p className="text-sm text-gray-500 mt-1">
            Welcome back{" "}
            <span className="font-semibold text-blue-600">
              {user?.username || "User"}
            </span>
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Total Tickets" value={stats?.totalTickets ?? 0} icon="🎫" />
        <KPICard title="Open Tickets" value={stats?.openTickets ?? 0} icon="📬" />
        <KPICard title="Resolved Today" value={stats?.resolvedToday ?? 0} icon="✅" />
        <KPICard title="Escalated" value={stats?.escalatedTickets ?? 0} icon="⚠️" />
      </div>

      {/* EXTRA KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="CSAT Score" value={`${stats?.avgCsat ?? 0} / 5`} icon="⭐" />
        <KPICard title="QA Pass Rate" value={`${stats?.qaPassRate ?? 0}%`} icon="🔍" />
        <KPICard title="SLA Breaches" value={stats?.slaBreaches ?? 0} icon="⏱️" />
      </div>

      {/* RECENT TICKETS */}
      <div className="bg-white rounded shadow p-4">

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-blue-600">
            Recent Tickets
          </h2>
        </div>

        {recentTickets.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No tickets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="border-b bg-gray-100">
                <tr>
                  {[
                    "ID",
                    "Title",
                    "Customer",
                    "Assigned By",
                    "Assigned To",
                    "Status",
                    "Priority",
                    "Created",
                  ].map((h) => (
                    <th key={h} className="text-left p-3 text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {recentTickets.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">

                    {/* ID */}
                    <td className="p-3 font-mono text-xs">
                      #{String(t.id).padStart(4, "0")}
                    </td>

                    {/* TITLE → OPEN MODAL */}
                    <td className="p-3 text-blue-600 cursor-pointer">
                      <span
                        onClick={() => {
                          setSelectedTicket(t);
                          setShowView(true);
                        }}
                      >
                        {t.title}
                      </span>
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-3 text-gray-600">
                      {t.customer_name ?? "—"}
                    </td>

                    {/* ASSIGNED BY (IMPORTANT FIX) */}
                    <td className="p-3 text-gray-600">
                      {t.assigned_by_name ?? "—"}
                    </td>

                    {/* ASSIGNED TO */}
                    <td className="p-3 text-gray-600">
                      {t.assigned_to_name ?? "Unassigned"}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <StatusBadge status={t.status} />
                    </td>

                    {/* PRIORITY */}
                    <td className="p-3">
                      <PriorityBadge priority={t.priority} />
                    </td>

                    {/* CREATED */}
                    <td className="p-3 text-xs text-gray-500">
                      {timeAgo(t.created_at)}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* =========================
          TICKET VIEW MODAL
      ========================= */}
      <TicketViewModal
        show={showView}
        ticket={selectedTicket}
        onHide={() => setShowView(false)}
      />
    </div>
  );
};