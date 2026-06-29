import { useState, useEffect, useCallback } from 'react';
import { getTickets } from '../api/ticketApi';
import { DashboardStats } from '../types';
import { mapStatus, normalizePriority, getTicketCounts } from '../utils/ticketHelpers';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [priorityStats, setPriorityStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateStats = useCallback((tickets: any[]) => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => 
      t.status === "OPEN" || t.status === "ASSIGNED" || t.status === "IN_PROGRESS" || t.status === "REOPENED"
    ).length;
    const resolvedToday = tickets.filter(t => 
      t.status === "RESOLVED" || t.status === "CLOSED"
    ).length;
    const escalatedTickets = tickets.filter(t => t.status === "ESCALATED").length;

    let critical = 0, high = 0, medium = 0, low = 0;
    tickets.forEach(ticket => {
      const priority = ticket.priority?.toUpperCase() || '';
      if (priority === 'CRITICAL' || priority === 'P1_CRITICAL') critical++;
      else if (priority === 'HIGH' || priority === 'P2_HIGH') high++;
      else if (priority === 'MEDIUM' || priority === 'P3_MEDIUM') medium++;
      else if (priority === 'LOW' || priority === 'P4_LOW') low++;
    });

    setPriorityStats({ critical, high, medium, low });

    setStats({
      totalTickets,
      openTickets,
      resolvedToday,
      escalatedTickets,
      avgCsat: "4.5",
      slaBreaches: 0,
      qaPassRate: "85%",
    });
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
      setFilteredTickets(mappedTickets);
      calculateStats(mappedTickets);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    stats,
    priorityStats,
    allTickets,
    filteredTickets,
    setFilteredTickets,
    loading,
    loadDashboard,
    ticketCounts: getTicketCounts(allTickets)
  };
};