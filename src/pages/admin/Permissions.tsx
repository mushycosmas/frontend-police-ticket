import React, { useEffect, useMemo, useState } from "react";
import { getPermissions } from "../../api/roleApi";
import PermissionFormModal from "../../components/roles/PermissionFormModal";

/* =========================
   TYPE
========================= */
type Permission = {
  id: number;
  name: string;
  codename: string;
};

const ITEMS_PER_PAGE = 8;

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     MODAL STATE
  ========================= */
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Permission | null>(null);

  /* =========================
     LOAD DATA
  ========================= */
  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getPermissions();
      const data = res?.data ?? res;

      setPermissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading permissions:", err);
      setError("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredPermissions = useMemo(() => {
    const query = search.toLowerCase();

    return permissions.filter((p) => {
      return (
        (p.name || "").toLowerCase().includes(query) ||
        (p.codename || "").toLowerCase().includes(query)
      );
    });
  }, [permissions, search]);

  /* reset page on search */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(filteredPermissions.length / ITEMS_PER_PAGE);

  const paginatedPermissions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPermissions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPermissions, page]);

  /* =========================
     OPEN CREATE
  ========================= */
  const handleCreate = () => {
    setEditData(null);
    setShowModal(true);
  };

  /* =========================
     OPEN EDIT
  ========================= */
  const handleEdit = (permission: Permission) => {
    setEditData(permission);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">System Permissions</h2>

        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Permission
        </button>
      </div>

      {/* INFO */}
      <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
        Permissions are system-defined and used for role-based access control.
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search permissions..."
        className="w-full md:w-1/3 border px-3 py-2 rounded-lg mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ERROR */}
      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Codename</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPermissions.map((p, i) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-500">
                    {(page - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>

                  <td className="p-3 font-medium">{p.name}</td>

                  <td className="p-3">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {p.codename}
                    </code>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && paginatedPermissions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No permissions found
          </div>
        )}
      </div>

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
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* =========================
          MODAL
      ========================= */}
      <PermissionFormModal
        show={showModal}
        editData={editData}
        onHide={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          loadPermissions();
        }}
      />
    </div>
  );
};

export default Permissions;