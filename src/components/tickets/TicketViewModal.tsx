// src/components/modals/TicketViewModal.tsx
import React, { useState, useEffect } from "react";
import AssignTicketForm from "./AssignTicketForm";
import UpdatePriorityModal from "./UpdatePriorityModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { StatusBadge, PriorityBadge } from "../common/Badge";
import TicketHistory from "./TicketHistory";
import { getTicket } from "../../api/ticketApi";

type Props = {
  show: boolean;
  onHide: () => void;
  ticketId: number | null;
  onRefresh?: () => void;
};

const TicketViewModal: React.FC<Props> = ({
  show,
  onHide,
  ticketId,
  onRefresh,
}) => {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Fetch full ticket details when modal opens or ticketId changes
  useEffect(() => {
    if (show && ticketId) {
      fetchTicketDetails();
    }
  }, [show, ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTicket(ticketId!);
      console.log("📦 Ticket data:", response.data); // ✅ Debug log
      setTicket(response.data);
    } catch (err) {
      console.error("Failed to fetch ticket details:", err);
      setError("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = () => {
    fetchTicketDetails();
    if (onRefresh) onRefresh();
  };

  if (!show) return null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Get user role (handles both string and object)
  const getUserRole = () => {
    if (user.role_name) return user.role_name;
    if (typeof user.role === 'string') return user.role;
    if (user.role?.name) return user.role.name;
    return "";
  };

  const userRole = getUserRole();
  
  // Only ADMIN and TEAM_LEAD can assign tickets, update priority, and update category
  const canAssign = userRole === "ADMIN" || userRole === "TEAM_LEAD";
  const canUpdatePriority = userRole === "ADMIN" || userRole === "TEAM_LEAD";
  const canUpdateCategory = userRole === "ADMIN" || userRole === "TEAM_LEAD";

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const handlePriorityUpdate = () => {
    setShowPriorityModal(false);
    fetchTicketDetails();
    if (onRefresh) onRefresh();
  };

  const handleCategoryUpdate = () => {
    setShowCategoryModal(false);
    fetchTicketDetails();
    if (onRefresh) onRefresh();
  };

  // ✅ Helper to get channel display name
  const getChannelDisplay = () => {
    if (ticket.channel_name) return ticket.channel_name;
    if (ticket.channel && typeof ticket.channel === 'object' && ticket.channel.name) {
      return ticket.channel.name;
    }
    if (ticket.channel && typeof ticket.channel === 'string') {
      return ticket.channel;
    }
    return "-";
  };

  // ✅ Helper to get category display name
  const getCategoryDisplay = () => {
    if (ticket.category_name) return ticket.category_name;
    if (ticket.category && typeof ticket.category === 'object' && ticket.category.name) {
      return ticket.category.name;
    }
    if (ticket.category && typeof ticket.category === 'string') {
      return ticket.category;
    }
    return "-";
  };

  // Show loading state
  if (loading && !ticket) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onHide}>
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading ticket details...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onHide}>
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
          <div className="text-center py-12 text-red-500">{error}</div>
          <div className="border-t px-6 py-4 shrink-0 flex justify-end">
            <button onClick={onHide} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onHide}>
        {/* MODAL */}
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          
          {/* HEADER */}
          <div className="flex justify-between items-center border-b px-6 py-4 shrink-0">
            <div>
              <h2 className="text-lg font-semibold">
                {ticket.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Ticket #{ticket.ticket_number}
              </p>
            </div>
            <button
              onClick={onHide}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {/* BODY (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            
            {/* ===================== CUSTOMER INFO ===================== */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Customer Name</label>
                  <div className="text-sm font-medium text-gray-800">
                    {ticket.customer_detail?.customer_name || ticket.customer_name || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Phone</label>
                  <div className="text-sm text-gray-800">
                    {ticket.customer_detail?.customer_phone || ticket.customer_phone || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Email</label>
                  <div className="text-sm text-gray-800">
                    {ticket.customer_detail?.customer_email || ticket.customer_email || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Channel</label>
                  <div className="text-sm text-gray-800">
                    {/* ✅ Fix: Use channel_name instead of channel */}
                    {getChannelDisplay()}
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== TICKET DETAILS ===================== */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Ticket Details</h3>
                {canUpdateCategory && (
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Category
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Title</label>
                  <div className="text-sm font-medium text-gray-800">
                    {ticket.title || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Category</label>
                  <div className="text-sm text-gray-800">
                    {/* ✅ Fix: Use category_name instead of category */}
                    {getCategoryDisplay()}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Description</label>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {ticket.description || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== LOCATION ===================== */}
            {(ticket.street_name || ticket.location_full) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Location</h3>
                <div className="text-sm text-gray-800">
                  {ticket.location_full || ticket.street_name || "Not set"}
                </div>
              </div>
            )}

            {/* ===================== WORKFLOW ===================== */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Workflow</h3>
                <div className="flex gap-2">
                  {canUpdateCategory && (
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Category
                    </button>
                  )}
                  {canUpdatePriority && (
                    <button
                      onClick={() => setShowPriorityModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Priority
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Status</p>
                  <StatusBadge status={ticket.status} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Priority</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Category</p>
                  <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                    {/* ✅ Fix: Use category_name */}
                    {getCategoryDisplay()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Team</p>
                  <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium">
                    {ticket.team_name || (ticket.team && `Team #${ticket.team}`) || "Unassigned"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Assigned To</p>
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                    {ticket.assigned_to_name || "Unassigned"}
                  </span>
                </div>
              </div>
            </div>

            {/* ===================== DATES ===================== */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Created</p>
                  <p className="text-gray-800">{formatDate(ticket.created_at)}</p>
                </div>
                {ticket.resolved_at && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Resolved</p>
                    <p className="text-gray-800">{formatDate(ticket.resolved_at)}</p>
                  </div>
                )}
                {ticket.updated_at && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Last Updated</p>
                    <p className="text-gray-800">{formatDate(ticket.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ===================== ATTACHMENTS ===================== */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {ticket.attachments.map((attachment: any) => (
                    <a
                      key={attachment.id}
                      href={attachment.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      📎 {attachment.file_name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ===================== TICKET HISTORY / TIMELINE ===================== */}
            <div className="bg-gray-50 rounded-lg p-4">
              <TicketHistory
                history={ticket.timeline || []}
                loading={loading}
                onRefresh={loadTicketDetails}
              />
            </div>

            {/* ===================== ASSIGN SECTION ===================== */}
            {canAssign && (
              <div className="border-t pt-4 mt-4">
                <AssignTicketForm
                  ticket={ticket}
                  ticketId={ticket.id}
                  onSuccess={() => {
                    fetchTicketDetails();
                    if (onRefresh) onRefresh();
                  }}
                  onClose={onHide}
                />
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="border-t px-6 py-4 shrink-0 flex justify-end gap-3">
            <button
              onClick={loadTicketDetails}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={onHide}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Priority Update Modal */}
      {canUpdatePriority && (
        <UpdatePriorityModal
          show={showPriorityModal}
          ticket={ticket}
          onHide={() => setShowPriorityModal(false)}
          onSuccess={handlePriorityUpdate}
        />
      )}

      {/* Category Update Modal */}
      {canUpdateCategory && (
        <UpdateCategoryModal
          show={showCategoryModal}
          ticket={ticket}
          onHide={() => setShowCategoryModal(false)}
          onSuccess={handleCategoryUpdate}
        />
      )}
    </>
  );
};

export default TicketViewModal;