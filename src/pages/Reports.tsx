import React, { useEffect, useState } from 'react';
import { getTickets } from '../api/ticketApi';
import { DashboardStats } from '../types';
import { KPICard } from '../components/dashboard/KPICard';

export const Reports: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getTickets();
      const tickets = Array.isArray(res.data) ? res.data : res.data?.results || [];
      
      // Calculate stats from real data
      const totalTickets = tickets.length;
      const openTickets = tickets.filter((t: any) => t.status === "OPEN").length;
      const resolvedToday = tickets.filter((t: any) => {
        if (!t.resolved_at) return false;
        const resolvedDate = new Date(t.resolved_at);
        const today = new Date();
        return resolvedDate.toDateString() === today.toDateString();
      }).length;
      const escalatedTickets = tickets.filter((t: any) => t.status === "ESCALATED").length;
      
      // Calculate SLA breaches (tickets open for more than 48 hours)
      const slaBreaches = tickets.filter((t: any) => {
        if (t.status !== "OPEN") return false;
        const createdDate = new Date(t.created_at);
        const hoursSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60);
        return hoursSinceCreated > 48;
      }).length;
      
      // Mock CSAT and QA data (can be replaced with real data later)
      const avgCsat = "4.5";
      const qaPassRate = "85%";
      
      setStats({
        totalTickets,
        openTickets,
        resolvedToday,
        escalatedTickets,
        avgCsat,
        qaPassRate,
        slaBreaches,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = stats
    ? [
        { title: 'Total Tickets',    value: stats.totalTickets,    icon: '🎫', target: '—',       color: 'default' as const },
        { title: 'Open Tickets',     value: stats.openTickets,     icon: '📬', target: '—',       color: stats.openTickets > 10 ? 'warning' as const : 'default' as const },
        { title: 'Resolved Today',   value: stats.resolvedToday,   icon: '✅', target: '—',       color: 'success' as const },
        { title: 'Escalated',        value: stats.escalatedTickets, icon: '🔺', target: '< 5%',   color: stats.escalatedTickets > 5 ? 'danger' as const : 'success' as const },
        { title: 'Avg CSAT Score',   value: `${stats.avgCsat}/5`,  icon: '⭐', target: '≥ 4.5/5', color: parseFloat(stats.avgCsat) >= 4.5 ? 'success' as const : 'warning' as const },
        { title: 'QA Pass Rate',     value: stats.qaPassRate,      icon: '🔍', target: '> 80%',   color: parseInt(stats.qaPassRate) >= 80 ? 'success' as const : 'warning' as const },
        { title: 'SLA Breaches',     value: stats.slaBreaches,     icon: '⏱️', target: '0',       color: stats.slaBreaches === 0 ? 'success' as const : 'danger' as const },
      ]
    : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Live performance metrics across all support operations.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <KPICard key={k.title} {...k} />
            ))}
          </div>

          {/* SLA Policy Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
              SLA Policy Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Priority', 'First Response', 'Resolution', 'Assigned To'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { p: 'P1 — Critical', fr: '< 15 mins',  res: '< 1 hour',   to: 'Senior Agent' },
                    { p: 'P2 — High',     fr: '< 30 mins',  res: '< 4 hours',  to: 'Senior Agent' },
                    { p: 'P3 — Medium',   fr: '< 1 hour',   res: '< 8 hours',  to: 'Any Agent' },
                    { p: 'P4 — Low',      fr: '< 4 hours',  res: '< 24 hours', to: 'Any Agent' },
                  ].map((row) => (
                    <tr key={row.p} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-blue-600">{row.p}</td>
                      <td className="px-4 py-3 text-gray-600">{row.fr}</td>
                      <td className="px-4 py-3 text-gray-600">{row.res}</td>
                      <td className="px-4 py-3 text-gray-600">{row.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KPI Targets Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
              KPI Targets vs Actuals
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['KPI', 'Target', 'Current', 'Status'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { kpi: 'CSAT Score',    target: '≥ 4.5/5', current: `${stats?.avgCsat}/5`,  pass: parseFloat(String(stats?.avgCsat ?? 0)) >= 4.5 },
                    { kpi: 'QA Pass Rate',  target: '> 80%',   current: stats?.qaPassRate ?? '0%', pass: parseInt(String(stats?.qaPassRate ?? '0')) >= 80 },
                    { kpi: 'SLA Breaches',  target: '0',       current: String(stats?.slaBreaches ?? 0), pass: stats?.slaBreaches === 0 },
                    { kpi: 'Escalations',   target: '< 5%',    current: `${stats?.escalatedTickets ?? 0} (${((stats?.escalatedTickets ?? 0) / (stats?.totalTickets ?? 1) * 100).toFixed(1)}%)`, pass: ((stats?.escalatedTickets ?? 0) / (stats?.totalTickets ?? 1) * 100) < 5 },
                    { kpi: 'Resolution Rate', target: '> 80%', current: `${(((stats?.resolvedToday ?? 0) / (stats?.totalTickets ?? 1)) * 100).toFixed(1)}%`, pass: ((stats?.resolvedToday ?? 0) / (stats?.totalTickets ?? 1) * 100) >= 80 },
                  ].map((row) => (
                    <tr key={row.kpi} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-blue-600">{row.kpi}</td>
                      <td className="px-4 py-3 text-gray-600">{row.target}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row.current}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          row.pass
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {row.pass ? '✅ On Target' : '⚠ Below Target'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          </div>

          {/* Additional Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resolution Rate Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Resolution Rate</h3>
              <p className="text-3xl font-bold">
                {stats?.totalTickets ? ((stats.resolvedToday / stats.totalTickets) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm opacity-90 mt-2">
                {stats?.resolvedToday} resolved out of {stats?.totalTickets} total tickets
              </p>
            </div>

            {/* Escalation Rate Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Escalation Rate</h3>
              <p className="text-3xl font-bold">
                {stats?.totalTickets ? ((stats.escalatedTickets / stats.totalTickets) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm opacity-90 mt-2">
                {stats?.escalatedTickets} escalated out of {stats?.totalTickets} total tickets
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;