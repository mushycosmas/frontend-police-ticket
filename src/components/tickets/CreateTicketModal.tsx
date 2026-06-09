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
  role?: number | string | { id: number; name: string };
  role_name?: string;
  team_id?: number;
  team?: number;
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
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  // Helper function to get user role as string
  const getUserRole = (user: any): string => {
    if (!user) return "";
    
    // If role_name exists (from your API)
    if (user.role_name) {
      return user.role_name.toUpperCase();
    }
    
    // If role is an object with name property
    if (user.role && typeof user.role === 'object' && user.role.name) {
      return user.role.name.toUpperCase();
    }
    
    // If role is a string
    if (user.role && typeof user.role === 'string') {
      return user.role.toUpperCase();
    }
    
    return "";
  };

  const userRole = getUserRole(userData);

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

        // Handle teams response - your API returns { count, page, results, etc. }
        let allTeams: Team[] = [];
        if (teamsRes?.results && Array.isArray(teamsRes.results)) {
          // Format: { count, page, page_size, total_pages, results: [...] }
          allTeams = teamsRes.results;
        } else if (Array.isArray(teamsRes)) {
          // Format: direct array
          allTeams = teamsRes;
        } else if (teamsRes?.data?.results) {
          allTeams = teamsRes.data.results;
        } else if (Array.isArray(teamsRes?.data)) {
          allTeams = teamsRes.data;
        }

        // Handle users response - your API returns direct array
        let allUsers: User[] = [];
        if (Array.isArray(usersRes)) {
          // Format: direct array
          allUsers = usersRes;
        } else if (usersRes?.results && Array.isArray(usersRes.results)) {
          // Format: { results: [...] }
          allUsers = usersRes.results;
        } else if (usersRes?.data?.results) {
          allUsers = usersRes.data.results;
        } else if (Array.isArray(usersRes?.data)) {
          allUsers = usersRes.data;
        }

        console.log("Teams loaded:", allTeams);
        console.log("Users loaded:", allUsers);
        console.log("Current user:", userData);
        console.log("User role:", userRole);

        setTeams(allTeams);

        // Helper to check if user is an agent
        const isAgent = (user: User): boolean => {
          // Check by role_name first
          if (user.role_name) {
            return user.role_name.toUpperCase() === "AGENT";
          }
          // Check by role object/string
          if (user.role) {
            if (typeof user.role === 'object' && user.role.name) {
              return user.role.name.toUpperCase() === "AGENT";
            }
            if (typeof user.role === 'string') {
              return user.role.toUpperCase() === "AGENT";
            }
          }
          return false;
        };

        // Helper to get user's team ID
        const getUserTeamId = (user: any): number | null => {
          return user.team_id || user.team || null;
        };

        if (userRole === "TEAM_LEAD") {
          // Get the team ID
          const teamId = getUserTeamId(userData);
          console.log("Team Lead - Team ID:", teamId);
          
          // Filter agents belonging to the team lead's team
          const filteredAgents = allUsers.filter((u) => {
            const agent = isAgent(u);
            const userTeamId = getUserTeamId(u);
            return agent && Number(userTeamId) === Number(teamId);
          });
          
          console.log("Filtered agents for team lead:", filteredAgents);
          setAgents(filteredAgents);
          
          // Auto-select team for team lead
          if (teamId) {
            setFormData((prev) => ({
              ...prev,
              team: String(teamId),
            }));
          }
          
          if (filteredAgents.length === 0) {
            showToast("No agents found in your team. Please contact admin.", "warning");
          }
        } else if (userRole === "AGENT") {
          // For agents, only show themselves
          const currentAgent = allUsers.filter((u) => u.id === userData.id);
          setAgents(currentAgent);
          // Auto-select the agent
          if (currentAgent.length > 0) {
            setFormData((prev) => ({
              ...prev,
              assigned_to: String(currentAgent[0].id),
            }));
          }
        } else if (userRole === "ADMIN") {
          // For ADMIN, show all agents
          const allAgents = allUsers.filter((u) => isAgent(u));
          console.log("All agents for admin:", allAgents);
          setAgents(allAgents);
        } else {
          setAgents([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        showToast("Failed to load data. Please refresh the page.", "error");
      }
    };

    if (show) loadData();
  }, [show, userData, userRole]);

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
        assigned_by: userData.id,
      };

      // Helper to check user role
      const hasRole = (roleName: string): boolean => {
        if (userData.role_name) {
          return userData.role_name.toUpperCase() === roleName.toUpperCase();
        }
        if (userData.role) {
          if (typeof userData.role === 'object' && userData.role.name) {
            return userData.role.name.toUpperCase() === roleName.toUpperCase();
          }
          if (typeof userData.role === 'string') {
            return userData.role.toUpperCase() === roleName.toUpperCase();
          }
        }
        return false;
      };

      // Get user's team ID
      const getUserTeamId = (): number | null => {
        return userData.team_id || userData.team || null;
      };

      // Handle assignment based on user role
      if (hasRole("ADMIN")) {
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
      } else if (hasRole("TEAM_LEAD")) {
        if (!formData.assigned_to) {
          showToast("Please select an agent from your team", "error");
          setLoading(false);
          return;
        }
        payload.assigned_to = parseInt(formData.assigned_to);
        // Team lead's team is automatically set
        const teamId = getUserTeamId();
        if (teamId) {
          payload.team = parseInt(String(teamId));
        }
      } else if (hasRole("AGENT")) {
        // For AGENT role - auto-assign to themselves
        payload.assigned_to = userData.id;
        // If agent has a team, also assign to that team
        const teamId = getUserTeamId();
        if (teamId) {
          payload.team = teamId;
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

  // Helper to check user role for rendering
  const hasRoleForRender = (roleName: string): boolean => {
    if (userData.role_name) {
      return userData.role_name.toUpperCase() === roleName.toUpperCase();
    }
    if (userData.role) {
      if (typeof userData.role === 'object' && userData.role.name) {
        return userData.role.name.toUpperCase() === roleName.toUpperCase();
      }
      if (typeof userData.role === 'string') {
        return userData.role.toUpperCase() === roleName.toUpperCase();
      }
    }
    return false;
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
            {hasRoleForRender("ADMIN") && (
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

            {/* For Team Lead - Show agent selection directly */}
            {hasRoleForRender("TEAM_LEAD") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Agent from Your Team
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select an agent from your team --</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      👤 {getUserDisplayName(agent)} - {agent.email}
                    </option>
                  ))}
                </select>
                {agents.length === 0 && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    ⚠ No agents found in your team. Please contact admin.
                  </p>
                )}
              </div>
            )}

            {/* Agent Selection for Admin */}
            {hasRoleForRender("ADMIN") && mode === "agent" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Agent</label>
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

            {/* Team Selection for Admin */}
            {hasRoleForRender("ADMIN") && mode === "team" && (
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

            {/* Info for Agent */}
            {hasRoleForRender("AGENT") && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  This ticket will be automatically assigned to you upon creation.
                </p>
              </div>
            )}

            {/* Team Lead Info */}
            {hasRoleForRender("TEAM_LEAD") && (
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-purple-700 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Tickets created by you will be assigned to your team and the selected agent.
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
              disabled={loading || (hasRoleForRender("TEAM_LEAD") && !formData.assigned_to)}
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