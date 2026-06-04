import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticket.service';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { channelConfig, timeAgo } from '../utils/helpers';
const PAGE_SIZE = 15;
export const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | ''>('');
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ticketService.getAll({
        ...(filterStatus   && { status: filterStatus }),
        ...(filterPriority && { priority: filterPriority }),
        page,
        limit: PAGE_SIZE,
      });
      setTickets(res.tickets);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, page]);
  useEffect(() => { load(); }, [load]);
  const filtered = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      String(t.id).includes(search)
  );
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tickets</h1>
          <p className="text-brand-muted text-sm mt-1">
            {total} total ticket{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/create">
          <Button>✚ New Ticket</Button>
        </Link>
      </div>
      {/* Filters */}
      <div className="card py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search tickets, customers, IDs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<span className="text-xs">🔍</span>}
          />
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as TicketStatus | '');
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {(['OPEN','IN_PROGRESS','ESCALATED','RESOLVED','CLOSED','REOPENED'] as TicketStatus[])
              .map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select
            className="input-field"
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value as TicketPriority | '');
              setPage(1);
            }}
          >
            <option value="">All Priorities</option>
            {(['P1_CRITICAL','P2_HIGH','P3_MEDIUM','P4_LOW'] as TicketPriority[])
              .map((p) => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-brand-muted text-sm">
            No tickets match your filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray border-b border-brand-border">
                  <tr>
                    {['ID', 'Title', 'Customer', 'Channel', 'Status', 'Priority', 'Agent', 'Created'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold
                                     text-brand-muted uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-brand-gray transition-colors group"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-brand-muted">
                        #{String(t.id).padStart(4, '0')}
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-primary max-w-xs">
                        <Link
                          to={`/tickets/${t.id}`}
                          className="hover:underline line-clamp-1"
                        >
                          {t.title}
                        </Link>
                        {t.slaBreached && (
                          <span className="ml-2 text-xs text-red-500 font-semibold">
                            ⚠ SLA
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-muted">
                        {t.customer?.fullName ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-brand-muted text-xs">
                        {channelConfig[t.channel]?.icon}{' '}
                        {channelConfig[t.channel]?.label}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="px-4 py-3 text-brand-muted text-xs">
                        {t.agent?.fullName ?? (
                          <span className="italic text-amber-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-muted text-xs whitespace-nowrap">
                        {timeAgo(t.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-brand-border">
                <p className="text-xs text-brand-muted">
                  Page {page} of {totalPages} · {total} tickets
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Prev
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
