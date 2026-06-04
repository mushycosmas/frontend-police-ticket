import React, { useEffect, useMemo, useState } from "react";
import {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from "../../../api/locationApi";

type Region = {
  id: number;
  name: string;
};

const ITEMS_PER_PAGE = 10;

const Regions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const [page, setPage] = useState(1);

  // =========================
  // LOAD REGIONS
  // =========================
  const loadRegions = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getRegions();
      setRegions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredRegions = useMemo(() => {
    return regions.filter((region) =>
      region.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [regions, search]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredRegions.length / ITEMS_PER_PAGE
  );

  const paginatedRegions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredRegions.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredRegions, page]);

  // =========================
  // MODAL
  // =========================
  const handleShow = (region?: Region): void => {
    if (region) {
      setEditingId(region.id);
      setName(region.name);
    } else {
      setEditingId(null);
      setName("");
    }

    setShow(true);
  };

  const handleClose = (): void => {
    setShow(false);
    setEditingId(null);
    setName("");
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async (): Promise<void> => {
    try {
      const payload = { name };

      if (editingId !== null) {
        await updateRegion(editingId, payload);
      } else {
        await createRegion(payload);
      }

      handleClose();
      loadRegions();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (
    id: number
  ): Promise<void> => {
    if (!window.confirm("Delete this region?")) return;

    try {
      await deleteRegion(id);
      loadRegions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Regions Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage system regions
          </p>
        </div>

        <div className="flex gap-2">

          <input
            type="text"
            placeholder="Search region..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => handleShow()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Add Region
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4">

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading regions...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Region Name</th>
                  <th className="p-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedRegions.length > 0 ? (
                  paginatedRegions.map((region, index) => (
                    <tr
                      key={region.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {(page - 1) * ITEMS_PER_PAGE +
                          index +
                          1}
                      </td>

                      <td className="p-3 font-medium">
                        {region.name}
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleShow(region)
                            }
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(region.id)
                            }
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-6 text-gray-500"
                    >
                      No regions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded-lg bg-white disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded-lg bg-white disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-5">

            <h3 className="text-xl font-semibold mb-4">
              {editingId
                ? "Edit Region"
                : "Create Region"}
            </h3>

            <div className="space-y-4">

              <div>
                <label className="block text-sm mb-1">
                  Region Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter region name"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">

                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {editingId ? "Update" : "Save"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Regions;