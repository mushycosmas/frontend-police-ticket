import React from "react";
import { useReportStats } from "../hooks/useReportStats";
import { ReportsHeader } from "../components/reports/ReportsHeader";
import { ReportsLoading } from "../components/reports/ReportsLoading";
import { KPISection } from "../components/reports/KPISection";
import { SLAPolicyTable } from "../components/reports/SLAPolicyTable";
import { KPITargetsTable } from "../components/reports/KPITargetsTable";
import { StatisticsCards } from "../components/reports/StatisticsCards";

export const Reports = () => {
  const { stats, loading } = useReportStats();

  return (
    <div className="space-y-6 p-6">
      <ReportsHeader />

      {loading ? (
        <ReportsLoading />
      ) : (
        stats && (
          <>
            <KPISection stats={stats} />
            <SLAPolicyTable />
            <KPITargetsTable stats={stats} />
            <StatisticsCards stats={stats} />
          </>
        )
      )}
    </div>
  );
};

export default Reports;