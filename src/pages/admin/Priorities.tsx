import React, { useEffect, useState, useMemo } from "react";
import {
  getPriorities,
  createPriority,
  updatePriority,
  deletePriority,
} from "../../api/priorityApi";

type Priority = {
  id: number;
  name: string;
  level: number;
  description?: string;
  color: "secondary" | "info" | "warning" | "danger" | "success";
};

const Priorities: React.FC = () => {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    level: 0,
    description: "",
    color: "secondary" as Priority["color"],
  });

  // =====================
  // LOAD
  // =====================
  const fetchPriorities = async () => {
    setLoading(true);
    const res = await getPriorities();
    setPriorities(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

  // =====================
  // SEARCH FILTER
  // =====================
  const filtered = useMemo(() => {
    return priorities.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [priorities, search]);

  // =====================
  // PAGINATION
  // =====================
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / perPage);

  // =====================
  // CREATE
  // =====================
  const handleCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      name: "",
      level: 0,
      description: "",
      color: "secondary",
    });
    setShow(true);
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (p: Priority) => {
    setEditMode(true);
    setCurrentId(p.id);
    setFormData({
      name: p.name,
      level: p.level,
      description: p.description || "",
      color: p.color,
    });
    setShow(true);
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this priority?")) return;
    await deletePriority(id);
    fetchPriorities();
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && currentId) {
      await updatePriority(currentId, formData);
    } else {
      await createPriority(formData);
    }

    setShow(false);
    fetchPriorities();
  };

  // =====================
  // COLOR BADGE
  // =====================
  const colorMap: Record<string, string> = {
    secondary: "bg-gray-400 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
    danger: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Priorities
        </h2>

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Priority
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search priorities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Level</th>
                <th className="p-3">Color</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[...paginated]
                .sort((a, b) => a.level - b.level)
                .map((p, i) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.level}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${colorMap[p.color]}`}
                      >
                        {p.color}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-3">
              {editMode ? "Edit Priority" : "Create Priority"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="Level"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: Number(e.target.value) })
                }
              />

              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <select
                className="w-full border rounded px-3 py-2"
                value={formData.color}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    color: e.target.value as Priority["color"],
                  })
                }
              >
                <option value="secondary">Secondary</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
                <option value="success">Success</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
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

export default Priorities;