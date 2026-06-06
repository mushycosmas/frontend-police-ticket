import React, { useEffect, useState } from "react";
import { createTicket } from "../../api/ticketApi";
import { getTeams } from "../../api/teamApi";
import { getUsers } from "../../api/userApi";
import { Toast } from "../common/Toast";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  team_id?: number;
  username?: string;
  full_name?: string;
}

interface Team {
  id: number;
  name: string;
  member_count?: number;
}

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  channel: string;
  title: string;
  description: string;
  priority: string;
  team: string;
  assigned_to: string;
}

const CreateTicketModal: React.FC<Props> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const [mode, setMode] = useState<"agent" | "team">("agent");

  const [formData, setFormData] = useState<FormData>({
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

  const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

        // Handle API responses
        let allTeams: Team[] = [];
        if (Array.isArray(teamsRes.data)) {
          allTeams = teamsRes.data;
        } else if (teamsRes.data?.results) {
          allTeams = teamsRes.data.results;
        }

        let allUsers: User[] = [];
        if (Array.isArray(usersRes.data)) {
          allUsers = usersRes.data;
        } else if (usersRes.data?.results) {
          allUsers = usersRes.data.results;
        }

        setTeams(allTeams);

        if (user.role === "TEAM_LEAD") {
          const teamId = user.team_id || user.team;
          const filtered = allUsers.filter(
            (u) =>
              u.role === "AGENT" &&
              Number(u.team_id) === Number(teamId)
          );
          setAgents(filtered);
          setFormData((prev) => ({
            ...prev,
            team: String(teamId || ""),
          }));
        } else if (user.role === "AGENT") {
          // For agents, only show themselves
          const currentAgent = allUsers.filter((u) => u.id === user.id);
          setAgents(currentAgent);
          // Auto-select the agent
          if (currentAgent.length > 0) {
            setFormData((prev) => ({
              ...prev,
              assigned_to: String(currentAgent[0].id),
            }));
          }
        } else {
          setAgents(allUsers.filter((u) => u.role === "AGENT"));
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    if (show) loadData();
  }, [show, user.role, user.team_id, user.team, user.id]);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      showToast("Customer name is required", "error");
      return;
    }
    if (!formData.customer_email) {
      showToast("Customer email is required", "error");
      return;
    }
    if (!formData.title) {
      showToast("Title is required", "error");
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
        assigned_by: user.id, // Track who created/assigned the ticket
      };

      // Handle assignment based on user role
      if (user.role === "ADMIN") {
        if (mode === "agent") {
          if (!formData.assigned_to) {
            showToast("Please select an agent", "error");
            setLoading(false);
            return;
          }
          payload.assigned_to = parseInt(formData.assigned_to);
        } else if (mode === "team") {
          if (!formData.team) {
            showToast("Please select a team", "error");
            setLoading(false);
            return;
          }
          payload.team = parseInt(formData.team);
        }
      }

      if (user.role === "TEAM_LEAD") {
        if (!formData.assigned_to) {
          showToast("Please select an agent", "error");
          setLoading(false);
          return;
        }
        payload.assigned_to = parseInt(formData.assigned_to);
        payload.team = user.team_id || user.team;
      }

      // For AGENT role - auto-assign to themselves (same logic as AssignTicketForm)
      if (user.role === "AGENT" || "Agent") {
        
        payload.assigned_to = user.id;
        // If agent has a team, also assign to that team
        if (user.team_id || user.team) {
          payload.team = user.team_id || user.team;
        }
      }

      console.log("Submitting payload:", payload);

      const response = await createTicket(payload);
      console.log("Ticket created:", response.data);
      
      showToast("✓ Ticket created successfully!", "success");

      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onHide) onHide();
      }, 1500);
    } catch (err: any) {
      console.error("Create ticket error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create ticket";
      showToast(`✗ ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const getUserDisplayName = (user: User) => {
    return user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email;
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onHide}>
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Create Ticket</h2>
            <button
              onClick={onHide}
              className="text-gray-500 hover:text-black text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="customer_name"
                placeholder="Enter customer name"
                value={formData.customer_name}
                onChange={handleChange}
              />
            </div>

            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="customer_email"
                type="email"
                placeholder="customer@example.com"
                value={formData.customer_email}
                onChange={handleChange}
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone (Optional)</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="customer_phone"
                placeholder="+255 123 456 789"
                value={formData.customer_phone}
                onChange={handleChange}
              />
            </div>

            {/* Channel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="channel"
                value={formData.channel}
                onChange={handleChange}
              >
                <option value="WEB">🌐 Web Form</option>
                <option value="EMAIL">📧 Email</option>
                <option value="PHONE">📞 Phone</option>
                <option value="CHAT">💬 Chat</option>
                <option value="WALKIN">🚶 Walk-in</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="description"
                rows={4}
                placeholder="Detailed description of the issue..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="CRITICAL">🔴 Critical</option>
              </select>
            </div>

            {/* MODE (ADMIN ONLY) */}
            {user.role === "ADMIN" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "agent" | "team")}
                >
                  <option value="agent">👤 Assign to Agent</option>
                  <option value="team">👥 Assign to Team</option>
                </select>
              </div>
            )}

            {/* AGENT SELECT (for Admin and Team Lead) */}
            {(user.role === "TEAM_LEAD" || (user.role === "ADMIN" && mode === "agent")) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {user.role === "TEAM_LEAD" ? "Select Agent from Your Team" : "Select Agent"}
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                >
                  <option value="">-- Select an agent --</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {getUserDisplayName(agent)} - {agent.email}
                    </option>
                  ))}
                </select>
                {agents.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-1">No agents available</p>
                )}
              </div>
            )}

            {/* TEAM SELECT (ADMIN ONLY) */}
            {user.role === "ADMIN" && mode === "team" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Team</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
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

            {/* Info for Agent - Same logic as AssignTicketForm */}
            {user.role === "AGENT" && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  This ticket will be automatically assigned to you upon creation.
                </p>
              </div>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onHide}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTicketModal;