import React, { useEffect, useState } from "react";

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

const Districts: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [region, setRegion] = useState<number | "">("");

  // =====================
  // LOAD DATA
  // =====================
  const loadDistricts = async () => {
    try {
      const res = await getDistricts();
      setDistricts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRegions = async () => {
    try {
      const res = await getRegions();
      setRegions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDistricts();
    loadRegions();
  }, []);

  // =====================
  // OPEN MODAL
  // =====================
  const handleShow = (item?: District) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setRegion(item.region);
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

  // =====================
  // SAVE
  // =====================
  const handleSave = async () => {
    const data = {
      name,
      region,
    };

    try {
      if (editingId !== null) {
        await updateDistrict(editingId, data);
      } else {
        await createDistrict(data);
      }

      loadDistricts();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this district?")) return;

    try {
      await deleteDistrict(id);
      loadDistricts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Districts</h2>

        <button
          onClick={() => handleShow()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add District
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">District</th>
              <th className="p-3">Region</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {districts.map((d, i) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.region_name}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleShow(d)}
                    className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
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
              {editingId ? "Edit District" : "Add District"}
            </h3>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* REGION */}
              <div>
                <label className="block text-sm mb-1">Region</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={region}
                  onChange={(e) => setRegion(Number(e.target.value))}
                >
                  <option value="">Select Region</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Close
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Districts;