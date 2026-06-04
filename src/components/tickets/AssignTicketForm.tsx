import React, { useEffect, useState } from "react";
import { assignTicket } from "../../api/ticketApi";
import { getUsers } from "../../api/userApi";
import { getTeams } from "../../api/teamApi";

/* =====================
   TYPES
===================== */
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

/* =====================
   COMPONENT
===================== */
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
  const [agentId, setAgentId] = useState("");
  const [teamId, setTeamId] = useState("");

  /* =====================
     LOAD DATA (FIXED)
  ====================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, teamsRes] = await Promise.all([
          getUsers(),
          getTeams(),
        ]);

        const allUsers: User[] = usersRes.data || [];
        setTeams(teamsRes.data || []);

        // ❌ DO NOT BLOCK if ticket has no team
        const ticketTeamId =
          typeof ticket?.team === "object"
            ? ticket?.team?.id
            : ticket?.team ?? ticket?.team_id;

        let filteredAgents: User[] = [];

        if (ticketTeamId) {
          // filter by team
          filteredAgents = allUsers.filter(
            (u) =>
              u.role === "AGENT" &&
              Number(u.team_id) === Number(ticketTeamId)
          );
        } else {
          // fallback: show ALL agents
          filteredAgents = allUsers.filter((u) => u.role === "AGENT");
        }

        setAgents(filteredAgents);
      } catch (err) {
        console.error("Failed loading assign data", err);
      }
    };

    if (ticket) loadData();
  }, [ticket]);

  /* =====================
     ASSIGN HANDLER
  ====================== */
  const handleAssign = async () => {
    if (loading) return;

    try {
      setLoading(true);

      let payload: any = {};

      if (user.role === "ADMIN") {
        if (mode === "team") {
          if (!teamId) return alert("Select team");

          payload = { team_id: Number(teamId) };
        } else {
          if (!agentId) return alert("Select agent");

          payload = { assigned_to: Number(agentId) };
        }
      }

      if (user.role === "TEAM_LEAD") {
        if (!agentId) return alert("Select agent");

        payload = { assigned_to: Number(agentId) };
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

  /* =====================
     UI
  ====================== */
  return (
    <div className="mt-4 space-y-3">

      <h3 className="text-sm font-semibold text-gray-700">
        Assign Ticket
      </h3>

      {/* MODE */}
      {user.role === "ADMIN" && (
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="agent">Assign to Agent</option>
          <option value="team">Assign to Team</option>
        </select>
      )}

      {/* TEAM */}
      {user.role === "ADMIN" && mode === "team" && (
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      {/* AGENTS */}
      <select
        value={agentId}
        onChange={(e) => setAgentId(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select Agent</option>

        {agents.length === 0 ? (
          <option disabled>No agents found</option>
        ) : (
          agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.first_name} {a.last_name}
            </option>
          ))
        )}
      </select>

      {/* BUTTON */}
      <button
        onClick={handleAssign}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {loading ? "Assigning..." : "Assign Ticket"}
      </button>
    </div>
  );
};

export default AssignTicketForm;