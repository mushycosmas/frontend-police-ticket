import React, { useEffect, useState } from 'react';
import { ticketService } from '../services/ticket.service';
import { DashboardStats } from '../types';
import { KPICard } from '../components/dashboard/KPICard';
export const Reports: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    ticketService.getStats().then(setStats).finally(() => setLoading(false));
  }, []);
  const kpis = stats
    ? [
        { title: 'Total Tickets',    value: stats.totalTickets,    icon: '🎫', target: '—',       color: 'default'  as const },
        { title: 'Open Tickets',     value: stats.openTickets,     icon: '📬', target: '—',       color: 'warning'  as const },
        { title: 'Resolved Today',   value: stats.resolvedToday,   icon: '✅', target: '—',       color: 'success'  as const },
        { title: 'Escalated',        value: stats.escalatedTickets,icon: '🔺', target: '< 25%',   color: 'danger'   as const },
        { title: 'Avg CSAT Score',   value: `${stats.avgCsat}/5`,  icon: '⭐', target: '≥ 4.5/5', color: 'success'  as const },
        { title: 'QA Pass Rate',     value: stats.qaPassRate,      icon: '🔍', target: '> 80%',   color: 'success'  as const },
        { title: 'SLA Breaches',     value: stats.slaBreaches,     icon: '⏱️', target: '0',       color: stats.slaBreaches === 0 ? 'success' as const : 'danger' as const },
      ]
    : [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="text-brand-muted text-sm mt-1">
          Live performance metrics across all support operations.
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <KPICard key={k.title} {...k} />
            ))}
          </div>
          {/* SLA Policy Table */}
          <div className="card">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">
              SLA Policy Reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray">
                  <tr>
                    {['Priority', 'First Response', 'Resolution', 'Assigned To'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold
                                   text-brand-muted uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {[
                    { p: 'P1 — Critical', fr: '< 15 mins',  res: '< 1 hour',   to: 'Senior Agent'  },
                    { p: 'P2 — High',     fr: '< 30 mins',  res: '< 4 hours',  to: 'Senior Agent'  },
                    { p: 'P3 — Medium',   fr: '< 1 hour',   res: '< 8 hours',  to: 'Any Agent'     },
                    { p: 'P4 — Low',      fr: '< 4 hours',  res: '< 24 hours', to: 'Any Agent'     },
                  ].map((row) => (
                    <tr key={row.p} className="hover:bg-brand-gray">
                      <td className="px-4 py-3 font-medium text-brand-primary">{row.p}</td>
                      <td className="px-4 py-3 text-brand-muted">{row.fr}</td>
                      <td className="px-4 py-3 text-brand-muted">{row.res}</td>
                      <td className="px-4 py-3 text-brand-muted">{row.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* KPI Targets Table */}
          <div className="card">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">
              KPI Targets vs Actuals
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray">
                  <tr>
                    {['KPI', 'Target', 'Current', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold
                                   text-brand-muted uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {[
                    { kpi: 'CSAT Score',    target: '≥ 4.5/5', current: `${stats?.avgCsat}/5`,  pass: parseFloat(String(stats?.avgCsat ?? 0)) >= 4.5 },
                    { kpi: 'QA Pass Rate',  target: '> 80%',   current: stats?.qaPassRate ?? '0%', pass: parseFloat(String(stats?.qaPassRate ?? '0')) >= 80 },
                    { kpi: 'SLA Breaches',  target: '0',       current: String(stats?.slaBreaches ?? 0), pass: stats?.slaBreaches === 0 },
                    { kpi: 'Escalations',   target: '< 25%',   current: '—',                      pass: true },
                  ].map((row) => (
                    <tr key={row.kpi} className="hover:bg-brand-gray">
                      <td className="px-4 py-3 font-medium text-brand-primary">{row.kpi}</td>
                      <td className="px-4 py-3 text-brand-muted">{row.target}</td>
                      <td className="px-4 py-3 font-semibold text-brand-primary">{row.current}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            row.pass
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {row.pass ? '✅ On Target' : '⚠ Below Target'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
