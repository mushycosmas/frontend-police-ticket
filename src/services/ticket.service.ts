import api from './api';
import { Ticket, TicketStatus, TicketPriority, TicketChannel } from '../types';
export const ticketService = {
  getAll: async (params?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get('/tickets', { params });
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get(`/tickets/${id}`);
    return res.data as Ticket;
  },
  create: async (data: {
    customerId: number;
    title: string;
    description: string;
    priority: TicketPriority;
    channel: TicketChannel;
  }) => {
    const res = await api.post('/tickets', data);
    return res.data as Ticket;
  },
  createPublic: async (formData: FormData) => {
    const res = await api.post('/tickets/public', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  update: async (
    id: number,
    data: Partial<{
      status: TicketStatus;
      priority: TicketPriority;
      agentId: number;
      teamLeadId: number;
    }>
  ) => {
    const res = await api.put(`/tickets/${id}`, data);
    return res.data as Ticket;
  },
  escalate: async (
    id: number,
    data: { reason: string; escalatedToId: number }
  ) => {
    const res = await api.post(`/tickets/${id}/escalate`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/tickets/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};
