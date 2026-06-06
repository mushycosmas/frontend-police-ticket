import React, { useEffect, useState, useCallback } from "react";
import { getTickets } from "../api/ticketApi";
import { DashboardStats, Ticket } from "../types";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { KPISection } from "../components/dashboard/KPISection";
import { RecentTickets } from "../components/dashboard/RecentTickets";
import { StatsSection } from "../components/dashboard/StatsSection";
import TicketViewModal from "../components/tickets/TicketViewModal";

// Helper to normalize priority from API to expected format
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
  const [loading, setLoading] = useState(true);
  const [showView, setShowView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const calculateStats = useCallback((tickets: any[]) => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === "OPEN").length;
    const resolvedToday = tickets.filter(t => t.status === "RESOLVED").length;
    const escalatedTickets = tickets.filter(t => t.status === "ESCALATED").length;

    // Calculate priority stats from API response (handles "MEDIUM" format)
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
      
      setRecentTickets(tickets.slice(0, 5));
      calculateStats(tickets);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleViewTicket = useCallback((ticket: any) => {
    setSelectedTicket(ticket);
    setShowView(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowView(false);
    setSelectedTicket(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader username={user?.username || user?.full_name || "User"} />
      <KPISection stats={stats} />
      <RecentTickets tickets={recentTickets} onViewTicket={handleViewTicket} />
      <StatsSection stats={stats} priorityStats={priorityStats} />
      
      <TicketViewModal
        show={showView}
        ticket={selectedTicket}
        onHide={handleCloseModal}
        onRefresh={loadDashboard}
      />
    </div>
  );
};

export default Dashboard;