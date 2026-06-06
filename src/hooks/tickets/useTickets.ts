import { useState, useEffect, useCallback, useMemo } from 'react';

import {
  getTickets,
  getMyTickets,
  getAssignedTickets,
  getUnassignedTickets,
  getClosedTickets,
  deleteTicket,
  resolveTicket,
  closeTicket,
  createTicket,
  updateTicket,
  getTicket as apiGetTicket,
} from '../../api/ticketApi';

import {
  Ticket,
  TicketStatus,
  TicketPriority,
  CreateTicketData,
  UpdateTicketData,
} from '../../types/tickets/tickets.types';

const PAGE_SIZE = 15;

type FilterType = 'all' | 'my' | 'assigned' | 'unassigned' | 'closed';

type UseTicketsOptions = {
  initialPage?: number;
  initialPageSize?: number;
  autoLoad?: boolean;
  initialFilter?: FilterType;
};

export const useTickets = (options: UseTicketsOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = PAGE_SIZE,
    autoLoad = true,
    initialFilter = 'all',
  } = options;

  // ======================
  // STATE
  // ======================
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | ''>('');
  const [currentFilter, setCurrentFilter] = useState<FilterType>(initialFilter);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ======================
  // LOAD TICKETS
  // ======================
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Choose which API endpoint to call based on currentFilter
      switch (currentFilter) {
        case 'my':
          response = await getMyTickets();
          break;
        case 'assigned':
          response = await getAssignedTickets();
          break;
        case 'unassigned':
          response = await getUnassignedTickets();
          break;
        case 'closed':
          response = await getClosedTickets();
          break;
        case 'all':
        default:
          response = await getTickets();
          break;
      }

      const raw = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      const mapped: Ticket[] = raw.map((item: any) => ({
        id: item.id,
        ticket_number: item.ticket_number,
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
        channel: item.channel,
        created_at: item.created_at,
        updated_at: item.updated_at,
        resolved_at: item.resolved_at,

        customer_name: item.customer_detail?.customer_name || item.customer_name || 'Unknown',
        customer_phone: item.customer_detail?.customer_phone || item.customer_phone || 'Not Provided',
        customer_email: item.customer_detail?.customer_email || item.customer_email || 'Not Provided',

        customer: item.customer_detail
          ? {
              id: item.customer_detail.id,
              customer_name: item.customer_detail.customer_name,
              customer_email: item.customer_detail.customer_email,
              customer_phone: item.customer_detail.customer_phone,
              alternate_phone: item.customer_detail.alternate_phone,
              company_name: item.customer_detail.company_name,
              address: item.customer_detail.address,
              city: item.customer_detail.city,
              country: item.customer_detail.country,
            }
          : undefined,

        assigned_to: item.assigned_to,
        assigned_to_name: item.assigned_to_name,
        team: item.team,
        team_name: item.team_name,

        attachments: item.attachments || [],
        history: item.timeline,
        updates: item.timeline,
      }));

      setTickets(mapped);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  // ======================
  // FILTERED DATA
  // ======================
  const filteredTickets = useMemo(() => {
    let data = [...tickets];

    // Only apply search, status, and priority filters when currentFilter is 'all'
    if (currentFilter === 'all') {
      if (search.trim()) {
        const q = search.toLowerCase();
        data = data.filter(
          t =>
            t.title?.toLowerCase().includes(q) ||
            t.customer_name?.toLowerCase().includes(q) ||
            t.ticket_number?.toLowerCase().includes(q) ||
            t.customer_email?.toLowerCase().includes(q) ||
            t.customer_phone?.toLowerCase().includes(q) ||
            String(t.id).includes(q)
        );
      }

      if (filterStatus) {
        data = data.filter(t => t.status === filterStatus);
      }

      if (filterPriority) {
        data = data.filter(t => t.priority === filterPriority);
      }
    }

    return data;
  }, [tickets, search, filterStatus, filterPriority, currentFilter]);

  // ======================
  // PAGINATION
  // ======================
  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, page, pageSize]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterPriority, currentFilter, pageSize]);

  // auto load
  useEffect(() => {
    if (autoLoad) loadTickets();
  }, [autoLoad, loadTickets]);

  // ======================
  // FILTER HELPERS
  // ======================
  const clearFilters = useCallback(() => {
    setSearch('');
    setFilterStatus('');
    setFilterPriority('');
    setCurrentFilter('all');
    setPage(1);
  }, []);

  const hasFilters = useMemo(
    () => !!(search || filterStatus || filterPriority || currentFilter !== 'all'),
    [search, filterStatus, filterPriority, currentFilter]
  );

  // ======================
  // ACTIONS
  // ======================
  const handleDelete = useCallback(async (id: number) => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteTicket(id);
      await loadTickets();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Delete failed');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [loadTickets]);

  const handleResolve = useCallback(async (id: number, comment?: string) => {
    setIsResolving(true);
    setError(null);

    try {
      await resolveTicket(id, comment);
      await loadTickets();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Resolve failed');
      return false;
    } finally {
      setIsResolving(false);
    }
  }, [loadTickets]);

  const handleClose = useCallback(async (id: number, comment?: string) => {
    setIsClosing(true);
    setError(null);

    try {
      await closeTicket(id, comment);
      await loadTickets();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Close failed');
      return false;
    } finally {
      setIsClosing(false);
    }
  }, [loadTickets]);

  const handleCreate = useCallback(async (data: CreateTicketData) => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await createTicket(data);
      await loadTickets();
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Create failed');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [loadTickets]);

  const handleUpdate = useCallback(async (id: number, data: UpdateTicketData) => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await updateTicket(id, data);
      await loadTickets();
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [loadTickets]);

  const getTicketById = useCallback(async (id: number) => {
    try {
      const res = await apiGetTicket(id);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadTickets();
  }, [loadTickets]);

  // ======================
  // RETURN
  // ======================
  return {
    tickets: paginatedTickets,
    allTickets: filteredTickets,

    loading,
    error,

    page,
    pageSize,
    totalPages,
    totalItems,

    setPage,
    setPageSize,

    search,
    filterStatus,
    filterPriority,
    currentFilter,

    setSearch,
    setFilterStatus,
    setFilterPriority,
    setCurrentFilter,

    clearFilters,
    hasFilters,

    loadTickets,
    refresh,

    handleDelete,
    handleResolve,
    handleClose,
    handleCreate,
    handleUpdate,

    getTicket: getTicketById,

    isDeleting,
    isResolving,
    isClosing,
    isCreating,
    isUpdating,
  };
};