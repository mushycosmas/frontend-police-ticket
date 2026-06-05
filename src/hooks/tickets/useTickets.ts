import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getTickets, 
  deleteTicket, 
  resolveTicket, 
  closeTicket,
  createTicket,
  updateTicket,
  getTicket,
} from '../../api/ticketApi';
import { 
  Ticket, 
  TicketStatus, 
  TicketPriority, 
  CreateTicketData, 
  UpdateTicketData 
} from '../../types/tickets/tickets.types';

const PAGE_SIZE = 15;

interface UseTicketsOptions {
  initialPage?: number;
  initialPageSize?: number;
  autoLoad?: boolean;
}

interface UseTicketsReturn {
  tickets: Ticket[];
  allTickets: Ticket[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  search: string;
  filterStatus: TicketStatus | '';
  filterPriority: TicketPriority | '';
  setSearch: (search: string) => void;
  setFilterStatus: (status: TicketStatus | '') => void;
  setFilterPriority: (priority: TicketPriority | '') => void;
  clearFilters: () => void;
  hasFilters: boolean;
  loadTickets: () => Promise<void>;
  refresh: () => Promise<void>;
  handleDelete: (id: number) => Promise<boolean>;
  handleResolve: (id: number) => Promise<boolean>;
  handleClose: (id: number) => Promise<boolean>;
  handleCreate: (data: CreateTicketData) => Promise<Ticket | null>;
  handleUpdate: (id: number, data: UpdateTicketData) => Promise<Ticket | null>;
  getTicket: (id: number) => Promise<Ticket | null>;
  isDeleting: boolean;
  isResolving: boolean;
  isClosing: boolean;
  isCreating: boolean;
  isUpdating: boolean;
}

export const useTickets = (options: UseTicketsOptions = {}): UseTicketsReturn => {
  const {
    initialPage = 1,
    initialPageSize = PAGE_SIZE,
    autoLoad = true,
  } = options;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [search, setSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | ''>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Load tickets from API
  const loadTickets = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTickets();
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data?.results || [];
      
      // Map the API response to Ticket type
      const mappedData: Ticket[] = data.map((item: any) => ({
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
        // Customer information from customer_detail
        customer_name: item.customer_detail?.customer_name || 'Unknown',
        customer_phone: item.customer_detail?.customer_phone || 'Not Provided',
        customer_email: item.customer_detail?.customer_email || 'Not Provided',
        // Customer object
        customer: item.customer_detail ? {
          id: item.customer_detail.id,
          customer_name: item.customer_detail.customer_name,
          customer_email: item.customer_detail.customer_email,
          customer_phone: item.customer_detail.customer_phone,
          alternate_phone: item.customer_detail.alternate_phone,
          company_name: item.customer_detail.company_name,
          address: item.customer_detail.address,
          city: item.customer_detail.city,
          country: item.customer_detail.country,
        } : undefined,
        // Assignment information
        assigned_to: item.assigned_to,
        assigned_to_name: item.assigned_to_name,
        assigned_by: item.assigned_by,
        // Team information
        team: item.team,
        team_name: item.team_name,
        // Location information
        street: item.street,
        street_name: item.street_name,
        location_full: item.location_full,
        // Attachments
        attachments: item.attachments || [],
        // History/Timeline
        history: item.timeline,
        updates: item.timeline,
      }));
      
      setTickets(mappedData);
    } catch (err: any) {
      console.error('Failed to load tickets:', err);
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and search tickets
  const filteredTickets = useMemo((): Ticket[] => {
    let data = [...tickets];

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter(
        (ticket) =>
          ticket.title?.toLowerCase().includes(query) ||
          ticket.customer_name?.toLowerCase().includes(query) ||
          ticket.ticket_number?.toLowerCase().includes(query) ||
          String(ticket.id).includes(query)
      );
    }

    if (filterStatus) {
      data = data.filter((ticket) => ticket.status === filterStatus);
    }

    if (filterPriority) {
      data = data.filter((ticket) => ticket.priority === filterPriority);
    }

    return data;
  }, [tickets, search, filterStatus, filterPriority]);

  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const paginatedTickets = useMemo((): Ticket[] => {
    const start = (page - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, page, pageSize]);

  useEffect((): void => {
    setPage(1);
  }, [search, filterStatus, filterPriority, pageSize]);

  useEffect((): void => {
    if (autoLoad) {
      loadTickets();
    }
  }, [autoLoad, loadTickets]);

  const clearFilters = useCallback((): void => {
    setSearch('');
    setFilterStatus('');
    setFilterPriority('');
    setPage(1);
  }, []);

  const hasFilters = !!(search || filterStatus || filterPriority);

  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTicket(id);
      await loadTickets();
      return true;
    } catch (err: any) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Failed to delete ticket');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [loadTickets]);

  const handleResolve = useCallback(async (id: number): Promise<boolean> => {
    setIsResolving(true);
    setError(null);
    try {
      await resolveTicket(id);
      await loadTickets();
      return true;
    } catch (err: any) {
      console.error('Resolve failed:', err);
      setError(err.response?.data?.message || 'Failed to resolve ticket');
      return false;
    } finally {
      setIsResolving(false);
    }
  }, [loadTickets]);

  const handleClose = useCallback(async (id: number): Promise<boolean> => {
    setIsClosing(true);
    setError(null);
    try {
      await closeTicket(id);
      await loadTickets();
      return true;
    } catch (err: any) {
      console.error('Close failed:', err);
      setError(err.response?.data?.message || 'Failed to close ticket');
      return false;
    } finally {
      setIsClosing(false);
    }
  }, [loadTickets]);

  const handleCreate = useCallback(async (data: CreateTicketData): Promise<Ticket | null> => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await createTicket(data);
      await loadTickets();
      return response.data;
    } catch (err: any) {
      console.error('Create failed:', err);
      setError(err.response?.data?.message || 'Failed to create ticket');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [loadTickets]);

  const handleUpdate = useCallback(async (id: number, data: UpdateTicketData): Promise<Ticket | null> => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await updateTicket(id, data);
      await loadTickets();
      return response.data;
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.response?.data?.message || 'Failed to update ticket');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [loadTickets]);

  const getTicketById = useCallback(async (id: number): Promise<Ticket | null> => {
    setError(null);
    try {
      const response = await getTicket(id);
      return response.data;
    } catch (err: any) {
      console.error('Get ticket failed:', err);
      setError(err.response?.data?.message || 'Failed to load ticket details');
      return null;
    }
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    await loadTickets();
  }, [loadTickets]);

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
    setSearch,
    setFilterStatus,
    setFilterPriority,
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