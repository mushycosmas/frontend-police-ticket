import React from "react";
import { DashboardStats } from "../../types";

interface Props {
  stats: DashboardStats;
}

export const StatisticsCards: React.FC<Props> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">
          Resolution Rate
        </h3>

        <p className="text-3xl font-bold">
          {stats.totalTickets
            ? (
                (stats.resolvedToday /
                  stats.totalTickets) *
                100
              ).toFixed(1)
            : 0}
          %
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">
          Escalation Rate
        </h3>

        <p className="text-3xl font-bold">
          {stats.totalTickets
            ? (
                (stats.escalatedTickets /
                  stats.totalTickets) *
                100
              ).toFixed(1)
            : 0}
          %
        </p>
      </div>
    </div>
  );
};