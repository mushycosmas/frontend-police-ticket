import React, { useEffect, useState } from "react";

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

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // EDIT USER
  // =========================
  const handleEdit = (user: User): void => {
    setSelectedUser(user);
    setShowForm(true);
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async (): Promise<void> => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setShowDelete(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================
  const handleResetPassword = async (user: User): Promise<void> => {
    if (!confirm("Reset password to support123?")) return;

    try {
      await resetUserPassword(user.id);
      alert("Password reset successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
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
            users={users}
            onEdit={handleEdit}
            onDelete={(user: User) => {
              setSelectedUser(user);
              setShowDelete(true);
            }}
            onResetPassword={handleResetPassword}
          />
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <UserFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        user={selectedUser}
        onSuccess={() => {
          setShowForm(false);
          loadUsers();
        }}
      />

      {/* DELETE CONFIRM MODAL */}
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