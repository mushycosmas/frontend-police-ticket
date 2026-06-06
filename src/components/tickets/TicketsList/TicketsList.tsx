import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTickets } from '../../../hooks/tickets/useTickets';
import { TicketsHeader } from './components/TicketsHeader';
import { TicketsFilters } from './components/TicketsFilters';
import { TicketsTable } from './components/TicketsTable';
import { TicketsPagination } from './components/TicketsPagination';
import { TicketsLoading } from './components/TicketsLoading';
import { TicketsEmpty } from './components/TicketsEmpty';

import { Ticket } from '../../../types/tickets/tickets.types';

import CreateTicketModal from '../CreateTicketModal';
import TicketViewModal from '../TicketViewModal';
import { ConfirmModal } from '../../common/ConfirmModal';
import { CommentModal } from './components/CommentModal';
import { Toast } from '../../common/Toast';

export const TicketsList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ GET STATUS FROM URL (/tickets/my -> my)
  const status = useMemo(() => {
    const parts = location.pathname.split('/');
    return parts[2]; // /tickets/my
  }, [location.pathname]);

  const {
    tickets,
    allTickets,
    loading,
    page,
    totalPages,
    search,
    filterStatus,
    filterPriority,
    currentFilter,
    setPage,
    setSearch,
    setFilterStatus,
    setFilterPriority,
    setCurrentFilter,
    handleDelete,
    handleResolve,
    handleClose,
    refresh,
    isDeleting,
    isResolving,
    isClosing,
  } = useTickets();

  // ======================
  // ROUTE → FILTER SYNC
  // ======================
  useEffect(() => {
    const normalized = (status || '').toLowerCase();

    // Handle special filters (use dedicated API endpoints)
    if (normalized === 'my') {
      setCurrentFilter('my');
      setFilterStatus('');
      setFilterPriority('');
      setSearch('');
    } 
    else if (normalized === 'assigned') {
      setCurrentFilter('assigned');
      setFilterStatus('');
      setFilterPriority('');
      setSearch('');
    }
    else if (normalized === 'unassigned') {
      setCurrentFilter('unassigned');
      setFilterStatus('');
      setFilterPriority('');
      setSearch('');
    }
    else if (normalized === 'closed') {
      setCurrentFilter('closed');
      setFilterStatus('');
      setFilterPriority('');
      setSearch('');
    }
    else {
      setCurrentFilter('all');
      
      // Handle status filters (client-side filtering)
      if (normalized && normalized !== 'tickets' && normalized !== 'all' && normalized !== '') {
        const statusMap: Record<string, string> = {
          'open': 'OPEN',
          'in-progress': 'IN_PROGRESS',
          'resolved': 'RESOLVED',
          'closed': 'CLOSED',
          'escalated': 'ESCALATED',
          'reopened': 'REOPENED'
        };
        
        const mappedStatus = statusMap[normalized];
        if (mappedStatus) {
          setFilterStatus(mappedStatus as any);
        } else {
          setFilterStatus('');
        }
      } else {
        setFilterStatus('');
      }
      
      // Reset priority and search when route changes
      setFilterPriority('');
      setSearch('');
    }
  }, [status, setCurrentFilter, setFilterStatus, setFilterPriority, setSearch]);

  // ======================
  // STATE
  // ======================
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteTicketNumber, setDeleteTicketNumber] = useState('');

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const [actionTicketId, setActionTicketId] = useState<number | null>(null);
  const [actionTicketNumber, setActionTicketNumber] = useState('');

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  // ======================
  // TOAST
  // ======================
  const showToast = useCallback((message: string, type: any) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ======================
  // VIEW
  // ======================
  const handleView = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowView(true);
  }, []);

  // ======================
  // DELETE
  // ======================
  const handleDeleteClick = useCallback((id: number, ticketNumber: string) => {
    setDeleteId(id);
    setDeleteTicketNumber(ticketNumber);
    setShowDelete(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;

    const success = await handleDelete(deleteId);

    showToast(
      success
        ? `✅ Ticket ${deleteTicketNumber} deleted successfully`
        : `❌ Failed to delete ticket ${deleteTicketNumber}`,
      success ? 'success' : 'error'
    );

    setShowDelete(false);
    setDeleteId(null);
    setDeleteTicketNumber('');
  }, [deleteId, deleteTicketNumber, handleDelete, showToast]);

  // ======================
  // RESOLVE
  // ======================
  const handleResolveClick = useCallback((id: number, ticketNumber: string) => {
    setActionTicketId(id);
    setActionTicketNumber(ticketNumber);
    setShowResolveModal(true);
  }, []);

  const confirmResolve = useCallback(async (comment: string) => {
    if (!actionTicketId) return;

    const success = await handleResolve(actionTicketId, comment);

    showToast(
      success
        ? `✅ Ticket ${actionTicketNumber} resolved successfully`
        : `❌ Failed to resolve ticket ${actionTicketNumber}`,
      success ? 'success' : 'error'
    );

    setShowResolveModal(false);
    setActionTicketId(null);
    setActionTicketNumber('');
  }, [actionTicketId, actionTicketNumber, handleResolve, showToast]);

  // ======================
  // CLOSE
  // ======================
  const handleCloseClick = useCallback((id: number, ticketNumber: string) => {
    setActionTicketId(id);
    setActionTicketNumber(ticketNumber);
    setShowCloseModal(true);
  }, []);

  const confirmClose = useCallback(async (comment: string) => {
    if (!actionTicketId) return;

    const success = await handleClose(actionTicketId, comment);

    showToast(
      success
        ? `✅ Ticket ${actionTicketNumber} closed successfully`
        : `❌ Failed to close ticket ${actionTicketNumber}`,
      success ? 'success' : 'error'
    );

    setShowCloseModal(false);
    setActionTicketId(null);
    setActionTicketNumber('');
  }, [actionTicketId, actionTicketNumber, handleClose, showToast]);

  // ======================
  // FILTERS
  // ======================
  const clearFilters = useCallback(() => {
    setSearch('');
    setFilterStatus('');
    setFilterPriority('');
    setCurrentFilter('all');
    navigate('/tickets');
  }, [setSearch, setFilterStatus, setFilterPriority, setCurrentFilter, navigate]);

  const hasFilters = useMemo(
    () => !!(search || filterStatus || filterPriority || currentFilter !== 'all'),
    [search, filterStatus, filterPriority, currentFilter]
  );

  // Get filter label for header
  const getFilterLabel = useMemo(() => {
    if (currentFilter === 'my') return 'My Tickets';
    if (currentFilter === 'assigned') return 'Assigned to Me';
    if (currentFilter === 'unassigned') return 'Unassigned Tickets';
    if (currentFilter === 'closed') return 'Closed Tickets';
    if (filterStatus) return `${filterStatus.replace('_', ' ')} Tickets`;
    return 'All Tickets';
  }, [currentFilter, filterStatus]);

  // Get display count
  const displayCount = useMemo(() => {
    if (hasFilters) return tickets.length;
    return allTickets.length;
  }, [hasFilters, tickets.length, allTickets.length]);

  // ======================
  // LOADING
  // ======================
  if (loading && tickets.length === 0) {
    return <TicketsLoading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {getFilterLabel}
          </h2>
          <p className="text-sm text-gray-500">
            {displayCount} ticket{displayCount !== 1 ? 's' : ''}
            {currentFilter === 'unassigned' && ' (no agent assigned)'}
            {currentFilter === 'assigned' && ' (assigned to you)'}
            {currentFilter === 'my' && ' (assigned to you)'}
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ✚ New Ticket
        </button>
      </div>

      {/* FILTERS - Only show for 'all' filter */}
      {currentFilter === 'all' && (
        <TicketsFilters
          search={search}
          filterStatus={filterStatus}
          filterPriority={filterPriority}
          onSearchChange={setSearch}
          onStatusChange={setFilterStatus}
          onPriorityChange={setFilterPriority}
          onClearFilters={clearFilters}
          hasFilters={hasFilters}
        />
      )}

      {/* Info banner for special filters */}
      {currentFilter !== 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
          Showing {getFilterLabel.toLowerCase()}
          <button
            onClick={clearFilters}
            className="ml-3 text-blue-600 hover:text-blue-800 underline font-medium"
          >
            View all tickets
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {tickets.length === 0 ? (
          <TicketsEmpty
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <>
            <TicketsTable
              tickets={tickets}
              onView={handleView}
              onDelete={handleDeleteClick}
              onResolve={handleResolveClick}
              onClose={handleCloseClick}
              isDeleting={isDeleting}
              isResolving={isResolving}
              isClosing={isClosing}
            />

            {totalPages > 1 && (
              <TicketsPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <CreateTicketModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={refresh}
      />

      <TicketViewModal
        show={showView}
        ticket={selectedTicket}
        onHide={() => {
          setShowView(false);
          setSelectedTicket(null);
        }}
        onRefresh={refresh}
      />

      <ConfirmModal
        show={showDelete}
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket ${deleteTicketNumber}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

      <CommentModal
        show={showResolveModal}
        title="Resolve Ticket"
        message={`Please provide a resolution comment for ticket ${actionTicketNumber}`}
        actionType="resolve"
        onHide={() => setShowResolveModal(false)}
        onConfirm={confirmResolve}
        loading={isResolving}
      />

      <CommentModal
        show={showCloseModal}
        title="Close Ticket"
        message={`Please provide a closing comment for ticket ${actionTicketNumber}`}
        actionType="close"
        onHide={() => setShowCloseModal(false)}
        onConfirm={confirmClose}
        loading={isClosing}
      />
    </div>
  );
};