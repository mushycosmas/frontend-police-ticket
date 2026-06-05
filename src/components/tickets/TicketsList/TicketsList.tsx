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

  // ======================
  // MODALS STATE
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

  const showToast = (message: string, type: any) => {
    setToast({ message, type });
  };

  // ======================
  // VIEW
  // ======================
  const handleView = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowView(true);
  };

  // ======================
  // DELETE
  // ======================
  const handleDeleteClick = (id: number, ticketNumber: string) => {
    setDeleteId(id);
    setDeleteTicketNumber(ticketNumber);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    const success = await handleDelete(deleteId);

    if (success) {
      showToast(`✅ Ticket ${deleteTicketNumber} deleted`, 'success');
    } else {
      showToast(`❌ Failed to delete ticket`, 'error');
    }

    setShowDelete(false);
    setDeleteId(null);
    setDeleteTicketNumber('');
  };

  // ======================
  // RESOLVE
  // ======================
  const handleResolveClick = (id: number, ticketNumber: string) => {
    setActionTicketId(id);
    setActionTicketNumber(ticketNumber);
    setShowResolveModal(true);
  };

  const confirmResolve = async (comment: string) => {
    if (!actionTicketId) return;

    const trimmedComment = comment?.trim() || '';

    console.log("RESOLVE CLICK:", {
      id: actionTicketId,
      comment: trimmedComment
    });

    const success = await handleResolve(actionTicketId, trimmedComment);

    if (success) {
      showToast(
        trimmedComment
          ? `✅ Ticket ${actionTicketNumber} resolved with comment`
          : `✅ Ticket ${actionTicketNumber} resolved`,
        'success'
      );
    } else {
      showToast(`❌ Failed to resolve ticket`, 'error');
    }

    setShowResolveModal(false);
    setActionTicketId(null);
    setActionTicketNumber('');
  };

  // ======================
  // CLOSE
  // ======================
  const handleCloseClick = (id: number, ticketNumber: string) => {
    setActionTicketId(id);
    setActionTicketNumber(ticketNumber);
    setShowCloseModal(true);
  };

  const confirmClose = async (comment: string) => {
    if (!actionTicketId) return;

    const trimmedComment = comment?.trim() || '';

    console.log("CLOSE CLICK:", {
      id: actionTicketId,
      comment: trimmedComment
    });

    const success = await handleClose(actionTicketId, trimmedComment);

    if (success) {
      showToast(
        trimmedComment
          ? `✅ Ticket ${actionTicketNumber} closed with comment`
          : `✅ Ticket ${actionTicketNumber} closed`,
        'success'
      );
    } else {
      showToast(`❌ Failed to close ticket`, 'error');
    }

    setShowCloseModal(false);
    setActionTicketId(null);
    setActionTicketNumber('');
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('');
    setFilterPriority('');
  };

  const hasFilters = !!(search || filterStatus || filterPriority);

  if (loading) return <TicketsLoading />;

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
      <TicketsHeader
        totalCount={allTickets.length}
        onCreateClick={() => setShowCreate(true)}
      />

      {/* FILTERS */}
      <TicketsFilters
        search={search}
        filterStatus={filterStatus}
        filterPriority={filterPriority}
        onSearchChange={setSearch}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
      />

      {/* TABLE */}
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

      {/* CREATE */}
      <CreateTicketModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={refresh}
      />

      {/* VIEW */}
      <TicketViewModal
        show={showView}
        ticket={selectedTicket}
        onHide={() => {
          setShowView(false);
          setSelectedTicket(null);
        }}
        onRefresh={refresh}
      />

      {/* DELETE */}
      <ConfirmModal
        show={showDelete}
        title="Delete Ticket"
        message={`Delete ${deleteTicketNumber}?`}
        onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

      {/* RESOLVE COMMENT */}
      <CommentModal
        show={showResolveModal}
        title="Resolve Ticket"
        message={`Add resolution comment for ${actionTicketNumber}`}
        actionType="resolve"
        onHide={() => setShowResolveModal(false)}
        onConfirm={confirmResolve}
        loading={isResolving}
      />

      {/* CLOSE COMMENT */}
      <CommentModal
        show={showCloseModal}
        title="Close Ticket"
        message={`Add closing comment for ${actionTicketNumber}`}
        actionType="close"
        onHide={() => setShowCloseModal(false)}
        onConfirm={confirmClose}
        loading={isClosing}
      />
    </div>
  );
};