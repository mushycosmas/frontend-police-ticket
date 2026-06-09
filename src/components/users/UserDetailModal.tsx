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
  const [showChart, setShowChart] = useState<boolean>(true);

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

  // Get display name
  const getDisplayName = (): string => {
    if (user.full_name) return user.full_name;
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    if (user.username) return user.username;
    if (user.email) return user.email;
    return "User";
  };

  // Get role display name - using role_name from API
  const getRoleDisplayName = (): string => {
    if (user.role_name) return user.role_name;
    if (typeof user.role === "string") return user.role;
    if (user.role && typeof user.role === "object" && user.role.name) return user.role.name;
    return "No Role";
  };

  // Get formatted role for display
  const getFormattedRole = (): string => {
    const roleName = getRoleDisplayName();
    return roleName.replace(/_/g, " ");
  };

  // Get role badge color
  const getRoleBadgeColor = (): string => {
    const roleName = getRoleDisplayName();
    const roleLower = roleName.toLowerCase();
    
    if (roleLower.includes("admin")) return "bg-red-100 text-red-800";
    if (roleLower.includes("manager")) return "bg-purple-100 text-purple-800";
    if (roleLower.includes("team_lead") || roleLower.includes("team lead")) return "bg-blue-100 text-blue-800";
    if (roleLower.includes("agent")) return "bg-green-100 text-green-800";
    if (roleLower.includes("qa") || roleLower.includes("analyst")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Get rank display
  const getRankDisplay = (): string => {
    if (user.rank) return user.rank;
    return "Not specified";
  };

  // Get team name
  const getTeamDisplay = (): string => {
    if (user.team_name) return user.team_name;
    return "No team assigned";
  };

  // Get user avatar initial
  const getUserInitial = (): string => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b bg-white flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {getUserInitial()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{getDisplayName()}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl transition-colors">
            ✕
          </button>
        </div>

        {/* User Info - Fixed */}
        <div className="bg-gray-50 p-4 border-b flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Username</label>
              <p className="text-sm font-medium text-gray-800">@{user.username || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Full Name</label>
              <p className="text-sm font-medium text-gray-800">{getDisplayName()}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Name Details</label>
              <p className="text-sm text-gray-800">
                {user.first_name ? `${user.first_name} ${user.last_name || ""}` : "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Role</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                {getFormattedRole()}
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Rank / Position</label>
              <p className="text-sm font-medium text-gray-800">{getRankDisplay()}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Team</label>
              <p className="text-sm text-gray-800">{getTeamDisplay()}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-500 block uppercase tracking-wide">Joined</label>
              <p className="text-sm text-gray-800">
                {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary Cards - Fixed */}
        <div className="grid grid-cols-5 gap-2 p-4 bg-white border-b flex-shrink-0">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats?.total_assigned || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Assigned</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats?.total_open || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Open</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats?.total_in_progress || 0}</div>
            <div className="text-xs text-gray-600 mt-1">In Progress</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats?.total_resolved || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Resolved</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats?.total_closed || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Closed</div>
          </div>
        </div>

        {/* Toggle View - Fixed */}
        <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setShowChart(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showChart 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              📊 Performance Analytics
            </button>
            <button
              onClick={() => setShowChart(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showChart 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🎫 Tickets List ({tickets.length})
            </button>
          </div>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading user data...</p>
            </div>
          ) : showChart ? (
            /* Performance Chart View */
            <div className="min-h-[400px]">
              <UserPerformanceChart stats={stats} tickets={tickets} />
            </div>
          ) : (
            /* Tickets List View */
            <>
              {/* Filter Tabs - Scrollable on mobile */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === "all" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Tickets ({tickets.length})
                </button>
                <button
                  onClick={() => handleFilterChange("OPEN")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === "OPEN" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Open ({tickets.filter(t => t.status === "OPEN").length})
                </button>
                <button
                  onClick={() => handleFilterChange("IN_PROGRESS")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === "IN_PROGRESS" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  In Progress ({tickets.filter(t => t.status === "IN_PROGRESS").length})
                </button>
                <button
                  onClick={() => handleFilterChange("RESOLVED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === "RESOLVED" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Resolved ({tickets.filter(t => t.status === "RESOLVED").length})
                </button>
                <button
                  onClick={() => handleFilterChange("CLOSED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500">No tickets found</p>
                  <p className="text-sm text-gray-400 mt-1">No tickets match the selected filter</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => onViewTicket(ticket)}
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {ticket.ticket_number}
                              </span>
                              <StatusBadge status={ticket.status} />
                              <PriorityBadge priority={ticket.priority} />
                            </div>
                            <h4 className="font-medium text-gray-800 mb-1">{ticket.title}</h4>
                            {ticket.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {ticket.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>📅 Created: {timeAgo(ticket.created_at)}</span>
                              {ticket.customer_name && (
                                <span>👤 Customer: {ticket.customer_name}</span>
                              )}
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
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length} tickets
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPage(p => p - 1)}
                          disabled={page === 1}
                          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                        >
                          ← Previous
                        </button>
                        <span className="px-4 py-2 text-sm font-medium">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          onClick={() => setPage(p => p + 1)}
                          disabled={page === totalPages}
                          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
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

        {/* Footer - Fixed */}
        <div className="border-t p-4 bg-gray-50 flex justify-end rounded-b-xl flex-shrink-0">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;