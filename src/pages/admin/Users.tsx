import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  getUsers,
  deleteUser,
  resetUserPassword,
  getUserTickets,
  getUserStats,
  getTeams,
  createUser,
} from "../../api/userApi";
import { fetchHRMISUser } from "../../api/hrmisAip"; // Fixed: changed from hrmisAip to hrmisApi
import UserTable from "../../components/users/UserTable";
import UserFormModal from "../../components/users/UserFormModal";
import ConfirmDeleteModal from "../../components/users/ConfirmDeleteModal";
import UserDetailModal from "../../components/users/UserDetailModal";
import TicketViewModal from "../../components/tickets/TicketViewModal";

// ================= TYPES =================
type User = {
  id: number;
  username?: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  team?: number | null;
  team_name?: string;
  rank?: string;
  photo?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  last_login?: string;
  date_joined?: string;
};

type UserTicket = {
  id: number;
  ticket_number: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  customer_name?: string;
  assigned_to_name?: string;
};

type UserStats = {
  total_assigned: number;
  total_resolved: number;
  total_in_progress: number;
  total_open: number;
  total_closed: number;
};

type Team = {
  id: number;
  name: string;
  description?: string;
};

type HRMISUser = {
  checkno: string;
  email: string;
  firstname: string;
  lastname: string;
  rank: string;
};

const DEFAULT_PASSWORD = "support123";
const ITEMS_PER_PAGE = 10;

const Users: React.FC = () => {
  // ================= STATE =================
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search and filters
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // HRMIS Modal state
  const [showHRMISModal, setShowHRMISModal] = useState(false);
  const [checkno, setCheckno] = useState("");
  const [hrmisUser, setHrmisUser] = useState<HRMISUser | null>(null);
  const [selectedRole, setSelectedRole] = useState("AGENT");
  const [selectedTeam, setSelectedTeam] = useState("");

  // User form modal (create/edit)
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // User detail modal
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  // Ticket modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);

  // ================= LOAD USERS =================
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers();
      
      let usersData: User[] = [];
      if (Array.isArray(res.data)) {
        usersData = res.data;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        usersData = res.data.results;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        usersData = res.data.data;
      } else {
        usersData = [];
      }
      
      setUsers(usersData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users. Please try again.");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTeams = useCallback(async () => {
    try {
      const res = await getTeams();
      setTeams(res.data?.results || res.data || []);
    } catch (err) {
      console.error("Error loading teams:", err);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadTeams();
  }, [loadUsers, loadTeams]);

  // ================= LOAD USER DETAILS =================
  const loadUserDetails = useCallback(async (user: User) => {
    if (!user.id) return;
    
    setLoadingUserDetail(true);
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        getUserTickets(user.id),
        getUserStats(user.id),
      ]);
      
      let ticketsData: UserTicket[] = [];
      if (Array.isArray(ticketsRes.data)) {
        ticketsData = ticketsRes.data;
      } else if (ticketsRes.data?.results && Array.isArray(ticketsRes.data.results)) {
        ticketsData = ticketsRes.data.results;
      } else {
        ticketsData = [];
      }
      
      let statsData: UserStats = statsRes.data;
      if (!statsData || typeof statsData.total_assigned === 'undefined') {
        statsData = {
          total_assigned: 0,
          total_open: 0,
          total_in_progress: 0,
          total_resolved: 0,
          total_closed: 0,
        };
      }
      
      setUserTickets(ticketsData);
      setUserStats(statsData);
    } catch (err) {
      console.error("Error loading user details:", err);
      setUserTickets([]);
      setUserStats({
        total_assigned: 0,
        total_open: 0,
        total_in_progress: 0,
        total_resolved: 0,
        total_closed: 0,
      });
    } finally {
      setLoadingUserDetail(false);
    }
  }, []);

  // ================= HRMIS SEARCH =================
  const handleHRMISSearch = useCallback(async () => {
    if (!checkno.trim()) {
      setError("Please enter a check number");
      return;
    }
    
    setError(null);
    setHrmisUser(null);
    setSaving(true);
    
    try {
      const res = await fetchHRMISUser(checkno);
      if (res.success) {
        setHrmisUser(res.data);
      } else {
        setError(res.message || "User not found in HRMIS");
      }
    } catch (err) {
      console.error("HRMIS search error:", err);
      setError("Failed to search HRMIS. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [checkno]);

  // ================= SAVE USER FROM HRMIS =================
  const handleSaveHRMISUser = useCallback(async () => {
    if (!hrmisUser) {
      setError("No HRMIS user data to save");
      return;
    }
    
    setSaving(true);
    setError(null);
    
    const payload = {
      username: hrmisUser.checkno,
      email: hrmisUser.email,
      first_name: hrmisUser.firstname,
      last_name: hrmisUser.lastname,
      rank: hrmisUser.rank,
      role: selectedRole,
      team: selectedTeam ? parseInt(selectedTeam) : null,
      password: DEFAULT_PASSWORD,
      password_confirm: DEFAULT_PASSWORD,
      is_active: true,
    };
    
    try {
      await createUser(payload);
      setShowHRMISModal(false);
      setHrmisUser(null);
      setCheckno("");
      setSelectedRole("AGENT");
      setSelectedTeam("");
      await loadUsers();
    } catch (err: any) {
      console.error("Error saving user:", err);
      setError(err.response?.data?.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  }, [hrmisUser, selectedRole, selectedTeam, loadUsers]);

  // ================= USER ACTIONS =================
  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  }, []);

  const handleViewDetails = useCallback(async (user: User) => {
    setSelectedUser(user);
    await loadUserDetails(user);
    setShowUserDetail(true);
  }, [loadUserDetails]);

  const handleViewTicket = useCallback((ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      setShowDelete(false);
      setUserToDelete(null);
      await loadUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  }, [userToDelete, loadUsers]);

  const handleResetPassword = useCallback(async (user: User) => {
    if (!user.id) return;
    
    if (!confirm(`Reset password for ${user.full_name || user.username || user.email} to "${DEFAULT_PASSWORD}"?`)) {
      return;
    }
    
    try {
      await resetUserPassword(user.id, {
        password: DEFAULT_PASSWORD,
        password_confirm: DEFAULT_PASSWORD,
      });
      alert(`Password reset successfully to: ${DEFAULT_PASSWORD}`);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      alert(err.response?.data?.message || "Failed to reset password");
    }
  }, []);

  // ================= FILTER USERS =================
  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          (u.username?.toLowerCase().includes(searchLower) ||
           u.email?.toLowerCase().includes(searchLower) ||
           u.full_name?.toLowerCase().includes(searchLower) ||
           u.first_name?.toLowerCase().includes(searchLower) ||
           u.last_name?.toLowerCase().includes(searchLower))
      );
    }
    
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    
    return filtered;
  }, [users, search, roleFilter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  // Role options for filter
  const roleOptions = ["all", "ADMIN", "TEAM_LEAD", "AGENT", "QA_ANALYST", "MANAGER"];

  // ================= RENDER =================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage users, roles, and view their assigned tickets
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Create User
          </button>
          
          <button
            onClick={() => setShowHRMISModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Add HRMIS User
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, username, or email..."
          className="flex-1 min-w-[200px] border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role === "all" ? "All Roles" : role.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="text-red-700 underline hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : (
          <UserTable
            users={paginatedUsers}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onDelete={(user: User) => {
              setUserToDelete(user);
              setShowDelete(true);
            }}
            onResetPassword={handleResetPassword}
          />
        )}

        {!loading && paginatedUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      
      {/* User Form Modal (Create/Edit) */}
      <UserFormModal
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        // teams={teams}
        onSuccess={() => {
          setShowForm(false);
          setSelectedUser(null);
          loadUsers();
        }}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDelete}
        userName={userToDelete?.full_name || userToDelete?.username || userToDelete?.email}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        show={showUserDetail}
        user={selectedUser}
        tickets={userTickets}
        stats={userStats}
        loading={loadingUserDetail}
        onClose={() => {
          setShowUserDetail(false);
          setSelectedUser(null);
          setUserTickets([]);
          setUserStats(null);
        }}
        onViewTicket={handleViewTicket}
      />

      {/* Ticket View Modal */}
      <TicketViewModal
        show={showTicketModal}
        ticket={selectedTicket}
        onHide={() => {
          setShowTicketModal(false);
          setSelectedTicket(null);
        }}
        onRefresh={() => {
          if (selectedUser) {
            loadUserDetails(selectedUser);
          }
        }}
      />

      {/* ================= HRMIS ADD USER MODAL ================= */}
      {showHRMISModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[600px] rounded-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Add User from HRMIS</h3>
            
            <div className="space-y-3">
              <input
                value={checkno}
                onChange={(e) => setCheckno(e.target.value)}
                placeholder="Enter Check Number"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleHRMISSearch()}
              />
              
              <button
                onClick={handleHRMISSearch}
                disabled={saving || !checkno.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded disabled:opacity-50"
              >
                {saving ? "Searching..." : "Search HRMIS"}
              </button>
              
              {/* HRMIS USER RESULT */}
              {hrmisUser && (
                <div className="mt-4 bg-gray-100 p-3 rounded space-y-3">
                  <p><strong>Name:</strong> {hrmisUser.firstname} {hrmisUser.lastname}</p>
                  <p><strong>Email:</strong> {hrmisUser.email}</p>
                  <p><strong>Rank:</strong> {hrmisUser.rank}</p>
                  
                  {/* ROLE SELECTION */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="AGENT">Agent</option>
                      <option value="TEAM_LEAD">Team Lead</option>
                      <option value="ADMIN">Admin</option>
                      <option value="QA_ANALYST">QA Analyst</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  </div>
                  
                  {/* TEAM SELECTION */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Team (Optional)</label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">No Team</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm">
                    <p><strong>Default Password:</strong> {DEFAULT_PASSWORD}</p>
                    <p className="text-xs text-gray-600 mt-1">User should change this after first login</p>
                  </div>
                  
                  <button
                    onClick={handleSaveHRMISUser}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save User"}
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  setShowHRMISModal(false);
                  setHrmisUser(null);
                  setCheckno("");
                  setError(null);
                  setSelectedRole("AGENT");
                  setSelectedTeam("");
                }}
                className="w-full mt-3 bg-gray-300 hover:bg-gray-400 p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;