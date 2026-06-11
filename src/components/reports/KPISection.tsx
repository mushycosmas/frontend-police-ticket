import React from "react";
import { DashboardStats } from "../../types";
import { KPICard } from "../dashboard/KPICard";

interface Props {
  stats: DashboardStats;
}

export const KPISection: React.FC<Props> = ({ stats }) => {
  const kpis = [
    {
      title: "Total Tickets",
      value: stats.totalTickets,
      icon: "🎫",
      target: "—",
      color: "default" as const,
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      icon: "📬",
      target: "—",
      color:
        stats.openTickets > 10
          ? ("warning" as const)
          : ("default" as const),
    },
    {
      title: "Resolved Today",
      value: stats.resolvedToday,
      icon: "✅",
      target: "—",
      color: "success" as const,
    },
    {
      title: "Escalated",
      value: stats.escalatedTickets,
      icon: "🔺",
      target: "< 5%",
      color:
        stats.escalatedTickets > 5
          ? ("danger" as const)
          : ("success" as const),
    },
    {
      title: "Avg CSAT Score",
      value: `${stats.avgCsat}/5`,
      icon: "⭐",
      target: "≥ 4.5/5",
      color:
        parseFloat(stats.avgCsat) >= 4.5
          ? ("success" as const)
          : ("warning" as const),
    },
    {
      title: "QA Pass Rate",
      value: stats.qaPassRate,
      icon: "🔍",
      target: "> 80%",
      color:
        parseInt(stats.qaPassRate) >= 80
          ? ("success" as const)
          : ("warning" as const),
    },
    {
      title: "SLA Breaches",
      value: stats.slaBreaches,
      icon: "⏱️",
      target: "0",
      color:
        stats.slaBreaches === 0
          ? ("success" as const)
          : ("danger" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};