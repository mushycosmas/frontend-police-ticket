import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticket.service';
import { Ticket, TicketStatus } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatDate, channelConfig } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalate, setShowEscalate] = useState(false);
  useEffect(() => {
    if (!id) return;
    ticketService.getById(Number(id))
      .then(setTicket)
      .finally(() => setLoading(false));
  }, [id]);
  const updateStatus = async (status: TicketStatus) => {
    if (!ticket) return;
    setUpdating(true);
    try {
      const updated = await ticketService.update(ticket.id, { status });
      setTicket((t) => t ? { ...t, ...updated } : t);
    } finally {
      setUpdating(false);
    }
  };
  const handleEscalate = async () => {
    if (!ticket || !escalateReason.trim()) return;
    setUpdating(true);
    try {
      await ticketService.escalate(ticket.id, {
        reason: escalateReason,
        escalatedToId: ticket.teamLeadId ?? 2,
      });
      setTicket((t) => t ? { ...t, status: 'ESCALATED' } : t);
      setShowEscalate(false);
    } finally {
      setUpdating(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-muted text-lg">Ticket not found.</p>
        <Button className="mt-4" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </Button>
      </div>
    );
  }
  const ch = channelConfig[ticket.channel];
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/tickets')}
            className="text-brand-muted text-sm hover:text-brand-primary mb-2 flex items-center gap-1"
          >
            ← Back to Tickets
          </button>
          <h1 className="page-title">
            #{String(ticket.id).padStart(4, '0')} — {ticket.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-xs text-brand-muted">
              {ch?.icon} {ch?.label}
            </span>
            {ticket.slaBreached && (
              <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                ⚠ SLA Breached
              </span>
            )}
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
          {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                loading={updating}
                onClick={() => updateStatus('RESOLVED')}
              >
                ✅ Resolve
              </Button>
              {(user?.role === 'AGENT' || user?.role === 'TEAM_LEAD') && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setShowEscalate(true)}
                >
                  🔺 Escalate
                </Button>
              )}
            </>
          ) : ticket.status === 'RESOLVED' ? (
            <Button
              size="sm"
              loading={updating}
              onClick={() => updateStatus('CLOSED')}
            >
              🔒 Close Ticket
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="card">
            <h2 className="text-sm font-bold text-brand-primary mb-3 uppercase tracking-wider">
              Description
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
          {/* Escalation Reason Input */}
          {showEscalate && (
            <div className="card border-red-200 bg-red-50">
              <h2 className="text-sm font-bold text-red-700 mb-3">
                Escalate Ticket
              </h2>
              <textarea
                className="input-field min-h-[80px] resize-none mb-3"
                placeholder="Reason for escalation..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  loading={updating}
                  onClick={handleEscalate}
                >
                  Confirm Escalation
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowEscalate(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {/* Audit Log */}
          <div className="card">
            <h2 className="text-sm font-bold text-brand-primary mb-4 uppercase tracking-wider">
              Activity Log
            </h2>
            {ticket.auditLogs && ticket.auditLogs.length > 0 ? (
              <div className="space-y-3">
                {ticket.auditLogs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">
                        {log.actor?.fullName?.charAt(0) ?? '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-brand-primary">
                        <span className="font-semibold">{log.actor?.fullName}</span>
                        {' '}{log.action.replace(/_/g, ' ').toLowerCase()}
                      </p>
                      {log.details && (
                        <p className="text-xs text-brand-muted mt-0.5">{log.details}</p>
                      )}
                      <p className="text-xs text-brand-muted mt-0.5">
                        {formatDate(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-muted">No activity recorded yet.</p>
            )}
          </div>
          {/* QA Review */}
          {ticket.qaReview && (
            <div className="card">
              <h2 className="text-sm font-bold text-brand-primary mb-3 uppercase tracking-wider">
                QA Review
              </h2>
              <div className="flex items-center gap-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    ticket.qaReview.result === 'PASS'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {ticket.qaReview.result === 'PASS' ? '✅ PASS' : '❌ FAIL'}
                </div>
                <div className="text-brand-primary font-bold text-xl">
                  {ticket.qaReview.score} / 5.0
                </div>
              </div>
              {ticket.qaReview.comments && (
                <p className="text-sm text-brand-muted mt-3 leading-relaxed">
                  {ticket.qaReview.comments}
                </p>
              )}
              <p className="text-xs text-brand-muted mt-2">
                Reviewed by{' '}
                <span className="font-medium">
                  {ticket.qaReview.reviewer?.fullName}
                </span>{' '}
                · {formatDate(ticket.qaReview.reviewedAt)}
              </p>
            </div>
          )}
          {/* CSAT Feedback */}
          {ticket.csatFeedback && (
            <div className="card">
              <h2 className="text-sm font-bold text-brand-primary mb-3 uppercase tracking-wider">
                CSAT Feedback
              </h2>
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < ticket.csatFeedback!.rating
                        ? 'text-amber-400'
                        : 'text-gray-200'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-brand-primary font-bold ml-1">
                  {ticket.csatFeedback.rating} / 5
                </span>
              </div>
              {ticket.csatFeedback.comment && (
                <p className="text-sm text-brand-muted italic">
                  "{ticket.csatFeedback.comment}"
                </p>
              )}
            </div>
          )}
        </div>
        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card">
            <h3 className="label">Customer</h3>
            <p className="font-semibold text-brand-primary text-sm">
              {ticket.customer?.fullName}
            </p>
            <p className="text-xs text-brand-muted mt-1">
              {ticket.customer?.email}
            </p>
            {ticket.customer?.phone && (
              <p className="text-xs text-brand-muted">
                {ticket.customer.phone}
              </p>
            )}
          </div>
          {/* Assignment */}
          <div className="card space-y-3">
            <h3 className="label">Assignment</h3>
            <div>
              <p className="text-xs text-brand-muted mb-0.5">Agent</p>
              <p className="text-sm font-semibold text-brand-primary">
                {ticket.agent?.fullName ?? (
                  <span className="text-amber-500 font-normal italic">
                    Unassigned
                  </span>
                )}
              </p>
            </div>
            {ticket.teamLead && (
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Team Lead</p>
                <p className="text-sm font-semibold text-brand-primary">
                  {ticket.teamLead.fullName}
                </p>
              </div>
            )}
          </div>
          {/* Dates */}
          <div className="card space-y-3">
            <h3 className="label">Timeline</h3>
            <div>
              <p className="text-xs text-brand-muted">Created</p>
              <p className="text-xs font-medium text-brand-primary">
                {formatDate(ticket.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-brand-muted">Last Updated</p>
              <p className="text-xs font-medium text-brand-primary">
                {formatDate(ticket.updatedAt)}
              </p>
            </div>
            {ticket.closedAt && (
              <div>
                <p className="text-xs text-brand-muted">Closed</p>
                <p className="text-xs font-medium text-brand-primary">
                  {formatDate(ticket.closedAt)}
                </p>
              </div>
            )}
          </div>
          {/* Escalations */}
          {ticket.escalations && ticket.escalations.length > 0 && (
            <div className="card">
              <h3 className="label">Escalations</h3>
              <div className="space-y-2">
                {ticket.escalations.map((esc) => (
                  <div
                    key={esc.id}
                    className="text-xs bg-red-50 border border-red-100 rounded-lg p-2"
                  >
                    <p className="font-medium text-red-700">
                      {esc.escalatedBy?.fullName} → {esc.escalatedTo?.fullName}
                    </p>
                    <p className="text-red-500 mt-0.5 italic">{esc.reason}</p>
                    <p className="text-brand-muted mt-0.5">
                      {formatDate(esc.escalatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
