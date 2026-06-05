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
  email: string;
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
    customer_email: "",
    customer_phone: "",
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
        customer_email: "",
        customer_phone: "",
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
  }, [show, user.role, user.team]);

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
    // Validation
    if (!formData.customer_name) {
      alert("Customer name is required");
      return;
    }
    if (!formData.customer_email) {
      alert("Customer email is required");
      return;
    }
    if (!formData.title) {
      alert("Title is required");
      return;
    }

    try {
      setLoading(true);

      // Prepare payload for API
      const payload: any = {
        title: formData.title,
        description: formData.description,
        channel: formData.channel,
        priority: formData.priority,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || "Not Provided",
      };

      // Handle assignment based on user role
      if (user.role === "ADMIN") {
        if (mode === "agent") {
          if (!formData.assigned_to) {
            alert("Please select an agent");
            setLoading(false);
            return;
          }
          payload.assigned_to = parseInt(formData.assigned_to);
        } else if (mode === "team") {
          if (!formData.team) {
            alert("Please select a team");
            setLoading(false);
            return;
          }
          payload.team = parseInt(formData.team);
        }
      }

      if (user.role === "TEAM_LEAD") {
        if (!formData.assigned_to) {
          alert("Please select an agent");
          setLoading(false);
          return;
        }
        payload.assigned_to = parseInt(formData.assigned_to);
        payload.team = user.team;
      }

      console.log("Submitting payload:", payload);

      await createTicket(payload);

      onSuccess?.();
      onHide?.();
    } catch (err: any) {
      console.error("Create ticket error:", err);
      alert(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-5 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Ticket</h2>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-3">
          {/* Customer Name */}
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="customer_name"
            placeholder="Customer Name *"
            value={formData.customer_name}
            onChange={handleChange}
          />

          {/* Customer Email */}
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="customer_email"
            type="email"
            placeholder="Customer Email *"
            value={formData.customer_email}
            onChange={handleChange}
          />

          {/* Customer Phone */}
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="customer_phone"
            placeholder="Customer Phone (Optional)"
            value={formData.customer_phone}
            onChange={handleChange}
          />

          {/* Channel */}
          <select
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
          >
            <option value="WEB">Web Form</option>
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
            <option value="CHAT">Chat</option>
            <option value="WALKIN">Walk-in</option>
          </select>

          {/* Title */}
          <input
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="title"
            placeholder="Title *"
            value={formData.title}
            onChange={handleChange}
          />

          {/* Description */}
          <textarea
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="description"
            rows={3}
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* Priority */}
          <select
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* MODE (ADMIN ONLY) */}
          {user.role === "ADMIN" && (
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={mode}
              onChange={(e) => setMode(e.target.value as "agent" | "team")}
            >
              <option value="agent">Assign to Agent</option>
              <option value="team">Assign to Team</option>
            </select>
          )}

          {/* AGENT SELECT */}
          {(user.role === "TEAM_LEAD" || (user.role === "ADMIN" && mode === "agent")) && (
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
            >
              <option value="">Select Agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.first_name} {a.last_name} ({a.email})
                </option>
              ))}
            </select>
          )}

          {/* TEAM SELECT (ADMIN ONLY) */}
          {user.role === "ADMIN" && mode === "team" && (
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;