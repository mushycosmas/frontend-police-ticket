import React, { useEffect, useState } from "react";

import {
  getWards,
  createWard,
  updateWard,
  deleteWard,
  getDistricts,
} from "../../../api/locationApi";

type District = {
  id: number;
  name: string;
};

type Ward = {
  id: number;
  name: string;
  district: number;
  district_name?: string;
};

const Wards: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [show, setShow] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState<string>("");
  const [district, setDistrict] = useState<number | "">("");

  // =====================
  // LOAD DATA
  // =====================
  const loadWards = async (): Promise<void> => {
    try {
      const res = await getWards();
      setWards(res.data);
    } catch (error) {
      console.error("Failed to load wards:", error);
    }
  };

  const loadDistricts = async (): Promise<void> => {
    try {
      const res = await getDistricts();
      setDistricts(res.data);
    } catch (error) {
      console.error("Failed to load districts:", error);
    }
  };

  useEffect(() => {
    loadWards();
    loadDistricts();
  }, []);

  // =====================
  // OPEN MODAL
  // =====================
  const handleShow = (item?: Ward): void => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setDistrict(item.district);
    } else {
      setEditingId(null);
      setName("");
      setDistrict("");
    }
    setShow(true);
  };

  const handleClose = (): void => {
    setShow(false);
    setEditingId(null);
    setName("");
    setDistrict("");
  };

  // =====================
  // SAVE
  // =====================
  const handleSave = async (): Promise<void> => {
    if (!name || district === "") {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name,
      district: Number(district),
    };

    try {
      if (editingId !== null) {
        await updateWard(editingId, payload);
      } else {
        await createWard(payload);
      }

      await loadWards();
      handleClose();
    } catch (error) {
      console.error("Failed to save ward:", error);
    }
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Delete this ward?")) return;

    try {
      await deleteWard(id);
      await loadWards();
    } catch (error) {
      console.error("Failed to delete ward:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Wards</h2>

        <button
          onClick={() => handleShow()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Ward
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Ward</th>
              <th className="p-3">District</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {wards.map((w, i) => (
              <tr key={w.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td className="p-3 font-medium">{w.name}</td>
                <td className="p-3">{w.district_name}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleShow(w)}
                    className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(w.id)}
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
              {editingId ? "Edit Ward" : "Add Ward"}
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

              {/* DISTRICT */}
              <div>
                <label className="block text-sm mb-1">District</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={district}
                  onChange={(e) =>
                    setDistrict(
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
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

export default Wards;