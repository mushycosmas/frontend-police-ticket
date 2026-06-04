import React, { useEffect, useMemo, useState } from "react";

import {
  getStreets,
  createStreet,
  updateStreet,
  deleteStreet,
  getWards,
} from "../../../api/locationApi";

type Ward = {
  id: number;
  name: string;
};

type Street = {
  id: number;
  name: string;
  ward: number;
  ward_name?: string;
};

const ITEMS_PER_PAGE = 5;

const Streets: React.FC = () => {
  const [streets, setStreets] = useState<Street[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [ward, setWard] = useState<number | "">("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // =====================
  // LOAD DATA
  // =====================
  const loadStreets = async () => {
    const res = await getStreets();
    setStreets(res.data);
  };

  const loadWards = async () => {
    const res = await getWards();
    setWards(res.data);
  };

  useEffect(() => {
    loadStreets();
    loadWards();
  }, []);

  // =====================
  // FILTER
  // =====================
  const filtered = useMemo(() => {
    return streets.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [streets, search]);

  // =====================
  // PAGINATION
  // =====================
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const data = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // =====================
  // OPEN MODAL
  // =====================
  const handleShow = (item?: Street) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setWard(item.ward);
    } else {
      setEditingId(null);
      setName("");
      setWard("");
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditingId(null);
    setName("");
    setWard("");
  };

  // =====================
  // SAVE
  // =====================
  const handleSave = async () => {
    if (!name || ward === "") return;

    const payload = {
      name,
      ward: Number(ward),
    };

    if (editingId) {
      await updateStreet(editingId, payload);
    } else {
      await createStreet(payload);
    }

    await loadStreets();
    handleClose();
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this street?")) return;

    await deleteStreet(id);
    await loadStreets();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Streets Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage system Streets
          </p>
        </div>

        <button
          onClick={() => handleShow()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Street
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
          placeholder="Search street..."
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Street</th>
                <th className="p-3">Ward</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">

                    <td className="p-3">
                      {(page - 1) * ITEMS_PER_PAGE + i + 1}
                    </td>

                    <td className="p-3 font-medium">{s.name}</td>

                    <td className="p-3 text-gray-600">
                      {s.ward_name || "—"}
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleShow(s)}
                        className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    No streets found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded-lg bg-white disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-3 py-1 text-sm text-gray-600">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded-lg bg-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">

            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Street" : "Create Street"}
            </h3>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Street name"
            />

            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={ward}
              onChange={(e) => setWard(Number(e.target.value))}
            >
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Streets;