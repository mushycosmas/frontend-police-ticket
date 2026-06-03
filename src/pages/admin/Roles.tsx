import React, { useEffect, useState } from "react";

import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../api/roleApi";

type Role = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
};

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  // =====================
  // LOAD ROLES
  // =====================
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // =====================
  // CREATE
  // =====================
  const handleCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      name: "",
      description: "",
      is_active: true,
    });
    setShow(true);
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (role: Role) => {
    setEditMode(true);
    setCurrentId(role.id);
    setFormData({
      name: role.name,
      description: role.description || "",
      is_active: role.is_active,
    });
    setShow(true);
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this role?")) return;

    try {
      await deleteRole(id);
      loadRoles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete role");
    }
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editMode && currentId !== null) {
        await updateRole(currentId, formData);
      } else {
        await createRole(formData);
      }

      setShow(false);
      loadRoles();
    } catch (err) {
      console.error(err);
      alert("Failed to save role");
    }
  };

  // =====================
  // BADGE STYLE
  // =====================
  const statusBadge = (active: boolean) =>
    active
      ? "bg-green-500 text-white"
      : "bg-gray-400 text-white";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Roles Management
        </h2>

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Role
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((r, index) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 font-medium">{r.name}</td>

                  <td className="p-3">{r.description || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${statusBadge(
                        r.is_active
                      )}`}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Role" : "Create Role"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1">Role Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.checked,
                    })
                  }
                />
                <label className="text-sm">Active</label>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {editMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;