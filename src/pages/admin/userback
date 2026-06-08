import React, { useEffect, useMemo, useState } from "react";
import {
  getUsers,
  deleteUser,
  resetUserPassword,
  getUserTickets,
  getUserStats,
} from "../../api/userApi";
import UserTable from "../../components/users/UserTable";
import UserFormModal from "../../components/users/UserFormModal";
import ConfirmDeleteModal from "../../components/users/ConfirmDeleteModal";
import UserDetailModal from "../../components/users/UserDetailModal";
import TicketViewModal from "../../components/tickets/TicketViewModal";

type User = {
  id: number;
  username?: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  team_name?: string;
  is_active?: boolean;
};

type UserTicket = {
  id: number;
  ticket_number: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  customer_name?: string;
};

type UserStats = {
  total_assigned: number;
  total_resolved: number;
  total_in_progress: number;
  total_open: number;
  total_closed: number;
};

const ITEMS_PER_PAGE = 10;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers();
      
      // Handle different response structures
      let usersData = [];
      if (Array.isArray(res.data)) {
        usersData = res.data;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        usersData = res.data.results;
      } else {
        usersData = [];
      }
      
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // LOAD USER DETAILS (Tickets & Stats)
  // =========================
  const loadUserDetails = async (user: User) => {
    setLoadingUserDetail(true);
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        getUserTickets(user.id),
        getUserStats(user.id),
      ]);
      
      // Handle tickets response
      let ticketsData = [];
      if (Array.isArray(ticketsRes.data)) {
        ticketsData = ticketsRes.data;
      } else if (ticketsRes.data?.results && Array.isArray(ticketsRes.data.results)) {
        ticketsData = ticketsRes.data.results;
      } else {
        ticketsData = [];
      }
      
      // Handle stats response
      let statsData = statsRes.data;
      if (!statsData.total_assigned) {
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
    } finally {
      setLoadingUserDetail(false);
    }
  };

  // =========================
  // SEARCH & FILTER
  // =========================
  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (u) =>
          (u.username?.toLowerCase().includes(search.toLowerCase()) ||
           u.email?.toLowerCase().includes(search.toLowerCase()) ||
           u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
           u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
           u.last_name?.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    
    return filtered;
  }, [users, search, roleFilter]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  // =========================
  // ACTIONS
  // =========================
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleViewDetails = async (user: User) => {
    setSelectedUser(user);
    await loadUserDetails(user);
    setShowUserDetail(true);
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      setShowDelete(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Reset password for ${user.username || user.email} to "support123"?`)) return;
    try {
      await resetUserPassword(user.id);
      alert("Password reset successfully to: support123");
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password");
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  // Role options for filter
  const roles = ["all", "ADMIN", "TEAM_LEAD", "AGENT", "QA_ANALYST"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage users and view their assigned tickets
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Create User
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, username, or email..."
          className="flex-1 min-w-[200px] border px-3 py-2 rounded-lg shadow-sm"
        />
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg shadow-sm"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role === "all" ? "All Roles" : role.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
          <button onClick={loadUsers} className="ml-3 underline">Try Again</button>
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
              setSelectedUser(user);
              setShowDelete(true);
            }}
            onResetPassword={handleResetPassword}
          />
        )}

        {!loading && paginatedUsers.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No users found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages} ({filteredUsers.length} total users)
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <UserFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        user={selectedUser}
        onSuccess={() => {
          setShowForm(false);
          loadUsers();
        }}
      />

      <ConfirmDeleteModal
        show={showDelete}
        onHide={() => {
          setShowDelete(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
        userName={selectedUser?.username || selectedUser?.email}
      />

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
    </div>
  );
};

export default Users;