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
  const [assignType, setAssignType] = useState<"agent" | "team">("agent");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  setLoadingData(true);
  setError(null);

  try {
    const usersRes = await getUsers();

    const usersData =
      usersRes.data?.results ||
      usersRes.data?.data ||
      (Array.isArray(usersRes.data) ? usersRes.data : []);

    console.log("Users:", usersData);

    let agents: any[] = [];

    const currentRole = (
      user.role_name ||
      user.role ||
      ""
    ).toUpperCase();

    if (currentRole === "TEAM_LEAD") {
      const teamId = user.team_id;

      agents = usersData.filter((u: any) => {
        const role = (
          u.role_name ||
          u.role ||
          ""
        ).toUpperCase();

        return (
          role === "AGENT" &&
          Number(u.team_id) === Number(teamId)
        );
      });
    }

    else if (currentRole === "ADMIN") {
      agents = usersData.filter((u: any) => {
        const role = (
          u.role_name ||
          u.role ||
          ""
        ).toUpperCase();

        return role === "AGENT";
      });

      const teamsRes = await getTeams();

      const teamsData =
        teamsRes.data?.results ||
        teamsRes.data?.data ||
        (Array.isArray(teamsRes.data)
          ? teamsRes.data
          : []);

      setTeams(teamsData);
    }

    else if (currentRole === "AGENT") {
      agents = usersData.filter(
        (u: any) => Number(u.id) === Number(user.id)
      );
    }

    setAllUsers(agents);

    if (agents.length > 0) {
      setSelectedAgent(String(agents[0].id));
    }

    console.log("Filtered Agents:", agents);
  } catch (err: any) {
    console.error(err);
    setError(
      err?.response?.data?.message ||
      "Failed to load users"
    );
  } finally {
    setLoadingData(false);
  }
};

  const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const getRole = () => (user.role_name || user.role || "").toString().toUpperCase();
  const currentRole = getRole();

  console.log("=== ASSIGNMENT DEBUG ===");
  console.log("Current Role:", currentRole);
  console.log("Assign Type:", assignType);
  console.log("Selected Agent:", selectedAgent);
  console.log("Selected Team:", selectedTeam);
  console.log("User object:", user);

  try {
    let payload: any = {};

    // =========================
    // ADMIN
    // =========================
    if (currentRole === "ADMIN") {
      if (assignType === "agent") {
        if (!selectedAgent) {
          showToast("Select an agent", "error");
          setLoading(false);
          return;
        }
        payload = {
          type: "agent",
          id: parseInt(selectedAgent),
        };
      } else {
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
    // TEAM LEAD
    // =========================
    else if (currentRole === "TEAM_LEAD") {
      if (!selectedAgent) {
        showToast("Select an agent from your team", "error");
        setLoading(false);
        return;
      }
      payload = {
        type: "agent",
        id: parseInt(selectedAgent),
      };
    }
    // =========================
    // AGENT
    // =========================
    else if (currentRole === "AGENT") {
      payload = {
        type: "agent",
        id: user.id,
      };
    }

    console.log("Final Payload:", payload);
    const response = await assignTicket(ticketId, payload);
    console.log("API Response:", response);

    showToast("✓ Ticket assigned successfully!", "success");
    setTimeout(() => {
      onSuccess?.();
      onClose?.();
    }, 1200);

  } catch (error: any) {
    console.error("Assignment failed:", error);
    console.error("Error response data:", error.response?.data);
    showToast(
      `✗ ${error.response?.data?.message || error.message || "Failed to assign ticket"}`,
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  if (loadingData) {
    return (
      <div className="text-center py-6">
        <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 mt-2">Loading assignment options...</p>
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
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-lg">Assign Ticket</h3>
          <span className="text-xs text-gray-400">#{ticket.ticket_number}</span>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
            <button 
              type="button"
              onClick={loadData}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Assign Type Selection - Admin only */}
        {(user.role === "ADMIN") && (
          <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="agent"
                checked={assignType === "agent"}
                onChange={() => setAssignType("agent")}
                className="cursor-pointer w-4 h-4 text-blue-600"
              />
              <span className="text-sm">👤 Assign to Agent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="team"
                checked={assignType === "team"}
                onChange={() => setAssignType("team")}
                className="cursor-pointer w-4 h-4 text-blue-600"
              />
              <span className="text-sm">👥 Assign to Team</span>
            </label>
          </div>
        )}

        {/* For Team Lead - Show agent selection directly */}
        {user.role === "TEAM_LEAD" && (
          <div className="bg-blue-50 rounded-lg p-3 mb-2">
            <p className="text-sm text-blue-700 mb-2">📋 Your Team Agents</p>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select an agent from your team --</option>
              {allUsers.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  👤 {agent.full_name || agent.username} - {agent.email}
                </option>
              ))}
            </select>
            {allUsers.length === 0 && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                ⚠ No agents found in your team. Please contact admin.
              </p>
            )}
          </div>
        )}

        {/* Agent Selection for Admin */}
        {user.role === "ADMIN" && assignType === "agent" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select an agent --</option>
              {allUsers.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  👤 {agent.full_name || agent.username} - {agent.email}
                </option>
              ))}
            </select>
            {allUsers.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">No agents available</p>
            )}
          </div>
        )}

        {/* Team Selection for Admin */}
        {user.role === "ADMIN" && assignType === "team" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  👥 {team.name} ({team.member_count || 0} members)
                </option>
              ))}
            </select>
            {teams.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">No teams available</p>
            )}
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

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={
              loading || 
              (user.role === "TEAM_LEAD" && !selectedAgent) ||
              (user.role === "ADMIN" && assignType === "agent" && !selectedAgent) ||
              (user.role === "ADMIN" && assignType === "team" && !selectedTeam)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Assigning...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Assign Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default AssignTicketForm;