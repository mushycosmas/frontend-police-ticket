import React from "react";
import AssignTicketForm from "./AssignTicketForm";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-5">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">
            Ticket #{ticket.id}
          </h2>

          <button
            onClick={onHide}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="mt-4 space-y-4">

          {/* CUSTOMER INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <div>
              <label className="text-xs text-gray-500">
                Customer Name
              </label>
              <input
                value={ticket.customer_name || "-"}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Contact
              </label>
              <input
                value={ticket.customer_contact || "-"}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">
                Title
              </label>
              <input
                value={ticket.title || "-"}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">
                Description
              </label>
              <textarea
                rows={4}
                value={ticket.description || "-"}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

          </div>

          {/* WORKFLOW INFO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">

            <div>
              <p className="text-gray-500 text-xs">Status</p>
              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                {ticket.status || "OPEN"}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Priority</p>
              <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
                {ticket.priority || "MEDIUM"}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Team</p>
              <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">
                {ticket.team_name ||
                  (ticket.team_id && `Team #${ticket.team_id}`) ||
                  "Unassigned"}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Agent</p>
              <span className="inline-block px-2 py-1 rounded bg-gray-800 text-white text-xs">
                {ticket.assigned_to_name ||
                  (ticket.assigned_to_id &&
                    `Agent #${ticket.assigned_to_id}`) ||
                  "Unassigned"}
              </span>
            </div>

          </div>

          {/* ASSIGN SECTION */}
          {canAssign && (
            <div className="border-t pt-4">
              <AssignTicketForm
                ticket={ticket}
                ticketId={ticket.id}
                onSuccess={onRefresh}
                onClose={onHide}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TicketViewModal;