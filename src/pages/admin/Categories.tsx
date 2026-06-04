import React, { useEffect, useState, useMemo } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

type Category = {
  id: number;
  name: string;
  description?: string;
  status: "Active" | "Inactive";
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  // =====================
  // LOAD
  // =====================
  const fetchCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =====================
  // SEARCH
  // =====================
  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

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
      description: "",
      status: "Active",
    });
    setShow(true);
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (c: Category) => {
    setEditMode(true);
    setCurrentId(c.id);
    setFormData({
      name: c.name,
      description: c.description || "",
      status: c.status,
    });
    setShow(true);
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    fetchCategories();
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && currentId) {
      await updateCategory(currentId, formData);
    } else {
      await createCategory(formData);
    }

    setShow(false);
    fetchCategories();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Categories
        </h2>

        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Category
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search categories..."
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
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((c, i) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.description || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
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
          <div className="bg-white p-5 rounded-lg w-[420px]">

            <h2 className="text-lg font-semibold mb-3">
              {editMode ? "Edit Category" : "Create Category"}
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
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

export default Categories;