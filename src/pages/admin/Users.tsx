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

const ITEMS_PER_PAGE = 6;

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
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

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
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          User Management
        </h2>

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
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search user by name or email..."
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg shadow-sm"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Loading users...
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

        {!loading && paginatedUsers.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No users found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

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