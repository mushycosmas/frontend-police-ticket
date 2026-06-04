import React, { useEffect, useState } from "react";

import { createTicket } from "../../api/ticketApi";
import { getTeams } from "../../api/teamApi";
import { getUsers } from "../../api/userApi";

type Props = {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
};

type User = {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  team_id?: number;
};

type Team = {
  id: number;
  name: string;
};

const CreateTicketModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [agents, setAgents] = useState<User[]>([]);

  const [mode, setMode] = useState<"agent" | "team">("agent");

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_contact: "",
    channel: "WEB",
    title: "",
    description: "",
    priority: "MEDIUM",
    team: "",
    assigned_to: "",
  });

  // ======================
  // RESET FORM
  // ======================
  useEffect(() => {
    if (show) {
      setFormData({
        customer_name: "",
        customer_contact: "",
        channel: "WEB",
        title: "",
        description: "",
        priority: "MEDIUM",
        team: "",
        assigned_to: "",
      });

      setMode("agent");
    }
  }, [show]);

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsRes, usersRes] = await Promise.all([
          getTeams(),
          getUsers(),
        ]);

        const allTeams: Team[] = teamsRes.data || [];
        const allUsers: User[] = usersRes.data || [];

        setTeams(allTeams);

        if (user.role === "TEAM_LEAD") {
          const teamId = user.team;

          const filtered = allUsers.filter(
            (u) =>
              u.role === "AGENT" &&
              Number(u.team_id) === Number(teamId)
          );

          setAgents(filtered);

          setFormData((prev) => ({
            ...prev,
            team: String(teamId),
          }));
        } else {
          setAgents(allUsers.filter((u) => u.role === "AGENT"));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (show) loadData();
  }, [show]);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.title) {
      alert("Customer name and title required");
      return;
    }

    try {
      setLoading(true);

      let payload: any = { ...formData };

      if (user.role === "ADMIN") {
        if (mode === "team") {
          payload.assigned_to = null;
        }

        if (mode === "agent" && !formData.assigned_to) {
          alert("Select agent");
          return;
        }
      }

      if (user.role === "TEAM_LEAD") {
        if (!formData.assigned_to) {
          alert("Select agent");
          return;
        }

        payload.team = user.team;
      }

      await createTicket(payload);

      onSuccess?.();
      onHide?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-5">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Ticket</h2>

          <button
            onClick={onHide}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-3">

          <input
            className="w-full border rounded px-3 py-2"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
          />

          <input
            className="w-full border rounded px-3 py-2"
            name="customer_contact"
            placeholder="Contact"
            value={formData.customer_contact}
            onChange={handleChange}
          />

          <select
            className="w-full border rounded px-3 py-2"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
          >
            <option value="WEB">WEB</option>
            <option value="EMAIL">EMAIL</option>
            <option value="PHONE">PHONE</option>
            <option value="CHAT">CHAT</option>
          </select>

          <input
            className="w-full border rounded px-3 py-2"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            name="description"
            rows={3}
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <select
            className="w-full border rounded px-3 py-2"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          {/* MODE (ADMIN ONLY) */}
          {user.role === "ADMIN" && (
            <select
              className="w-full border rounded px-3 py-2"
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as "agent" | "team")
              }
            >
              <option value="agent">Assign to Agent</option>
              <option value="team">Assign to Team</option>
            </select>
          )}

          {/* AGENT */}
          {(user.role === "TEAM_LEAD" ||
            (user.role === "ADMIN" && mode === "agent")) && (
            <select
              className="w-full border rounded px-3 py-2"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
            >
              <option value="">Select Agent</option>

              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.first_name} {a.last_name}
                </option>
              ))}
            </select>
          )}

          {/* TEAM */}
          {user.role === "ADMIN" && mode === "team" && (
            <select
              className="w-full border rounded px-3 py-2"
              name="team"
              value={formData.team}
              onChange={handleChange}
            >
              <option value="">Select Team</option>

              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onHide}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTicketModal;