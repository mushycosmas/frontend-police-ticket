import React, { useEffect, useMemo, useState } from "react";

import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../../api/teamApi";

interface Team {
  id: number;
  name: string;
  description?: string;
}

const ITEMS_PER_PAGE = 6;

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // =========================
  // LOAD TEAMS
  // =========================
  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getTeams();
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setTeams(data);
    } catch (err) {
      setError("Failed to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredTeams = useMemo(() => {
    return teams.filter(
      (t) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [teams, search]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);

  const paginatedTeams = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTeams.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTeams, page]);

  // =========================
  // ACTIONS
  // =========================
  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setForm({
      name: team.name || "",
      description: team.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedTeam) return;

    await deleteTeam(selectedTeam.id);
    setShowDelete(false);
    setSelectedTeam(null);
    loadTeams();
  };

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        alert("Team name is required");
        return;
      }

      if (selectedTeam) {
        await updateTeam(selectedTeam.id, form);
      } else {
        await createTeam(form);
      }

      setShowModal(false);
      setSelectedTeam(null);
      setForm({ name: "", description: "" });
      loadTeams();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save team");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Teams
        </h2>

        <button
          onClick={() => {
            setSelectedTeam(null);
            setForm({ name: "", description: "" });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Team
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
          placeholder="Search team by name or description..."
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg shadow-sm"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Loading teams...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTeams.map((team) => (
                  <tr key={team.id} className="border-t">
                    <td className="p-3">{team.id}</td>
                    <td className="p-3 font-medium">{team.name}</td>
                    <td className="p-3 text-gray-600">{team.description || "-"}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(team)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowDelete(true);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && paginatedTeams.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No teams found
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

      {/* MODAL (CREATE/EDIT) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              {selectedTeam ? "Edit Team" : "Create Team"}
            </h2>

            <input
              className="w-full border p-3 rounded mb-3"
              placeholder="Team name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              className="w-full border p-3 rounded mb-3"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTeam(null);
                  setForm({ name: "", description: "" });
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Team</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">"{selectedTeam?.name}"</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setSelectedTeam(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;