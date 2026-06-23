import React, { useState, useEffect } from "react";
import { assignTicket } from "../../api/ticketApi";
import { getUsers, getTeams } from "../../api/userApi";
import { Toast } from "../common/Toast";

interface AssignTicketFormProps {
  ticket: any;
  ticketId: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

const AssignTicketForm: React.FC<AssignTicketFormProps> = ({
  ticket,
  ticketId,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [assignType, setAssignType] = useState<"support" | "team">("support");
  const [selectedSupport, setSelectedSupport] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = (user.role_name || user.role || "").toUpperCase();
  
  // =========================
  // PERMISSION CHECKS
  // =========================
  const userPermissions = user.permissions || [];
  
  // Check if user has permission to assign tickets
  // Using the exact codenames from your database
  const canAssignToSupport = userPermissions.includes('assign_ticket_to_support') || 
                             userPermissions.includes('assign_ticket_to_agent');
  
  const canAssignToTeam = userPermissions.includes('assign_ticket_to_team');
  
  // Check if user has any assign permission
  const hasAssignPermission = canAssignToSupport || canAssignToTeam;

  useEffect(() => {
    // If user doesn't have permission, show error and don't load data
    if (!hasAssignPermission) {
      setError("You don't have permission to assign tickets");
      setLoadingData(false);
      return;
    }
    loadData();
  }, []);

  // =========================
  // LOAD DATA
  // =========================
  const loadData = async () => {
    setLoadingData(true);
    setError(null);

    try {
      const usersRes = await getUsers();

      const usersData =
        usersRes.data?.results ||
        usersRes.data?.data ||
        (Array.isArray(usersRes.data) ? usersRes.data : []);

      let supportUsers: any[] = [];

      // =========================
      // TEAM LEAD FILTER
      // =========================
      if (role === "TEAM_LEAD") {
        const teamName = user.team_name;

        supportUsers = usersData.filter((u: any) => {
          const uRole = (u.role_name || u.role || "").toUpperCase();
          return (uRole === "SUPPORT" || uRole === "AGENT") && u.team_name === teamName;
        });
      }

      // =========================
      // ADMIN FILTER
      // =========================
      else if (role === "ADMIN") {
        supportUsers = usersData.filter((u: any) => {
          const uRole = (u.role_name || u.role || "").toUpperCase();
          return uRole === "SUPPORT" || uRole === "AGENT";
        });

        const teamsRes = await getTeams();

        const teamsData =
          teamsRes.data?.results ||
          teamsRes.data?.data ||
          (Array.isArray(teamsRes.data) ? teamsRes.data : []);

        setTeams(teamsData);
      }

      // =========================
      // SUPPORT/AGENT
      // =========================
      else if (role === "SUPPORT" || role === "AGENT") {
        supportUsers = usersData.filter((u: any) => u.id === user.id);
      }

      setAllUsers(supportUsers);

      if (supportUsers.length > 0) {
        setSelectedSupport(String(supportUsers[0].id));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingData(false);
    }
  };

  // =========================
  // TOAST
  // =========================
  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = {};

      // =========================
      // ADMIN - Check permissions
      // =========================
      if (role === "ADMIN") {
        if (assignType === "support") {
          // Check if admin has permission to assign to support
          if (!canAssignToSupport) {
            showToast("You don't have permission to assign to support staff", "error");
            setLoading(false);
            return;
          }

          if (!selectedSupport) {
            showToast("Select a support staff member", "error");
            setLoading(false);
            return;
          }

          payload = {
            type: "agent", // Backend expects "agent" type
            id: parseInt(selectedSupport),
          };
        } else {
          // Check if admin has permission to assign to team
          if (!canAssignToTeam) {
            showToast("You don't have permission to assign to teams", "error");
            setLoading(false);
            return;
          }

          if (!selectedTeam) {
            showToast("Select a team", "error");
            setLoading(false);
            return;
          }

          payload = {
            type: "team",
            id: parseInt(selectedTeam),
          };
        }
      }

      // =========================
      // TEAM LEAD - Check permissions
      // =========================
      else if (role === "TEAM_LEAD") {
        // Team leads can only assign to support in their team
        if (!canAssignToSupport) {
          showToast("You don't have permission to assign tickets", "error");
          setLoading(false);
          return;
        }

        if (!selectedSupport) {
          showToast("Select a support staff member", "error");
          setLoading(false);
          return;
        }

        payload = {
          type: "agent",
          id: parseInt(selectedSupport),
        };
      }

      // =========================
      // SUPPORT/AGENT - Check permissions
      // =========================
      else if (role === "SUPPORT" || role === "AGENT") {
        // Support can only assign to themselves
        if (!canAssignToSupport) {
          showToast("You don't have permission to assign tickets", "error");
          setLoading(false);
          return;
        }

        payload = {
          type: "agent",
          id: user.id,
        };
      }

      // Call the API with the payload
      await assignTicket(ticketId, payload);

      showToast("Ticket assigned successfully", "success");

      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1000);
    } catch (error: any) {
      showToast(
        error?.response?.data?.detail || 
        error?.response?.data?.message || 
        "Assignment failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loadingData) {
    return (
      <div className="text-center py-6">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">
          Loading assignment options...
        </p>
      </div>
    );
  }

  // =========================
  // NO PERMISSION
  // =========================
  if (!hasAssignPermission) {
    return (
      <div className="text-center py-6">
        <div className="text-red-500 text-4xl mb-2">🔒</div>
        <p className="text-red-600 font-medium">
          You don't have permission to assign tickets
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Please contact your administrator
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Assign Ticket</h3>
          <span className="text-xs text-gray-500">
            #{ticket.ticket_number}
          </span>
        </div>

        {/* PERMISSION INFO */}
        <div className="text-xs bg-gray-50 p-2 rounded border">
          <span className="text-gray-600">Your permissions: </span>
          {canAssignToSupport && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">
              👤 Support
            </span>
          )}
          {canAssignToTeam && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              👥 Team
            </span>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {error}
            <button
              type="button"
              onClick={loadData}
              className="ml-3 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* =========================
            ADMIN SWITCH - Only if has permissions
        ========================= */}
        {role === "ADMIN" && (canAssignToSupport || canAssignToTeam) && (
          <div className="flex gap-6 p-4 bg-gray-50 border rounded-xl">
            {canAssignToSupport && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={assignType === "support"}
                  onChange={() => setAssignType("support")}
                />
                👤 Support Staff
              </label>
            )}

            {canAssignToTeam && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={assignType === "team"}
                  onChange={() => setAssignType("team")}
                />
                👥 Team
              </label>
            )}
          </div>
        )}

        {/* =========================
            TEAM LEAD SELECT
        ========================= */}
        {role === "TEAM_LEAD" && canAssignToSupport && (
          <div className="bg-blue-50 border p-4 rounded-xl">
            <p className="text-sm text-blue-700 mb-2">
              📋 Your Team Support Staff
            </p>

            <select
              value={selectedSupport}
              onChange={(e) => setSelectedSupport(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select support staff</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.username} - {u.email}
                </option>
              ))}
            </select>

            {allUsers.length === 0 && (
              <p className="text-red-500 text-sm mt-2">
                No support staff found in your team
              </p>
            )}
          </div>
        )}

        {/* =========================
            ADMIN SUPPORT
        ========================= */}
        {role === "ADMIN" && assignType === "support" && canAssignToSupport && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Support Staff
            </label>
            <select
              value={selectedSupport}
              onChange={(e) => setSelectedSupport(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select support staff</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.username} - {u.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* =========================
            ADMIN TEAM
        ========================= */}
        {role === "ADMIN" && assignType === "team" && canAssignToTeam && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current Assignment Info */}
        <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-gray-600 mb-1">📋 Current Assignment:</p>
          {ticket.assigned_to_name ? (
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Assigned to: {ticket.assigned_to_name}
            </p>
          ) : ticket.team_name ? (
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Team: {ticket.team_name}
            </p>
          ) : (
            <p className="text-yellow-600 flex items-center gap-2">
              ⚠ Not assigned yet
            </p>
          )}
        </div>

        {/* =========================
            ACTION BUTTONS
        ========================= */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !hasAssignPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Assigning..." : "Assign Ticket"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AssignTicketForm;