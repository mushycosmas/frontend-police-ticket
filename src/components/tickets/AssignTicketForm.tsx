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
      // Load users
      const usersRes = await getUsers();
      let usersData = [];
      if (Array.isArray(usersRes.data)) {
        usersData = usersRes.data;
      } else if (usersRes.data?.results && Array.isArray(usersRes.data.results)) {
        usersData = usersRes.data.results;
      } else {
        usersData = [];
      }
      
      let agents = [];
      
      // Filter agents based on user role
      if (user.role === "TEAM_LEAD") {
        // Team Lead can only see agents from their team
        const teamId = user.team_id || user.team;
        agents = usersData.filter(
          (u: any) => u.role === "AGENT" && Number(u.team_id) === Number(teamId)
        );
      } else if (user.role === "ADMIN") {
        // Admin can see all agents
        agents = usersData.filter((u: any) => u.role === "AGENT");
      } else {
        agents = [];
      }
      
      setAllUsers(agents);

      // Load teams (only for Admin)
      if (user.role === "ADMIN") {
        const teamsRes = await getTeams();
        let teamsData = [];
        if (Array.isArray(teamsRes.data)) {
          teamsData = teamsRes.data;
        } else if (teamsRes.data?.results && Array.isArray(teamsRes.data.results)) {
          teamsData = teamsRes.data.results;
        } else {
          teamsData = [];
        }
        setTeams(teamsData);
      }
    } catch (error: any) {
      console.error("Failed to load data:", error);
      setError(error.message || "Failed to load data");
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

    try {
      let payload = {};
      let assignedTo = "";
      
      if (assignType === "agent" && selectedAgent) {
        const agent = allUsers.find(u => u.id === parseInt(selectedAgent));
        assignedTo = agent?.full_name || agent?.username || "Agent";
        payload = { assigned_to: parseInt(selectedAgent) };
        await assignTicket(ticketId, payload);
        showToast(`✓ Ticket assigned to ${assignedTo} successfully!`, "success");
      } else if (assignType === "team" && selectedTeam && user.role === "ADMIN") {
        const team = teams.find(t => t.id === parseInt(selectedTeam));
        assignedTo = team?.name || "Team";
        payload = { team_id: parseInt(selectedTeam) };
        await assignTicket(ticketId, payload);
        showToast(`✓ Ticket assigned to ${assignedTo} team successfully!`, "success");
      }
      
      // Delay closing to show toast
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Assignment failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to assign ticket";
      showToast(`✗ ${errorMessage}`, "error");
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
        
        {/* Assign Type Selection - Team Leads can only assign to agents */}
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

        {/* For Team Lead, show agent selection directly */}
        {user.role === "TEAM_LEAD" && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Agent from Your Team
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select an agent from your team --</option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  👤 {user.full_name || user.username} - {user.email}
                </option>
              ))}
            </select>
            {allUsers.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                ⚠ No agents in your team. Please contact admin.
              </p>
            )}
          </div>
        )}

        {/* Agent Selection for Admin */}
        {user.role === "ADMIN" && assignType === "agent" && (
          <div className="animate-fade-in">
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
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  👤 {user.full_name || user.username} - {user.email}
                </option>
              ))}
            </select>
            {allUsers.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                ⚠ No agents available. Please add agents first.
              </p>
            )}
          </div>
        )}

        {/* Team Selection for Admin */}
        {user.role === "ADMIN" && assignType === "team" && (
          <div className="animate-fade-in">
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
              <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                ⚠ No teams available. Please create a team first.
              </p>
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