// api/permissionApi.js (Updated - now uses roles endpoints)
import api from "./axios";

// GET ALL PERMISSIONS (from roles app)
export const getPermissions = () => api.get("/roles/permissions/");

// ASSIGN PERMISSIONS TO ROLE
export const assignPermissionsToRole = (roleId, permissionIds) => 
    api.post(`/roles/roles/${roleId}/assign_permissions/`, { 
        permissions: permissionIds 
    });

// GET ROLE PERMISSIONS
export const getRolePermissions = (roleId) => 
    api.get(`/roles/roles/${roleId}/`);