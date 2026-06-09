import React, { useEffect, useMemo, useState } from "react";
import { getPermissions } from "../../api/roleApi"; // ← CHANGE THIS: import from roleApi instead

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
     LOAD DATA
  ========================= */
  const loadPermissions = async () => {
    try {
      setLoading(true);
      const res = await getPermissions(); // Now this calls /api/roles/permissions/
      setPermissions(res.data ?? res);
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
    return permissions.filter((p) => {
      const query = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.codename.toLowerCase().includes(query)
      );
    });
  }, [permissions, search]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(filteredPermissions.length / ITEMS_PER_PAGE);

  const paginatedPermissions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredPermissions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPermissions, page]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          System Permissions
        </h2>
        
        <div className="text-sm text-gray-500">
          Total: {permissions.length} permissions
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">
            Permissions are system-defined and read-only. They can only be assigned to roles.
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search permissions by name or codename..."
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Permission Name</th>
                <th className="p-3 text-left">Codename</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPermissions.map((p, i) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-500">
                    {(page - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="p-3">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {p.codename}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && paginatedPermissions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            {search ? "No permissions match your search" : "No permissions found"}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {filteredPermissions.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to{" "}
            {Math.min(page * ITEMS_PER_PAGE, filteredPermissions.length)} of{" "}
            {filteredPermissions.length} permissions
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Permissions;