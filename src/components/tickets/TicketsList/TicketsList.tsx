import React, { useState } from 'react';
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
  const {
    tickets,
    allTickets,
    loading,
    page,
    totalPages,
    search,
    filterStatus,
    filterPriority,
    setPage,
    setSearch,
    setFilterStatus,
    setFilterPriority,
    handleDelete,
    handleResolve,
    handleClose,
    refresh,
    isDeleting,
    isResolving,
    isClosing,
  } = useTickets();

  // Modal states
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showView, setShowView] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteTicketNumber, setDeleteTicketNumber] = useState<string>('');
  
  // Comment modal states for resolve/close
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const [actionTicketId, setActionTicketId] = useState<number | null>(null);
  const [actionTicketNumber, setActionTicketNumber] = useState<string>('');
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const handleView = (ticket: Ticket): void => {
    setSelectedTicket(ticket);
    setShowView(true);
  };

  const handleDeleteClick = (id: number, ticketNumber: string): void => {
    setDeleteId(id);
    setDeleteTicketNumber(ticketNumber);
    setShowDelete(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (deleteId) {
      const success = await handleDelete(deleteId);
      if (success) {
        showToast(`✅ Ticket ${deleteTicketNumber} deleted successfully`, 'success');
        setShowDelete(false);
        setDeleteId(null);
        setDeleteTicketNumber('');
      } else {
        showToast(`❌ Failed to delete ticket ${deleteTicketNumber}`, 'error');
      }
    }
  };

  // Handle resolve with comment
  const handleResolveClick = (id: number, ticketNumber: string): void => {
    setActionTicketId(id);
    setActionTicketNumber(ticketNumber);
    setShowResolveModal(true);
  };

  const confirmResolve = async (comment: string): Promise<void> => {
    if (actionTicketId) {
      const success = await handleResolve(actionTicketId);
      if (success) {
        if (comment && comment.trim()) {
          showToast(`✅ Ticket ${actionTicketNumber} resolved successfully. Comment: "${comment.trim()}"`, 'success');
        } else {
          showToast(`✅ Ticket ${actionTicketNumber} resolved successfully`, 'success');
        }
        setShowResolveModal(false);
        setActionTicketId(null);
        setActionTicketNumber('');
      } else {
        showToast(`❌ Failed to resolve ticket ${actionTicketNumber}`, 'error');
      }
    }
  };

  // Handle close with comment
  const handleCloseClick = (id: number, ticketNumber: string): void => {
    setActionTicketId(id);
    setActionTicketNumber(ticketNumber);
    setShowCloseModal(true);
  };

  const confirmClose = async (comment: string): Promise<void> => {
    if (actionTicketId) {
      const success = await handleClose(actionTicketId);
      if (success) {
        if (comment && comment.trim()) {
          showToast(`✅ Ticket ${actionTicketNumber} closed successfully. Comment: "${comment.trim()}"`, 'success');
        } else {
          showToast(`✅ Ticket ${actionTicketNumber} closed successfully`, 'success');
        }
        setShowCloseModal(false);
        setActionTicketId(null);
        setActionTicketNumber('');
      } else {
        showToast(`❌ Failed to close ticket ${actionTicketNumber}`, 'error');
      }
    }
  };

  const clearFilters = (): void => {
    setSearch('');
    setFilterStatus('');
    setFilterPriority('');
  };

  const hasFilters: boolean = !!(search || filterStatus || filterPriority);

  if (loading) {
    return <TicketsLoading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <TicketsHeader 
        totalCount={allTickets.length} 
        onCreateClick={() => setShowCreate(true)} 
      />

      <TicketsFilters
        search={search}
        filterStatus={filterStatus}
        filterPriority={filterPriority}
        onSearchChange={setSearch}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {tickets.length === 0 ? (
          <TicketsEmpty hasFilters={hasFilters} onClearFilters={clearFilters} />
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
            <TicketsPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Modals */}
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
        message={`Are you sure you want to delete ticket ${deleteTicketNumber}? This action cannot be undone.`}
        onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

      {/* Resolve Comment Modal */}
      <CommentModal
        show={showResolveModal}
        title="Resolve Ticket"
        message={`Please provide any resolution notes or comments for ticket ${actionTicketNumber} (optional):`}
        actionType="resolve"
        onHide={() => setShowResolveModal(false)}
        onConfirm={confirmResolve}
        loading={isResolving}
      />

      {/* Close Comment Modal */}
      <CommentModal
        show={showCloseModal}
        title="Close Ticket"
        message={`Please provide any closing comments or notes for ticket ${actionTicketNumber} (optional):`}
        actionType="close"
        onHide={() => setShowCloseModal(false)}
        onConfirm={confirmClose}
        loading={isClosing}
      />
    </div>
  );
};