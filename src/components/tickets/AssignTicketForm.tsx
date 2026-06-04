import React, { useEffect, useState } from "react";
import { assignTicket } from "../../api/ticketApi";
import { getUsers } from "../../api/userApi";
import { getTeams } from "../../api/teamApi";

/**
 * =====================
 * TYPES
 * =====================
 */

type UserRole = "ADMIN" | "TEAM_LEAD" | "AGENT";

interface User {
  id: number;
  role: UserRole;
  team_id?: number;
  first_name?: string;
  last_name?: string;
}

interface Team {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  team_id?: number;
  team?: { id: number } | number;
}

interface Props {
  ticket: Ticket;
  ticketId: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

type Mode = "agent" | "team";

const AssignTicketForm: React.FC<Props> = ({
  ticket,
  ticketId,
  onSuccess,
  onClose,
}) => {
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  const [agents, setAgents] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<Mode>("agent");
  const [agentId, setAgentId] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("");

  // =====================
  // LOAD DATA
  // =====================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, teamsRes] = await Promise.all([
          getUsers(),
          getTeams(),
        ]);

        const allUsers: User[] = usersRes.data;

        const ticketTeamId =
          typeof ticket.team === "object"
            ? ticket.team?.id
            : ticket.team ?? ticket.team_id;

        if (!ticketTeamId) return;

        const teamAgents = allUsers.filter(
          (u) => u.role === "AGENT" && Number(u.team_id) === Number(ticketTeamId)
        );

        setAgents(teamAgents);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error("Failed loading assign data", err);
      }
    };

    if (ticket) loadData();
  }, [ticket]);

  // =====================
  // ASSIGN HANDLER
  // =====================
  const handleAssign = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let payload: any = {};

      if (user.role === "ADMIN") {
        if (mode === "team") {
          if (!teamId) return alert("Select team");

          payload = {
            team_id: Number(teamId),
          };
        } else {
          if (!agentId) return alert("Select agent");

          payload = {
            assigned_to: Number(agentId),
          };
        }
      }

      if (user.role === "TEAM_LEAD") {
        if (!agentId) return alert("Select agent");

        payload = {
          assigned_to: Number(agentId),
        };
      }

      await assignTicket(ticketId, payload);

      setAgentId("");
      setTeamId("");

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="mt-4 space-y-3">

      <h3 className="text-sm font-semibold text-gray-700">
        Assign Ticket
      </h3>

      {/* MODE (ADMIN ONLY) */}
      {user.role === "ADMIN" && (
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="agent">Assign to Agent</option>
          <option value="team">Assign to Team</option>
        </select>
      )}

      {/* TEAM SELECT */}
      {user.role === "ADMIN" && mode === "team" && (
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Team</option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      )}

      {/* AGENT SELECT */}
      {(mode === "agent" || user.role === "TEAM_LEAD") && (
        <select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Agent</option>

          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.first_name} {agent.last_name}
            </option>
          ))}
        </select>
      )}

      {/* BUTTON */}
      <button
        onClick={handleAssign}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Assigning...
          </>
        ) : (
          "Assign Ticket"
        )}
      </button>
    </div>
  );
};

export default AssignTicketForm;