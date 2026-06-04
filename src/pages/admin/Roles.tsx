import React, { useEffect, useMemo, useState } from "react";

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

const ITEMS_PER_PAGE = 6;

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      setError("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // =====================
  // SEARCH FILTER
  // =====================
  const filteredRoles = useMemo(() => {
    return roles.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  // =====================
  // PAGINATION
  // =====================
  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredRoles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRoles, page]);

  // =====================
  // CREATE
  // =====================
  const handleCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({ name: "", description: "", is_active: true });
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

    await deleteRole(id);
    loadRoles();
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && currentId) {
      await updateRole(currentId, formData);
    } else {
      await createRole(formData);
    }

    setShow(false);
    loadRoles();
  };

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

      {/* SEARCH */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search role..."
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg shadow-sm"
        />
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
              {paginatedRoles.map((r, index) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">

                  <td className="p-3">
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>

                  <td className="p-3 font-medium">{r.name}</td>

                  <td className="p-3">{r.description || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        r.is_active
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
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

        {!loading && paginatedRoles.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No roles found
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

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5">

            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Role" : "Create Role"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Role name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

              <label className="flex items-center gap-2">
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
                Active
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
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