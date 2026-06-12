import React, { useEffect, useState } from "react";
import { returnTicket } from "../../api/ticketApi";
import { getAllTeams } from "../../api/teamApi";
import { Toast } from "../common/Toast";

const ReturnTicketModal = ({ show, onHide, ticket, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ Reset + load teams when modal opens
  useEffect(() => {
    console.log("📌 Modal state:", { show, ticket });

    if (!show || !ticket) return;

    setReason("");
    setTeamId("");
    setTeams([]);

    loadTeams();
  }, [show, ticket]);

  // ✅ Load teams with FULL debugging
const loadTeams = async () => {
  try {
    setLoadingTeams(true);

    const res = await getAllTeams();

    console.log("📡 FULL RESPONSE:", res);

    // ✅ SUPPORT BOTH POSSIBLE STRUCTURES
    const teamsData =
      res?.data?.results ||   // axios style
      res?.results ||         // direct API style
      [];

    console.log("🎯 EXTRACTED TEAMS:", teamsData);

    if (!Array.isArray(teamsData)) {
      console.warn("❌ Teams is not array:", teamsData);
      setTeams([]);
      return;
    }

    setTeams(teamsData);
  } catch (error) {
    console.error("❌ loadTeams error:", error);
    setTeams([]);
  } finally {
    setLoadingTeams(false);
  }
};
  // ✅ Submit return ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📤 Submitting return ticket...");

    if (!reason.trim()) {
      setToast({
        type: "error",
        message: "Return reason is required",
      });
      return;
    }

    try {
      setLoading(true);

      await returnTicket(ticket.id, {
        reason: reason.trim(),
        team_id: teamId || null,
      });

      console.log("✅ Return success");

      setToast({
        type: "success",
        message: "Ticket returned successfully",
      });

      setTimeout(() => {
        onSuccess?.();
        onHide?.();
      }, 500);
    } catch (error) {
      console.error("❌ Return error:", error);

      setToast({
        type: "error",
        message:
          error?.response?.data?.error ||
          "Failed to return ticket",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🚫 Hide modal
  if (!show || !ticket) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">

          {/* HEADER */}
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Return Ticket
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Ticket{" "}
              <span className="font-medium">
                {ticket.ticket_number}
              </span>
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">

              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Title
                </label>

                <input
                  type="text"
                  value={ticket.title}
                  disabled
                  className="w-full rounded-lg border bg-gray-100 px-3 py-2"
                />
              </div>

              {/* TEAM SELECT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return To Team (Optional)
                </label>

                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  disabled={loadingTeams}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="">
                    {loadingTeams
                      ? "Loading teams..."
                      : "Keep Current Team"}
                  </option>

                  {!loadingTeams && teams.length === 0 && (
                    <option disabled>No teams found</option>
                  )}

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name || `Team #${team.id}`}
                    </option>
                  ))}
                </select>

                {/* DEBUG INFO */}
                <p className="text-xs text-gray-400 mt-1">
                  Debug: {teams.length} teams loaded
                </p>
              </div>

              {/* REASON */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this ticket should be returned..."
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>

            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-4 flex justify-end gap-3">

              <button
                type="button"
                onClick={onHide}
                disabled={loading}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Returning..." : "Return Ticket"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReturnTicketModal;