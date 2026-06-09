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
import { getRoles } from "../../api/roleApi"; // Fixed: changed from getRole to getRoles
import { fetchHRMISUser } from "../../api/hrmisApi";

import UserTable from "../../components/users/UserTable";
import UserFormModal from "../../components/users/UserFormModal";
import ConfirmDeleteModal from "../../components/users/ConfirmDeleteModal";
import UserDetailModal from "../../components/users/UserDetailModal";
import TicketViewModal from "../../components/tickets/TicketViewModal";
import { HRMISUserModal } from "../../components/users/HRMISUserModal";

// Import types from the actual type files to ensure consistency
import type { Team as TeamType } from "../../types/team.types";
import type { Role as RoleType } from "../../types/roles.types";

/* ================= TYPES ================= */
// Use the imported types for consistency
type Team = TeamType;
type Role = RoleType;

type User = {
  id: number;
  username?: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: any;
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
};

type UserStats = {
  total_assigned: number;
  total_resolved: number;
  total_in_progress: number;
  total_open: number;
  total_closed: number;
};

const DEFAULT_PASSWORD = "support123";
const ITEMS_PER_PAGE = 10;

/* ================= HELPERS ================= */

const extractList = (res: any) => {
  return Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.results)
    ? res.data.results
    : Array.isArray(res?.data?.data)
    ? res.data.data
    : [];
};

const normalizeRole = (role: any) =>
  typeof role === "string" ? role : role?.name || "";

const formatRole = (role: string) =>
  role ? role.replace(/_/g, " ").toLowerCase() : "";

/* ================= COMPONENT ================= */

const Users: React.FC = () => {
  /* ===== STATE ===== */
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [showHRMISModal, setShowHRMISModal] = useState(false);

  const [showUserDetail, setShowUserDetail] = useState(false);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);

  /* ===== LOAD USERS ===== */
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers();
      setUsers(extractList(res));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTeams = useCallback(async () => {
    try {
      const res = await getTeams();
      const teamsData = extractList(res);
      // Map the API response to match the Team type
      const mappedTeams: Team[] = teamsData.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        status: team.status || "ACTIVE",
        member_count: team.member_count || 0,
        created_at: team.created_at || new Date().toISOString(),
        updated_at: team.updated_at || new Date().toISOString(),
      }));
      setTeams(mappedTeams);
    } catch {
      setTeams([]);
    }
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const res = await getRoles();
      const rolesData = extractList(res);
      // Map the API response to match the Role type
      const mappedRoles: Role[] = rolesData.map((role: any) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        status: role.status || "ACTIVE",
        is_system: role.is_system || false,
        is_default: role.is_default || false,
        level: role.level || 0,
        created_at: role.created_at || new Date().toISOString(),
        updated_at: role.updated_at || new Date().toISOString(),
      }));
      setRoles(mappedRoles);
    } catch {
      setRoles([
        { id: 1, name: "ADMIN", description: "Administrator", status: "ACTIVE", is_system: true, is_default: false, level: 90, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "MANAGER", description: "Manager", status: "ACTIVE", is_system: true, is_default: false, level: 70, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "AGENT", description: "Support Agent", status: "ACTIVE", is_system: true, is_default: true, level: 50, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadTeams();
    loadRoles();
  }, [loadUsers, loadTeams, loadRoles]);

  /* ===== USER DETAILS ===== */
  const loadUserDetails = useCallback(async (user: User) => {
    if (!user?.id) return;

    setLoadingUserDetail(true);

    try {
      const [ticketsRes, statsRes] = await Promise.all([
        getUserTickets(user.id),
        getUserStats(user.id),
      ]);

      setUserTickets(extractList(ticketsRes));

      setUserStats(
        statsRes.data || {
          total_assigned: 0,
          total_resolved: 0,
          total_in_progress: 0,
          total_open: 0,
          total_closed: 0,
        }
      );
    } catch {
      setUserTickets([]);
      setUserStats(null);
    } finally {
      setLoadingUserDetail(false);
    }
  }, []);

  /* ===== HRMIS ===== */
  const handleHRMISSearch = useCallback(async (checkno: string) => {
    return await fetchHRMISUser(checkno);
  }, []);

  const handleHRMISCreateUser = useCallback(async (payload: any) => {
    return await createUser(payload);
  }, []);

  /* ===== ACTIONS ===== */
  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  }, []);

  const handleViewDetails = useCallback(
    (user: User) => {
      setSelectedUser(user);
      setShowUserDetail(true);
      loadUserDetails(user);
    },
    [loadUserDetails]
  );

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
      loadUsers();
    } catch {
      setError("Failed to delete user");
    }
  }, [userToDelete, loadUsers]);

  const handleResetPassword = useCallback(async (user: User) => {
    if (!user?.id) return;

    if (!window.confirm("Reset password?")) return;

    try {
      await resetUserPassword(user.id, {
        password: DEFAULT_PASSWORD,
        confirm_password: DEFAULT_PASSWORD,
      });

      alert("Password reset to " + DEFAULT_PASSWORD);
    } catch {
      alert("Failed to reset password");
    }
  }, []);

  /* ===== FILTER ===== */
  const filteredUsers = useMemo(() => {
    let data = [...users];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter((u) =>
        [
          u.username,
          u.email,
          u.full_name,
          u.first_name,
          u.last_name,
        ]
          .filter(Boolean)
          .some((f) => f!.toLowerCase().includes(s))
      );
    }

    if (roleFilter !== "all") {
      data = data.filter((u) => normalizeRole(u.role) === roleFilter);
    }

    return data;
  }, [users, search, roleFilter]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  );

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  /* ===== ERROR AUTO CLEAR ===== */
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(t);
  }, [error]);

  /* ===== UI ===== */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-500 text-sm">
            Manage users and tickets
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Create User
          </button>

          <button
            onClick={() => setShowHRMISModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + HRMIS User
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {formatRole(r.name)}
            </option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-3">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <UserTable
            users={paginatedUsers}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onDelete={(u: User) => {
              setUserToDelete(u);
              setShowDelete(true);
            }}
            onResetPassword={handleResetPassword}
          />
        )}
      </div>

      {/* MODALS */}
      <UserFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        user={selectedUser}
        teams={teams}
        roles={roles}
        onSuccess={loadUsers}
      />

      <ConfirmDeleteModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={handleDelete}
        userName={userToDelete?.full_name}
      />

      <UserDetailModal
        show={showUserDetail}
        user={selectedUser}
        tickets={userTickets}
        stats={userStats}
        loading={loadingUserDetail}
        onClose={() => setShowUserDetail(false)}
        onViewTicket={handleViewTicket}
      />

      <TicketViewModal
        show={showTicketModal}
        ticket={selectedTicket}
        onHide={() => setShowTicketModal(false)}
      />

      <HRMISUserModal
        show={showHRMISModal}
        onHide={() => setShowHRMISModal(false)}
        teams={teams}
        roles={roles}
        onSuccess={() => {
          setShowHRMISModal(false);
          loadUsers();
        }}
        onSearch={handleHRMISSearch}
        onCreateUser={handleHRMISCreateUser}
      />
    </div>
  );
};

export default Users;