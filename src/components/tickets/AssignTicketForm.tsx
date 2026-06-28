// components/tickets/AssignTicketForm.tsx
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
  const [agents, setAgents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // =========================
  // PERMISSION CHECKS
  // =========================
  const userPermissions = user.permissions || [];
  
  const canAssignToAgent = userPermissions.includes('assign_ticket_to_agent') || 
                           userPermissions.includes('assign_ticket_to_support');
  
  const canAssignToTeam = userPermissions.includes('assign_ticket_to_team');
  const hasAssignPermission = canAssignToAgent || canAssignToTeam;

  // Get user role
  const userRole = (user.role_name || user.role || "").toUpperCase();
  const isTeamLead = userRole === "TEAM_LEAD";
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
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
      
      console.log("Users Response:", usersRes.data);

      // Extract users from response
      let usersData: any[] = [];
      
      if (usersRes.data?.results && Array.isArray(usersRes.data.results)) {
        usersData = usersRes.data.results;
      } else if (usersRes.data?.data && Array.isArray(usersRes.data.data)) {
        usersData = usersRes.data.data;
      } else if (Array.isArray(usersRes.data)) {
        usersData = usersRes.data;
      } else {
        usersData = [];
      }

      console.log("Users Data:", usersData);
      console.log("Current User:", user);
      console.log("User Role:", userRole);
      console.log("Is Team Lead:", isTeamLead);
      console.log("User Team ID:", user.team_id);

      // =========================
      // FILTER AGENTS/SUPPORT BASED ON ROLE
      // =========================
      let filteredUsers: any[] = [];

      if (isAdmin) {
        // ✅ ADMIN: See all AGENT and SUPPORT users
        filteredUsers = usersData.filter((u: any) => {
          const uRole = (u.role_name || u.role || "").toUpperCase();
          return uRole === "AGENT" || uRole === "SUPPORT";
        });
        console.log("Admin - All agents/support:", filteredUsers);
      } 
      else if (isTeamLead) {
        // ✅ TEAM LEAD: See only AGENT and SUPPORT users in their team
        const teamId = user.team_id;
        const teamName = user.team_name;

        filteredUsers = usersData.filter((u: any) => {
          const uRole = (u.role_name || u.role || "").toUpperCase();
          const isInTeam = u.team_id === teamId || u.team_name === teamName;
          const isAssignableRole = uRole === "AGENT" || uRole === "SUPPORT";
          
          // Also include the team lead themselves if they want to assign to themselves
          const isSelf = u.id === user.id;
          
          return isInTeam && (isAssignableRole || isSelf);
        });
        
        console.log(`Team Lead - Users in team ${teamName || teamId}:`, filteredUsers);
        
        if (filteredUsers.length === 0) {
          console.warn("No agents or support staff found in team");
        }
      } 
      else {
        // ✅ AGENT/SUPPORT: See only themselves
        filteredUsers = usersData.filter((u: any) => u.id === user.id);
      }

      // Sort users by name
      filteredUsers.sort((a, b) => {
        const nameA = (a.full_name || a.username || "").toLowerCase();
        const nameB = (b.full_name || b.username || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });

      setAgents(filteredUsers);

      // Load teams if permission exists
      if (canAssignToTeam) {
        const teamsRes = await getTeams();
        
        let teamsData: any[] = [];
        if (teamsRes.data?.results && Array.isArray(teamsRes.data.results)) {
          teamsData = teamsRes.data.results;
        } else if (teamsRes.data?.data && Array.isArray(teamsRes.data.data)) {
          teamsData = teamsRes.data.data;
        } else if (Array.isArray(teamsRes.data)) {
          teamsData = teamsRes.data;
        }
        
        setTeams(teamsData);
      }

      // Auto-select first agent if available
      if (filteredUsers.length > 0) {
        setSelectedAgent(String(filteredUsers[0].id));
      }
    } catch (err: any) {
      console.error("Load data error:", err);
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

      if (assignType === "agent") {
        if (!canAssignToAgent) {
          showToast("You don't have permission to assign to agents", "error");
          setLoading(false);
          return;
        }

        if (!selectedAgent) {
          showToast("Select an agent", "error");
          setLoading(false);
          return;
        }

        payload = {
          type: "agent",
          id: parseInt(selectedAgent),
        };
      } else if (assignType === "team") {
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
            #{ticket?.ticket_number || ticketId}
          </span>
        </div>

        {/* TEAM INFO - Show for Team Lead */}
        {isTeamLead && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <span>👥</span>
              <span>
                <strong>Your Team:</strong> {user.team_name || 'No team assigned'}
              </span>
              <span className="ml-2 text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                {agents.length} members
              </span>
            </p>
          </div>
        )}

        {/* PERMISSION INFO */}
        <div className="text-xs bg-gray-50 p-2 rounded border">
          <span className="text-gray-600">Your permissions: </span>
          {canAssignToAgent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">
              👤 Agent/Support
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
            ASSIGNMENT TYPE SELECTOR
        ========================= */}
        {canAssignToAgent && canAssignToTeam && (
          <div className="flex gap-6 p-4 bg-gray-50 border rounded-xl">
            {canAssignToAgent && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={assignType === "agent"}
                  onChange={() => setAssignType("agent")}
                />
                👤 Agent/Support
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
            AGENT SELECT
        ========================= */}
        {assignType === "agent" && canAssignToAgent && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {isTeamLead ? 'Select Team Member' : 'Select Agent'}
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select {isTeamLead ? 'team member' : 'agent'}</option>
              {agents.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.username} 
                  {u.role_name ? ` (${u.role_name})` : ''}
                  {u.team_name ? ` - ${u.team_name}` : ''}
                  {u.id === user.id ? " (You)" : ""}
                </option>
              ))}
            </select>
            {agents.length === 0 && (
              <p className="text-red-500 text-sm mt-2">
                {isTeamLead 
                  ? 'No agents or support staff found in your team'
                  : 'No agents available for assignment'}
              </p>
            )}
          </div>
        )}

        {/* =========================
            TEAM SELECT
        ========================= */}
        {assignType === "team" && canAssignToTeam && (
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
                  {t.name} ({t.member_count || 0} members)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current Assignment Info */}
        <div className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-gray-600 mb-1">📋 Current Assignment:</p>
          {ticket?.assigned_to_name ? (
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Assigned to: {ticket.assigned_to_name}
            </p>
          ) : ticket?.team_name ? (
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