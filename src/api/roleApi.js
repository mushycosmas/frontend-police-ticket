import api from "./axios";

// ======================
// ROLES API
// ======================

// GET ALL ROLES
export const getRoles = () => api.get("/roles/");

// GET SINGLE ROLE
export const getRole = (id) => api.get(`/roles/${id}/`);

// CREATE ROLE
export const createRole = (data) => api.post("/roles/", data);

// UPDATE ROLE
export const updateRole = (id, data) => {
    // The data should include permissions array
    console.log("Updating role with data:", data);
    return api.put(`/roles/${id}/`, data);
};


// PARTIAL UPDATE (optional)
export const patchRole = (id, data) =>
    api.patch(`/roles/${id}/`, data);

// DELETE ROLE
export const deleteRole = (id) =>
    api.delete(`/roles/${id}/`);

// ======================
// PERMISSIONS API (ADD THESE)
// ======================


// ASSIGN MULTIPLE PERMISSIONS TO ROLE
export const assignPermissionsToRole = (roleId, permissionIds) =>
    api.post(`/roles/${roleId}/assign_permissions/`, { 
        permissions: permissionIds 
    });

// ADD SINGLE PERMISSION TO ROLE
export const addPermissionToRole = (roleId, permissionId) =>
    api.post(`/roles/${roleId}/add_permission/`, { 
        permission_id: permissionId 
    });

// REMOVE SINGLE PERMISSION FROM ROLE
export const removePermissionFromRole = (roleId, permissionId) =>
    api.post(`/roles/${roleId}/remove_permission/`, { 
        permission_id: permissionId 
    });

// GET ROLE'S PERMISSIONS (optional helper)
export const getRolePermissions = (roleId) =>
    api.get(`/roles/${roleId}/permissions/`);


export const getPermissions = () => api.get("/roles/permissions/");