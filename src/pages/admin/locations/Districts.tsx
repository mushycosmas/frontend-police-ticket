import React, { useEffect, useMemo, useState } from "react";
import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getRegions,
} from "../../../api/locationApi";

type Region = {
  id: number;
  name: string;
};

type District = {
  id: number;
  name: string;
  region: number;
  region_name?: string;
};

const ITEMS_PER_PAGE = 10;

const Districts: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [region, setRegion] = useState<number | "">("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // =========================
  // LOAD DATA
  // =========================
  const loadDistricts = async () => {
    try {
      setLoading(true);

      const res = await getDistricts();
      setDistricts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const res = await getRegions();
      setRegions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDistricts();
    loadRegions();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const filteredDistricts = useMemo(() => {
    return districts.filter(
      (district) =>
        district.name.toLowerCase().includes(search.toLowerCase()) ||
        (district.region_name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [districts, search]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredDistricts.length / ITEMS_PER_PAGE
  );

  const paginatedDistricts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    return filteredDistricts.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredDistricts, page]);

  // =========================
  // MODAL
  // =========================
  const handleShow = (district?: District) => {
    if (district) {
      setEditingId(district.id);
      setName(district.name);
      setRegion(district.region);
    } else {
      setEditingId(null);
      setName("");
      setRegion("");
    }

    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditingId(null);
    setName("");
    setRegion("");
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    if (!name || region === "") {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name,
      region,
    };

    try {
      if (editingId) {
        await updateDistrict(editingId, payload);
      } else {
        await createDistrict(payload);
      }

      await loadDistricts();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this district?")) return;

    try {
      await deleteDistrict(id);
      await loadDistricts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow-sm border rounded-xl p-5 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              District Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage districts and assign them to regions.
            </p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">

            <input
              type="text"
              placeholder="Search district..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full lg:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => handleShow()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Add District
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Total Districts
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {districts.length}
          </h3>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Regions
          </p>

          <h3 className="text-2xl font-bold text-blue-600 mt-2">
            {regions.length}
          </h3>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5">
          <p className="text-sm text-gray-500">
            Search Results
          </p>

          <h3 className="text-2xl font-bold text-green-600 mt-2">
            {filteredDistricts.length}
          </h3>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading districts...
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-5 py-4 text-left">#</th>
                <th className="px-5 py-4 text-left">
                  District Name
                </th>
                <th className="px-5 py-4 text-left">
                  Region
                </th>
                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {paginatedDistricts.length > 0 ? (
                paginatedDistricts.map((district, index) => (
                  <tr
                    key={district.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      {(page - 1) * ITEMS_PER_PAGE +
                        index +
                        1}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {district.name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {district.region_name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            handleShow(district)
                          }
                          className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(district.id)
                          }
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
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
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    No districts found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-5">

        <p className="text-sm text-gray-500">
          Showing {paginatedDistricts.length} of{" "}
          {filteredDistricts.length} districts
        </p>

        <div className="flex items-center gap-2">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {page}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>
      </div>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

            <h3 className="text-xl font-semibold mb-5">
              {editingId
                ? "Edit District"
                : "Add District"}
            </h3>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  District Name
                </label>

                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Region
                </label>

                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={region}
                  onChange={(e) =>
                    setRegion(Number(e.target.value))
                  }
                >
                  <option value="">
                    Select Region
                  </option>

                  {regions.map((r) => (
                    <option
                      key={r.id}
                      value={r.id}
                    >
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-2 mt-6">

              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {editingId ? "Update" : "Save"}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Districts;