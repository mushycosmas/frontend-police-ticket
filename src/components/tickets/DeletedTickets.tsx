import React, { useEffect, useState, useCallback } from "react";
import { getDeletedTickets, restoreTicket } from "../../api/ticketApi";
import { Toast } from "../common/Toast";
import TicketViewModal from "./TicketViewModal";

interface DeletedTicket {
  id: number;
  ticket_number: string;
  title: string;
  description?: string;
  customer_detail?: {
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
  };
  created_at?: string;
  deleted_at?: string;
}

export const DeletedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<DeletedTicket[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [restoringId, setRestoringId] = useState<number | null>(null);

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const pageSize = 10;

  // =========================
  // LOAD DELETED TICKETS
  // =========================
  const loadDeleted = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getDeletedTickets({
        page,
        page_size: pageSize,
        search: search || undefined,
      });

      const data = res?.data;

      const items: DeletedTicket[] =
        data?.results ?? data ?? [];

      const count: number =
        data?.count ?? items.length ?? 0;

      setTickets(items);
      setTotalItems(count);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (err: any) {
      console.error(err);
      setToast({
        message:
          err?.response?.data?.error ||
          "Failed to load deleted tickets",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadDeleted();
  }, [loadDeleted]);

  // =========================
  // RESTORE TICKET
  // =========================
  const handleRestore = async (id: number) => {
    if (!window.confirm("Restore this ticket?")) return;

    setRestoringId(id);

    try {
      await restoreTicket(id);

      setToast({
        message: "Ticket restored successfully",
        type: "success",
      });

      loadDeleted();
    } catch (err: any) {
      setToast({
        message:
          err?.response?.data?.error || "Restore failed",
        type: "error",
      });
    } finally {
      setRestoringId(null);
    }
  };

  // =========================
  // VIEW TICKET
  // =========================
  const handleViewTicket = (id: number) => {
    setSelectedTicketId(id);
    setShowViewModal(true);
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Deleted Tickets
          </h1>
          <p className="text-sm text-gray-500">
            Soft-deleted tickets can be restored here.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-4 max-w-md relative">
          <input
            type="text"
            placeholder="Search ticket, title, customer..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* ICON */}
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* CLEAR */}
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              ✕
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deleted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y">

                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No deleted tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">

                      <td className="px-6 py-4 text-sm font-mono">
                        {ticket.ticket_number}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {ticket.title}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {ticket.customer_detail?.customer_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(ticket.deleted_at)}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">

                        {/* <button
                          onClick={() => handleViewTicket(ticket.id)}
                          className="px-3 py-1 text-xs border rounded"
                        >
                          View
                        </button> */}

                        <button
                          onClick={() => handleRestore(ticket.id)}
                          disabled={restoringId === ticket.id}
                          className="px-3 py-1 text-xs text-white bg-green-600 rounded disabled:opacity-50"
                        >
                          {restoringId === ticket.id
                            ? "Restoring..."
                            : "Restore"}
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex justify-between text-sm text-gray-500">

              <div>
                Showing {Math.min((page - 1) * pageSize + 1, totalItems)} to{" "}
                {Math.min(page * pageSize, totalItems)} of {totalItems}
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showViewModal && selectedTicketId && (
        <TicketViewModal
          show={showViewModal}
          ticketId={selectedTicketId}
          onHide={() => {
            setShowViewModal(false);
            setSelectedTicketId(null);
          }}
          onRefresh={loadDeleted}
        />
      )}
    </div>
  );
};