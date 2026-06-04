import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  getTickets,
  deleteTicket,
  resolveTicket,
  closeTicket,
} from "../api/ticketApi";

import { Ticket, TicketStatus, TicketPriority } from "../types";
import { StatusBadge, PriorityBadge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { channelConfig, timeAgo } from "../utils/helpers";

import CreateTicketModal from "../components/tickets/CreateTicketModal";
import TicketViewModal from "../components/tickets/TicketViewModal";
import ConfirmModal from "../components/common/ConfirmModal";

const PAGE_SIZE = 15;

export const Tickets: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<TicketPriority | "">("");

  // MODALS
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // =====================
  // LOAD DATA
  // =====================
  const load = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getTickets();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // =====================
  // FILTER + SEARCH
  // =====================
  const processedTickets = useMemo(() => {
    let data = [...tickets];

    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.customer?.fullName?.toLowerCase().includes(q) ||
          String(t.id).includes(q)
      );
    }

    if (filterStatus) {
      data = data.filter((t) => t.status === filterStatus);
    }

    if (filterPriority) {
      data = data.filter((t) => t.priority === filterPriority);
    }

    return data;
  }, [tickets, search, filterStatus, filterPriority]);

  // =====================
  // PAGINATION
  // =====================
  const totalPages = Math.ceil(processedTickets.length / PAGE_SIZE);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return processedTickets.slice(start, start + PAGE_SIZE);
  }, [processedTickets, page]);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterPriority]);

  // =====================
  // ACTIONS
  // =====================
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTicket(deleteId);
      setShowDelete(false);
      setDeleteId(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await resolveTicket(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = async (id: number) => {
    try {
      await closeTicket(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tickets</h1>
          <p className="text-sm text-gray-500">
            {processedTickets.length} total ticket
            {processedTickets.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button onClick={() => setShowCreate(true)}>
          ✚ New Ticket
        </Button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <Input
            placeholder="Search tickets, customers, IDs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as TicketStatus | "")
            }
          >
            <option value="">All Statuses</option>
            {[
              "OPEN",
              "IN_PROGRESS",
              "ESCALATED",
              "RESOLVED",
              "CLOSED",
              "REOPENED",
            ].map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={filterPriority}
            onChange={(e) =>
              setFilterPriority(e.target.value as TicketPriority | "")
            }
          >
            <option value="">All Priorities</option>
            {["P1_CRITICAL", "P2_HIGH", "P3_MEDIUM", "P4_LOW"].map((p) => (
              <option key={p} value={p}>
                {p.replace("_", " ")}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : paginatedTickets.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No tickets found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "ID",
                      "Title",
                      "Customer",
                      "Channel",
                      "Status",
                      "Priority",
                      "Agent",
                      "Created",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="text-left p-3 text-xs">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedTickets.map((t) => (
                    <tr key={t.id} className="border-t">

                      <td className="p-3">#{t.id}</td>

                      <td className="p-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setSelectedTicket(t);
                            setShowView(true);
                          }}
                        >
                          {t.title}
                        </button>
                      </td>

                      <td className="p-3">{t.customer?.fullName ?? "—"}</td>

                      <td className="p-3">
                        {channelConfig[t.channel]?.label}
                      </td>

                      <td className="p-3">
                        <StatusBadge status={t.status} />
                      </td>

                      <td className="p-3">
                        <PriorityBadge priority={t.priority} />
                      </td>

                      <td className="p-3">
                        {t.agent?.fullName ?? "Unassigned"}
                      </td>

                      <td className="p-3">
                        {timeAgo(t.createdAt)}
                      </td>

                      <td className="p-3 flex gap-2">

                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(t);
                            setShowView(true);
                          }}
                        >
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setDeleteId(t.id);
                            setShowDelete(true);
                          }}
                        >
                          Delete
                        </Button>

                        {t.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleResolve(t.id)}
                          >
                            Resolve
                          </Button>
                        )}

                        {t.status === "RESOLVED" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleClose(t.id)}
                          >
                            Close
                          </Button>
                        )}

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between p-3 border-t">

                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>

              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <CreateTicketModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={load}
      />

      <TicketViewModal
        show={showView}
        ticket={selectedTicket}
        onHide={() => setShowView(false)}
        onRefresh={load}
      />

      <ConfirmModal
        show={showDelete}
        title="Delete Ticket"
        message="Are you sure?"
        onHide={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

    </div>
  );
};