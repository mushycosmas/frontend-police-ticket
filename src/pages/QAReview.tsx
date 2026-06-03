import React, { useEffect, useState } from 'react';
import { ticketService } from '../services/ticket.service';
import { Ticket } from '../types';
import { Button } from '../components/common/Button';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { timeAgo } from '../utils/helpers';
import api from '../services/api';
export const QAReview: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ score: '', comments: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  useEffect(() => {
    ticketService
      .getAll({ status: 'CLOSED', limit: 50 })
      .then((res) => setTickets(res.tickets))
      .finally(() => setLoading(false));
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post('/qa/review', {
        ticketId: selected.id,
        score: parseFloat(form.score),
        comments: form.comments,
        result: parseFloat(form.score) >= 4.0 ? 'PASS' : 'FAIL',
      });
      setSuccess(`QA review submitted for Ticket #${selected.id}`);
      setSelected(null);
      setForm({ score: '', comments: '' });
      setTickets((prev) => prev.filter((t) => t.id !== selected.id));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">QA Review</h1>
        <p className="text-brand-muted text-sm mt-1">
          Sampling 10% of resolved tickets for quality assessment.
        </p>
      </div>
      {success && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">✅ {success}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ticket List */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-brand-border bg-brand-gray">
            <h2 className="text-sm font-bold text-brand-primary">
              Closed Tickets — Pending Review
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-7 h-7 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-brand-muted text-sm">
              No tickets pending QA review.
            </div>
          ) : (
            <div className="divide-y divide-brand-border max-h-[480px] overflow-y-auto">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { setSelected(t); setSuccess(''); }}
                  className={`px-5 py-4 cursor-pointer transition-colors ${
                    selected?.id === t.id
                      ? 'bg-brand-primary bg-opacity-5 border-l-4 border-l-brand-primary'
                      : 'hover:bg-brand-gray'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-brand-muted">
                      #{String(t.id).padStart(4, '0')}
                    </span>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <p className="text-sm font-medium text-brand-primary line-clamp-1">
                    {t.title}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-brand-muted">
                      {t.agent?.fullName ?? 'Unassigned'}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {timeAgo(t.updatedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Review Form */}
        <div className="card">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-48 text-brand-muted">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm">Select a ticket to begin review</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">
                  Reviewing Ticket
                </h2>
                <p className="text-base font-semibold text-brand-primary">
                  #{String(selected.id).padStart(4, '0')} — {selected.title}
                </p>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority} />
                </div>
              </div>
              <div>
                <label className="label">QA Score (0.0 — 5.0)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="input-field"
                  placeholder="e.g. 4.5"
                  value={form.score}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, score: e.target.value }))
                  }
                  required
                />
                {form.score && (
                  <div
                    className={`mt-1.5 text-xs font-semibold ${
                      parseFloat(form.score) >= 4.0
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {parseFloat(form.score) >= 4.0
                      ? '✅ PASS — Score meets the ≥ 4.0 threshold'
                      : '❌ FAIL — Score is below the 4.0 threshold'}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Comments / Feedback</label>
                <textarea
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Provide coaching notes or feedback for the agent..."
                  value={form.comments}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comments: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={submitting} className="flex-1">
                  Submit Review
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
