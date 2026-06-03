import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticket.service';
import { TicketPriority, TicketChannel } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customerName:  '',
    customerEmail: '',
    customerPhone: '',
    title:         '',
    description:   '',
    priority:      'P3_MEDIUM' as TicketPriority,
    channel:       'WEB_FORM' as TicketChannel,
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // In production: first create/find customer, then create ticket
      const ticket = await ticketService.create({
        customerId:  1, // replace with real customer lookup
        title:       form.title,
        description: form.description,
        priority:    form.priority,
        channel:     form.channel,
      });
      navigate(`/tickets/${ticket.id}`);
    } catch {
      setError('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">New Ticket</h1>
        <p className="text-brand-muted text-sm mt-1">
          Fill in the details below to open a support ticket.
        </p>
      </div>
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Information */}
        <div className="card space-y-4">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Customer full name"
              value={form.customerName}
              onChange={(e) => set('customerName', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="customer@email.com"
              value={form.customerEmail}
              onChange={(e) => set('customerEmail', e.target.value)}
              required
            />
          </div>
          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+255 700 000 000"
            value={form.customerPhone}
            onChange={(e) => set('customerPhone', e.target.value)}
          />
        </div>
        {/* Ticket Details */}
        <div className="card space-y-4">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
            Ticket Details
          </h2>
          <Input
            label="Issue Title"
            placeholder="Brief description of the issue"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
          />
          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field min-h-[120px] resize-y"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select
                className="input-field"
                value={form.priority}
                onChange={(e) => set('priority', e.target.value as TicketPriority)}
              >
                <option value="P1_CRITICAL">P1 — Critical</option>
                <option value="P2_HIGH">P2 — High</option>
                <option value="P3_MEDIUM">P3 — Medium</option>
                <option value="P4_LOW">P4 — Low</option>
              </select>
            </div>
            <div>
              <label className="label">Channel</label>
              <select
                className="input-field"
                value={form.channel}
                onChange={(e) => set('channel', e.target.value as TicketChannel)}
              >
                <option value="PHONE">📞 Phone</option>
                <option value="WALK_IN">🚶 Walk-in</option>
                <option value="EMAIL">📧 Email</option>
                <option value="CHAT">💬 Chat</option>
                <option value="WEB_FORM">🌐 Web Form</option>
              </select>
            </div>
          </div>
        </div>
        {/* Priority Guide */}
        <div className="card bg-brand-gray border-brand-border py-4">
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">
            Priority Guide
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-brand-muted">
            <div><span className="font-semibold text-red-600">P1 Critical</span> — System down, major outage</div>
            <div><span className="font-semibold text-orange-600">P2 High</span> — Key feature broken</div>
            <div><span className="font-semibold text-yellow-600">P3 Medium</span> — Partial impact</div>
            <div><span className="font-semibold text-green-600">P4 Low</span> — Minor, cosmetic issue</div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Creating…' : '✚ Create Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
};
