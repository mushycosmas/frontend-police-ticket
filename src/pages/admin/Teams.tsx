import React, { useEffect, useMemo, useState } from "react";

import {
  getUsers,
  deleteUser,
  resetUserPassword,
} from "../../api/userApi";

import UserTable from "../../components/users/UserTable";
import UserFormModal from "../../components/users/UserFormModal";
import ConfirmDeleteModal from "../../components/users/ConfirmDeleteModal";

type User = {
  id: number;
  name?: string;
  email?: string;
};

const PAGE_SIZE = 8;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // reset page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  // =========================
  // ACTIONS
  // =========================
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    await deleteUser(selectedUser.id);
    setShowDelete(false);
    setSelectedUser(null);
    loadUsers();
  };

  const handleResetPassword = async (user: User) => {
    if (!confirm("Reset password to support123?")) return;

    await resetUserPassword(user.id);
    alert("Password reset successfully");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-4">

      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            User Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage system users
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Create User
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white shadow rounded-xl p-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No users found
          </div>
        ) : (
          <UserTable
            users={paginatedUsers}
            onEdit={handleEdit}
            onDelete={(user: User) => {
              setSelectedUser(user);
              setShowDelete(true);
            }}
            onResetPassword={handleResetPassword}
          />
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm text-gray-600">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-white border rounded disabled:opacity-50"
          >
            Next
          </button>
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
      />
    </div>
  );
};

export default Users;