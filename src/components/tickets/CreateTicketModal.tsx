// src/components/modals/CreateTicketModal.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { createTicket } from "../../api/ticketApi";
import { getTeams } from "../../api/teamApi";
import { getUsers } from "../../api/userApi";
import { useChannels } from "../../hooks/useChannels";
import { useCategories } from "../../hooks/useCategories";
import { Toast } from "../common/Toast";
import {
  User,
  Team,
  TicketPriority,
  TicketChannel,
  CreateTicketData,
} from "../../types/tickets/tickets.types";

interface Props {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

// Form data specific to this modal (not shared elsewhere)
interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_nida: string;
  customer_gender: string;
  channel_id: string;
  category_id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  team: string;
  assigned_to: string;
}

const CreateTicketModal: React.FC<Props> = ({ show, onHide, onSuccess }) => {
  const userDataRef = useRef(JSON.parse(localStorage.getItem("user") || "{}"));
  const userData = userDataRef.current;
  const hasLoadedRef = useRef(false);

  const getUserRole = useCallback((user: any): string => {
    if (!user) return "";
    if (user.role_name) return user.role_name.toUpperCase();
    if (user.role && typeof user.role === "object" && user.role.name)
      return user.role.name.toUpperCase();
    if (user.role && typeof user.role === "string") return user.role.toUpperCase();
    return "";
  }, []);

  const getUserTeamId = useCallback((user: any): number | null => {
    if (!user) return null;
    const teamId = user.team_id || user.team || user.teamId || null;
    return teamId ? Number(teamId) : null;
  }, []);

  const getUserTeamName = useCallback((user: any): string | null => {
    if (!user) return null;
    return user.team_name || user.teamName || null;
  }, []);

  const userRole = getUserRole(userData);
  const userTeamId = getUserTeamId(userData);
  const userTeamName = getUserTeamName(userData);

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const [mode, setMode] = useState<"agent" | "team">("agent");

  const { channels, loading: channelsLoading } = useChannels();
  const { categories, loading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState<FormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_nida: "",
    customer_gender: "",
    channel_id: "",
    category_id: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    team: "",
    assigned_to: "",
  });

  const showToast = useCallback((message: string, type: "success" | "error" | "info" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_nida: "",
        customer_gender: "",
        channel_id: "",
        category_id: "",
        title: "",
        description: "",
        priority: "MEDIUM",
        team: "",
        assigned_to: "",
      });
      setMode("agent");
      hasLoadedRef.current = false;
    }
  }, [show]);

  // Auto-select first channel when channels are loaded
  useEffect(() => {
    if (channels.length && !formData.channel_id) {
      setFormData(prev => ({ ...prev, channel_id: String(channels[0].id) }));
    }
  }, [channels, formData.channel_id]);

  // Load teams and agents only once
  useEffect(() => {
    if (!show) return;
    if (hasLoadedRef.current) return;

    const loadTeamsAndAgents = async () => {
      try {
        const [teamsRes, usersRes] = await Promise.all([getTeams(), getUsers()]);
        const extractArray = (res: any): any[] => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.results) return res.results;
          if (res.data?.results) return res.data.results;
          if (res.data && Array.isArray(res.data)) return res.data;
          return [];
        };
        const allTeams = extractArray(teamsRes);
        const allUsers = extractArray(usersRes);
        setTeams(allTeams);

        // ✅ Only AGENT and SUPPORT can be assigned to (NOT TEAM_LEAD)
        const isAssignable = (u: User): boolean => {
          const role = u.role_name || (typeof u.role === "object" ? u.role?.name : u.role);
          const upperRole = role?.toUpperCase();
          return ["AGENT", "SUPPORT"].includes(upperRole);
        };
        
        const getUserTeamIdFromUser = (u: any) => u.team_id || u.team || u.teamId || null;
        const getUserTeamNameFromUser = (u: any) => u.team_name || u.teamName || null;

        console.log("🔍 CreateTicketModal - User Data:", {
          userRole,
          userTeamId,
          userTeamName,
          userData
        });

        if (userRole === "TEAM_LEAD") {
          // ✅ More robust filtering - check by team_id OR team_name
          const filtered = allUsers.filter(u => {
            const uRole = getUserRole(u);
            const uTeamId = getUserTeamIdFromUser(u);
            const uTeamName = getUserTeamNameFromUser(u);
            const isSelf = u.id === userData.id;
            
            // Check if user is AGENT or SUPPORT
            const isAssignableRole = ["AGENT", "SUPPORT"].includes(uRole);
            
            // Check if same team (by ID or name)
            const isSameTeam = 
              (userTeamId && uTeamId && Number(uTeamId) === Number(userTeamId)) ||
              (userTeamName && uTeamName && uTeamName.toLowerCase() === userTeamName.toLowerCase());
            
            // Log for debugging
            console.log(`🔍 Checking user: ${u.full_name || u.username}`, {
              role: uRole,
              isAssignableRole,
              userTeamId,
              uTeamId,
              userTeamName,
              uTeamName,
              isSameTeam,
              isSelf
            });
            
            return isAssignableRole && isSameTeam && !isSelf;
          });
          
          setAgents(filtered);
          
          // Auto-select team
          if (userTeamId) {
            setFormData(prev => ({ ...prev, team: String(userTeamId) }));
          }
          
          // Auto-select first agent if available
          if (filtered.length > 0) {
            setFormData(prev => ({ ...prev, assigned_to: String(filtered[0].id) }));
          }
          
          if (filtered.length === 0) {
            console.warn("⚠️ No agents found for team lead", {
              userTeamId,
              userTeamName,
              allUsers: allUsers.map(u => ({
                name: u.full_name || u.username,
                role: getUserRole(u),
                team_id: getUserTeamIdFromUser(u),
                team_name: getUserTeamNameFromUser(u)
              }))
            });
            showToast("No agents or support staff found in your team", "warning");
          }
        } else if (userRole === "AGENT" || userRole === "SUPPORT") {
          const current = allUsers.filter(u => u.id === userData.id);
          setAgents(current);
          if (current.length) {
            setFormData(prev => ({ ...prev, assigned_to: String(current[0].id) }));
          }
          if (userTeamId) {
            setFormData(prev => ({ ...prev, team: String(userTeamId) }));
          }
        } else if (userRole === "ADMIN") {
          // ✅ Admin can assign to AGENT and SUPPORT (not TEAM_LEAD)
          setAgents(allUsers.filter(isAssignable));
        } else {
          setAgents([]);
        }
        hasLoadedRef.current = true;
      } catch (err) {
        console.error(err);
        showToast("Failed to load teams/agents", "error");
      }
    };
    loadTeamsAndAgents();
  }, [show, userRole, userTeamId, userTeamName, userData, showToast]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!formData.customer_name) return showToast("Customer name is required", "error");
    if (!formData.customer_email) return showToast("Customer email is required", "error");
    if (!formData.title) return showToast("Title is required", "error");
    if (!formData.channel_id) return showToast("Please select a channel", "error");

    setLoading(true);
    const payload: CreateTicketData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      channel: formData.channel_id as TicketChannel,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone || "Not Provided",
      customer_nida: formData.customer_nida || undefined,
      customer_gender: formData.customer_gender || undefined,
      category: formData.category_id ? parseInt(formData.category_id) : undefined,
      assigned_by: userData.id,
    };
    
    const hasRole = (roleName: string): boolean => {
      const r = userData.role_name || (typeof userData.role === "object" ? userData.role?.name : userData.role);
      return r?.toUpperCase() === roleName.toUpperCase();
    };
    const getUserTeamIdFromData = () => userData.team_id || userData.team || null;

    if (hasRole("ADMIN")) {
      if (mode === "agent" || mode === "team") {
        if (formData.assigned_to) {
          payload.assigned_to = parseInt(formData.assigned_to);
        } else if (mode === "agent") {
          return showToast("Select an agent", "error");
        }
        
        if (formData.team) {
          payload.team = parseInt(formData.team);
        } else if (mode === "team") {
          return showToast("Select a team", "error");
        }
      }
      
    } else if (hasRole("TEAM_LEAD")) {
      if (!formData.assigned_to) {
        return showToast("Select an agent from your team", "error");
      }
      payload.assigned_to = parseInt(formData.assigned_to);
      
      const teamId = getUserTeamIdFromData();
      if (teamId) {
        payload.team = teamId;
      }
      
    } else if (hasRole("AGENT") || hasRole("SUPPORT")) {
      payload.assigned_to = userData.id;
      
      const teamId = getUserTeamIdFromData();
      if (teamId) {
        payload.team = teamId;
      }
    }

    try {
      await createTicket(payload);
      showToast("✓ Ticket created successfully!", "success");
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onHide();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      showToast(`✗ ${err.response?.data?.message || err.message || "Failed to create ticket"}`, "error");
    } finally {
      setLoading(false);
    }
  }, [formData, mode, userData, showToast, onSuccess, onHide]);

  const getUserDisplayName = useCallback((user: User) => {
    return user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email;
  }, []);

  const hasRoleForRender = useCallback((roleName: string): boolean => {
    const r = userData.role_name || (typeof userData.role === "object" ? userData.role?.name : userData.role);
    return r?.toUpperCase() === roleName.toUpperCase();
  }, [userData]);

  if (!show) return null;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onHide}>
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Create Ticket</h2>
            <button onClick={onHide} className="text-gray-500 hover:text-black">✕</button>
          </div>

          {/* ✅ TWO COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LEFT COLUMN - Customer Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Customer Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Customer Email *</label>
                <input name="customer_email" type="email" value={formData.customer_email} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Customer Phone (Optional)</label>
                <input name="customer_phone" placeholder="+255..." value={formData.customer_phone} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">NIDA Number (Optional)</label>
                <input name="customer_nida" value={formData.customer_nida} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gender (Optional)</label>
                <select name="customer_gender" value={formData.customer_gender} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">-- Select gender --</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                
                </select>
              </div>
            </div>

            {/* RIGHT COLUMN - Ticket Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Ticket Details</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Channel *</label>
                <select name="channel_id" value={formData.channel_id} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">-- Select channel --</option>
                  {channels.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                </select>
                {channelsLoading && <p className="text-xs text-gray-500 mt-1">Loading channels...</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category (Optional)</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="">-- No category --</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                {categoriesLoading && <p className="text-xs text-gray-500 mt-1">Loading categories...</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HIGH">🟠 High</option>
                  <option value="CRITICAL">🔴 Critical</option>
                </select>
              </div>
            </div>

            {/* DESCRIPTION - Full Width */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
            </div>

            {/* ASSIGNMENT - Full Width */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-3">Assignment</h3>
              
              <div className="space-y-3">
                {/* Assignment Type - Admin only */}
                {hasRoleForRender("ADMIN") && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Assignment Type</label>
                    <select className="w-full border rounded px-3 py-2 text-sm" value={mode} onChange={e => setMode(e.target.value as "agent" | "team")}>
                      <option value="agent">👤 Assign to Agent</option>
                      <option value="team">👥 Assign to Team</option>
                    </select>
                  </div>
                )}

                {/* Team Lead Assignment */}
                {hasRoleForRender("TEAM_LEAD") && (
                  <div>
                    <div className="bg-purple-50 p-2 rounded mb-3">
                      <p className="text-sm text-purple-700">
                        📋 Your Team: {userTeamName || userTeamId || "Not set"}
                      </p>
                    </div>
                    
                    <label className="block text-sm font-medium mb-1">Select Agent from Your Team</label>
                    <select name="assigned_to" value={formData.assigned_to} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                      <option value="">-- Select agent --</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>
                          {getUserDisplayName(a)} {a.role_name && `(${a.role_name})`}
                          {a.team_name && ` - ${a.team_name}`}
                        </option>
                      ))}
                    </select>
                    {agents.length === 0 && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-600 text-sm font-medium">
                          No agents or support staff found in your team
                        </p>
                        <p className="text-xs text-red-500 mt-1">
                          Team ID: {userTeamId || "Not set"} | 
                          Team Name: {userTeamName || "Not set"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Please contact admin to add team members or check your team assignment.
                        </p>
                      </div>
                    )}
                    <div className="bg-purple-50 p-2 rounded mt-2">
                      <p className="text-sm text-purple-700">Ticket will be assigned to your team and the selected agent.</p>
                    </div>
                  </div>
                )}

                {/* Admin - Agent Mode */}
                {hasRoleForRender("ADMIN") && mode === "agent" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Agent</label>
                    <select name="assigned_to" value={formData.assigned_to} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                      <option value="">-- Select agent --</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>
                          {getUserDisplayName(a)} {a.role_name && `(${a.role_name})`}
                        </option>
                      ))}
                    </select>
                    
                    {/* Optional Team selection for admin */}
                    {teams.length > 0 && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Also assign to Team (Optional)</label>
                        <select name="team" value={formData.team} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                          <option value="">-- Select team --</option>
                          {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.member_count || 0})</option>)}
                        </select>
                      </div>
                    )}
                    <p className="text-xs text-green-600 mt-1">💡 You can assign both agent and team simultaneously</p>
                  </div>
                )}

                {/* Admin - Team Mode */}
                {hasRoleForRender("ADMIN") && mode === "team" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Team</label>
                    <select name="team" value={formData.team} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                      <option value="">-- Select team --</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.member_count || 0})</option>)}
                    </select>
                    
                    {/* Optional Agent selection for admin */}
                    {agents.length > 0 && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Also assign to Agent (Optional)</label>
                        <select name="assigned_to" value={formData.assigned_to} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm">
                          <option value="">-- Select agent --</option>
                          {agents.map(a => (
                            <option key={a.id} value={a.id}>
                              {getUserDisplayName(a)} {a.role_name && `(${a.role_name})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <p className="text-xs text-green-600 mt-1">💡 You can assign both team and agent simultaneously</p>
                  </div>
                )}

                {/* Agent/Support Auto-assign */}
                {hasRoleForRender("AGENT") && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-700">Ticket will be assigned to you and your team automatically.</p>
                  </div>
                )}
                {hasRoleForRender("SUPPORT") && (
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-green-700">Ticket will be assigned to you and your team automatically.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button onClick={onHide} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (hasRoleForRender("TEAM_LEAD") && !formData.assigned_to)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTicketModal;