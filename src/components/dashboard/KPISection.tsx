import React from "react";
import { KPICard } from "./KPICard";

interface KPISectionProps {
  stats: {
    totalTickets?: number;
    openTickets?: number;
    resolvedToday?: number;
    escalatedTickets?: number;
  } | null;
}

export const KPISection: React.FC<KPISectionProps> = ({ stats }) => {
  const cards = [
    { title: "Total Tickets", value: stats?.totalTickets ?? 0, icon: "🎫" },
    { title: "Open Tickets", value: stats?.openTickets ?? 0, icon: "📬" },
    { title: "Resolved", value: stats?.resolvedToday ?? 0, icon: "✅" },
    { title: "Escalated", value: stats?.escalatedTickets ?? 0, icon: "⚠️" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <KPICard key={idx} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </div>
  );
};