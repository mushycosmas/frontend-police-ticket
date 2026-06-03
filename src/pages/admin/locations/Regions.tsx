import React, { useEffect, useState } from "react";

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

const Regions: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);

  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");

  // =====================
  // LOAD REGIONS
  // =====================
  const loadRegions = async () => {
    try {
      const res = await getRegions();
      setRegions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRegions();
  }, []);

  // =====================
  // OPEN MODAL
  // =====================
  const handleShow = (region?: Region) => {
    if (region) {
      setEditingId(region.id);
      setName(region.name);
    } else {
      setEditingId(null);
      setName("");
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setName("");
    setEditingId(null);
  };

  // =====================
  // SAVE REGION
  // =====================
  const handleSave = async () => {
    const data = { name };

    try {
      if (editingId !== null) {
        await updateRegion(editingId, data);
      } else {
        await createRegion(data);
      }

      loadRegions();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // DELETE REGION
  // =====================
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this region?")) return;

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Regions</h2>

        <button
          onClick={() => handleShow()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Region
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Region Name</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {regions.map((region, index) => (
              <tr key={region.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{region.name}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleShow(region)}
                    className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(region.id)}
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
              {editingId ? "Edit Region" : "Add Region"}
            </h3>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm mb-1">Region Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter region name"
                />
              </div>

              {/* ACTIONS */}
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