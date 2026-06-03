import React, { useEffect, useState } from "react";

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

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    level: 0,
    description: "",
    color: "secondary" as Priority["color"],
  });

  // =====================
  // LOAD DATA
  // =====================
  const fetchPriorities = () => {
    getPriorities()
      .then((res) => setPriorities(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

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
  const handleEdit = (priority: Priority) => {
    setEditMode(true);
    setCurrentId(priority.id);
    setFormData({
      name: priority.name,
      level: priority.level,
      description: priority.description || "",
      color: priority.color,
    });
    setShow(true);
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = (id: number) => {
    deletePriority(id)
      .then(() => fetchPriorities())
      .catch(console.error);
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && currentId !== null) {
      updatePriority(currentId, formData)
        .then(() => {
          fetchPriorities();
          setShow(false);
        })
        .catch(console.error);
    } else {
      createPriority(formData)
        .then(() => {
          fetchPriorities();
          setShow(false);
        })
        .catch(console.error);
    }
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Priorities</h2>

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Priority
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Level</th>
              <th className="p-3">Description</th>
              <th className="p-3">Indicator</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {[...priorities]
              .sort((a, b) => a.level - b.level)
              .map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.level}</td>
                  <td className="p-3">{p.description}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${colorMap[p.color]}`}
                    >
                      {p.name}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Priority" : "Create Priority"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm mb-1">Level</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower number = higher priority
                </p>
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

              {/* Color */}
              <div>
                <label className="block text-sm mb-1">Color</label>
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
              </div>

              {/* Actions */}
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

export default Priorities;