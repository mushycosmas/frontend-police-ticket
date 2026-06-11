import { useEffect, useState } from "react";
import { getTickets } from "../api/ticketApi";
import { DashboardStats } from "../types";

export const useReportStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    try {
      const res = await getTickets();
      const tickets = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      const totalTickets = tickets.length;

      const openTickets = tickets.filter(
        (t: any) => t.status === "OPEN"
      ).length;

      const resolvedToday = tickets.filter((t: any) => {
        if (!t.resolved_at) return false;

        const resolvedDate = new Date(t.resolved_at);
        const today = new Date();

        return (
          resolvedDate.toDateString() === today.toDateString()
        );
      }).length;

      const escalatedTickets = tickets.filter(
        (t: any) => t.status === "ESCALATED"
      ).length;

      const slaBreaches = tickets.filter((t: any) => {
        if (t.status !== "OPEN") return false;

        const createdDate = new Date(t.created_at);
        const hoursSinceCreated =
          (Date.now() - createdDate.getTime()) /
          (1000 * 60 * 60);

        return hoursSinceCreated > 48;
      }).length;

      setStats({
        totalTickets,
        openTickets,
        resolvedToday,
        escalatedTickets,
        avgCsat: "4.5",
        qaPassRate: "85%",
        slaBreaches,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading };
};