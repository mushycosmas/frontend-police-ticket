import React from "react";
import { DashboardStats } from "../../types";

interface Props {
  stats: DashboardStats;
}

export const KPITargetsTable: React.FC<Props> = ({
  stats,
}) => {
  const rows = [
    {
      kpi: "CSAT Score",
      target: "≥ 4.5/5",
      current: `${stats.avgCsat}/5`,
      pass: parseFloat(stats.avgCsat) >= 4.5,
    },
    {
      kpi: "QA Pass Rate",
      target: "> 80%",
      current: stats.qaPassRate,
      pass: parseInt(stats.qaPassRate) >= 80,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
        KPI Targets vs Actuals
      </h2>

      {/* table content */}
    </div>
  );
};