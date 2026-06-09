import React, { useEffect, useMemo, useState } from "react";

import {
  getRoles,
  createRole,
  updateRole,
  getRole,
  deleteRole,
} from "../../api/roleApi";

import { getPermissions } from "../../api/permissionApi";

/* COMPONENTS */
import RoleTable from "../../components/roles/RoleTable";
import RoleSearch from "../../components/roles/RoleSearch";
import RolePagination from "../../components/roles/RolePagination";
import RoleFormModal from "../../components/roles/RoleFormModal";
import PermissionModal from "../../components/roles/PermissionModal";

/* TYPES */
export type Permission = {
  id: number;
  name: string;
  codename: string;
};

export type Role = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  permissions?: (number | Permission)[];
};

const ITEMS_PER_PAGE = 6;

/* =========================
   HELPER (IMPORTANT FIX)
========================= */
const extractPermissionIds = (permissions: any[] = []) => {
  return permissions
    .map((p) => (typeof p === "number" ? p : p?.id))
    .filter(Boolean);
};

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* MODALS */
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [showPermModal, setShowPermModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [savingPermissions, setSavingPermissions] = useState(false);

  /* =====================
     LOAD DATA
  ======================*/
  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await getRoles();

      // FIX: API returns array directly
      setRoles(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      console.error("Failed to load roles", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const res = await getPermissions();

      // FIX: safe fallback
      setPermissions(Array.isArray(res) ? res : res?.data ?? []);
    } catch (err) {
      console.error("Failed to load permissions", err);
    }
  };

  /* =====================
     FILTER + PAGINATION
  ======================*/
  const filtered = useMemo(() => {
    return roles.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  /* =====================
     ROLE ACTIONS
  ======================*/
  const handleCreate = () => {
    setSelectedRole(null);
    setEditMode(false);
    setShowRoleModal(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setEditMode(true);
    setShowRoleModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      await deleteRole(id);
      loadRoles();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSaveRole = async (data: any) => {
    try {
      if (editMode && selectedRole) {
        await updateRole(selectedRole.id, data);
      } else {
        await createRole(data);
      }

      setShowRoleModal(false);
      loadRoles();
    } catch (err) {
      console.error("Save role failed", err);
    }
  };

  /* =====================
     PERMISSIONS
  ======================*/
  const handleOpenPermissions = async (role: Role) => {
    try {
      setSelectedRole(role);

      const roleResponse = await getRole(role.id);
      const roleData = roleResponse?.data ?? roleResponse;

      const ids = extractPermissionIds(roleData?.permissions);

      setSelectedPermissions(ids);
      setShowPermModal(true);
    } catch (err) {
      console.error("Load role permissions failed", err);
    }
  };

  const handleSavePermissions = async (permissionIds: number[]) => {
    if (!selectedRole) return;

    try {
      setSavingPermissions(true);

      await updateRole(selectedRole.id, {
        name: selectedRole.name,
        description: selectedRole.description,
        is_active: selectedRole.is_active,
        permissions: permissionIds,
      });

      await loadRoles();

      setShowPermModal(false);
      setSelectedRole(null);
      setSelectedPermissions([]);
    } catch (error) {
      console.error("Failed to save permissions:", error);
      alert("Failed to save permissions. Please try again.");
    } finally {
      setSavingPermissions(false);
    }
  };

  /* =====================
     UI
  ======================*/
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Roles Management</h1>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          + Add Role
        </button>
      </div>

      {/* SEARCH */}
      <RoleSearch
        search={search}
        setSearch={setSearch}
        setPage={setPage}
      />

      {/* TABLE */}
      <RoleTable
        roles={paginated}
        page={page}
        itemsPerPage={ITEMS_PER_PAGE}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPermission={handleOpenPermissions}
      />

      {/* PAGINATION */}
      <RolePagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      {/* ROLE MODAL */}
      {showRoleModal && (
        <RoleFormModal
          role={selectedRole}
          editMode={editMode}
          onClose={() => setShowRoleModal(false)}
          onSave={handleSaveRole}
        />
      )}

      {/* PERMISSION MODAL */}
      {showPermModal && selectedRole && (
        <PermissionModal
          role={selectedRole}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          setSelectedPermissions={setSelectedPermissions}
          onClose={() => setShowPermModal(false)}
          onSave={handleSavePermissions}
          saving={savingPermissions}
        />
      )}
    </div>
  );
};

export default Roles;