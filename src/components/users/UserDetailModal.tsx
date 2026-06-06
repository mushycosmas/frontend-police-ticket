import React, { useState, useMemo } from "react";
import { StatusBadge, PriorityBadge } from "../common/Badge";
import { timeAgo } from "../../utils/helpers";
import UserPerformanceChart from "./UserPerformanceChart";

interface UserDetailModalProps {
  show: boolean;
  user: any;
  tickets: any[];
  stats: any;
  loading: boolean;
  onClose: () => void;
  onViewTicket: (ticket: any) => void;
}

const ITEMS_PER_PAGE = 10;

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  show,
  user,
  tickets,
  stats,
  loading,
  onClose,
  onViewTicket,
}) => {
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [showChart, setShowChart] = useState<boolean>(true); // Toggle between chart and tickets

  // Filter tickets by status
  const filteredTickets = useMemo(() => {
    if (filter === "all") return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [tickets, filter]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, page]);

  // Reset page when filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  if (!show || !user) return null;

  const getDisplayName = () => {
    return user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-800",
      MANAGER: "bg-purple-100 text-purple-800",
      TEAM_LEAD: "bg-blue-100 text-blue-800",
      AGENT: "bg-green-100 text-green-800",
      QA_ANALYST: "bg-yellow-100 text-yellow-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{getDisplayName()}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 block">Username</label>
              <p className="text-sm font-medium text-gray-800">@{user.username}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block">Role</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role?.replace("_", " ") || "Unknown"}
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block">Team</label>
              <p className="text-sm text-gray-800">{user.team_name || "No team assigned"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-5 gap-2 p-4 bg-white border-b">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats?.total_assigned || 0}</div>
            <div className="text-xs text-gray-600">Assigned</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats?.total_open || 0}</div>
            <div className="text-xs text-gray-600">Open</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats?.total_in_progress || 0}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats?.total_resolved || 0}</div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-gray-600">{stats?.total_closed || 0}</div>
            <div className="text-xs text-gray-600">Closed</div>
          </div>
        </div>

        {/* Toggle View */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setShowChart(true)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                showChart 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📊 Performance Analytics
            </button>
            <button
              onClick={() => setShowChart(false)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                !showChart 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🎫 Tickets List
            </button>
          </div>
        </div>

        {/* Content - Show Chart or Tickets */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500">Loading data...</p>
            </div>
          ) : showChart ? (
            /* Performance Chart View */
            <UserPerformanceChart stats={stats} tickets={tickets} />
          ) : (
            /* Tickets List View */
            <>
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                    filter === "all" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Tickets ({tickets.length})
                </button>
                <button
                  onClick={() => handleFilterChange("OPEN")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                    filter === "OPEN" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Open ({tickets.filter(t => t.status === "OPEN").length})
                </button>
                <button
                  onClick={() => handleFilterChange("IN_PROGRESS")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                    filter === "IN_PROGRESS" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  In Progress ({tickets.filter(t => t.status === "IN_PROGRESS").length})
                </button>
                <button
                  onClick={() => handleFilterChange("RESOLVED")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                    filter === "RESOLVED" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Resolved ({tickets.filter(t => t.status === "RESOLVED").length})
                </button>
                <button
                  onClick={() => handleFilterChange("CLOSED")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                    filter === "CLOSED" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Closed ({tickets.filter(t => t.status === "CLOSED").length})
                </button>
              </div>

              {/* Tickets List */}
              {paginatedTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No tickets found</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => onViewTicket(ticket)}
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="font-mono text-xs text-blue-600">
                                {ticket.ticket_number}
                              </span>
                              <StatusBadge status={ticket.status} />
                              <PriorityBadge priority={ticket.priority} />
                            </div>
                            <h4 className="font-medium text-gray-800">{ticket.title}</h4>
                            {ticket.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {ticket.description}
                              </p>
                            )}
                            {ticket.customer_name && (
                              <p className="text-xs text-gray-400 mt-1">
                                Customer: {ticket.customer_name}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>Created: {timeAgo(ticket.created_at)}</span>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} tickets
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPage(p => p - 1)}
                          disabled={page === 1}
                          className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                          ← Prev
                        </button>
                        <span className="px-3 py-1 text-sm">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          onClick={() => setPage(p => p + 1)}
                          disabled={page === totalPages}
                          className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;