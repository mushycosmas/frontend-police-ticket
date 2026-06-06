import React from "react";
import AssignTicketForm from "./AssignTicketForm";
import { StatusBadge, PriorityBadge } from "../common/Badge";

type Props = {
  show: boolean;
  onHide: () => void;
  ticket: any;
  onRefresh?: () => void;
};

const TicketViewModal: React.FC<Props> = ({
  show,
  onHide,
  ticket,
  onRefresh,
}) => {
  if (!show || !ticket) return null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const canAssign =
    user?.role === "ADMIN" || user?.role === "TEAM_LEAD";

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  return (
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
                  {ticket.channel || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* ===================== TICKET DETAILS ===================== */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Ticket Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Title</label>
                <div className="text-sm font-medium text-gray-800">
                  {ticket.title || "-"}
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
            <h3 className="font-semibold text-gray-800 mb-3">Workflow</h3>
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
            <h3 className="font-semibold text-gray-800 mb-3">Timeline</h3>
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

          {/* ===================== ASSIGN SECTION ===================== */}
          {canAssign && (
            <div className="border-t pt-4 mt-4">
              <AssignTicketForm
                ticket={ticket}
                ticketId={ticket.id}
                onSuccess={onRefresh}
                onClose={onHide}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 shrink-0 flex justify-end">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketViewModal;