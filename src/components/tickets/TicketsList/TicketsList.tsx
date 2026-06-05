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
import {ConfirmModal} from '../../common/ConfirmModal';

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

  const handleView = (ticket: Ticket): void => {
    setSelectedTicket(ticket);
    setShowView(true);
  };

  const handleDeleteClick = (id: number): void => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (deleteId) {
      const success = await handleDelete(deleteId);
      if (success) {
        setShowDelete(false);
        setDeleteId(null);
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
              onResolve={handleResolve}
              onClose={handleClose}
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
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        onHide={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        />
    </div>
  );
};