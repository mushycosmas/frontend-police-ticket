// src/api/roleApi.ts
import api from "./axios";

// ================= TYPES =================
export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
  category?: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  is_system: boolean;
  is_default: boolean;
  level: number;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
  user_count?: number;
}

export interface RoleListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  is_system?: boolean;
  is_default?: boolean;
}

export interface RoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: number[];
  level?: number;
  is_default?: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: number[];
  level?: number;
  is_default?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
}

export interface AssignPermissionPayload {
  permissions: number[];
}

// ================= ROLES API =================

/**
 * Get all roles with optional filtering
 */
export const getRoles = async (params?: RoleListParams): Promise<RoleListResponse> => {
  const response = await api.get("/roles/roles/", { params });
  return response.data;
};

/**
 * Get single role by ID
 */
export const getRole = async (id: number): Promise<Role> => {
  const response = await api.get(`/roles/roles/${id}/`);
  return response.data;
};

/**
 * Create new role
 */
export const createRole = async (data: CreateRolePayload): Promise<Role> => {
  const response = await api.post("/roles/roles/", data);
  return response.data;
};

/**
 * Update role (full update)
 */
export const updateRole = async (id: number, data: UpdateRolePayload): Promise<Role> => {
  console.log("Updating role with data:", data);
  const response = await api.put(`/roles/roles/${id}/`, data);
  return response.data;
};

/**
 * Partial update role (PATCH)
 */
export const patchRole = async (id: number, data: Partial<UpdateRolePayload>): Promise<Role> => {
  const response = await api.patch(`/roles/roles/${id}/`, data);
  return response.data;
};

/**
 * Delete role
 */
export const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/roles/${id}/`);
};

// ================= PERMISSIONS API =================

/**
 * Get all permissions
 */
export const getPermissions = async (params?: {
  page?: number;
  page_size?: number;
  resource?: string;
  category?: string;
}): Promise<{ count: number; results: Permission[] }> => {
  const response = await api.get("/roles/permissions/", { params });
  return response.data;
};

/**
 * Get permissions for a specific role
 */
export const getRolePermissions = async (roleId: number): Promise<Permission[]> => {
  const response = await api.get(`/roles/${roleId}/permissions/`);
  return response.data;
};

/**
 * Assign multiple permissions to role
 */
export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]): Promise<Role> => {
  const response = await api.post(`/roles/${roleId}/assign_permissions/`, { 
    permissions: permissionIds 
  });
  return response.data;
};

/**
 * Add single permission to role
 */
export const addPermissionToRole = async (roleId: number, permissionId: number): Promise<Role> => {
  const response = await api.post(`/roles/${roleId}/add_permission/`, { 
    permission_id: permissionId 
  });
  return response.data;
};

/**
 * Remove single permission from role
 */
export const removePermissionFromRole = async (roleId: number, permissionId: number): Promise<Role> => {
  const response = await api.post(`/roles/${roleId}/remove_permission/`, { 
    permission_id: permissionId 
  });
  return response.data;
};

/**
 * Remove multiple permissions from role
 */
export const removePermissionsFromRole = async (roleId: number, permissionIds: number[]): Promise<Role> => {
  const response = await api.post(`/roles/${roleId}/remove_permissions/`, { 
    permissions: permissionIds 
  });
  return response.data;
};

/**
 * Sync role permissions (replace all)
 */
export const syncRolePermissions = async (roleId: number, permissionIds: number[]): Promise<Role> => {
  const response = await api.put(`/roles/${roleId}/permissions/`, { 
    permissions: permissionIds 
  });
  return response.data;
};

// ================= ASSIGNMENT API =================

/**
 * Assign role to user
 */
export const assignRoleToUser = async (userId: number, roleId: number): Promise<any> => {
  const response = await api.post(`/users/${userId}/assign_role/`, { role_id: roleId });
  return response.data;
};

/**
 * Remove role from user
 */
export const removeRoleFromUser = async (userId: number, roleId: number): Promise<void> => {
  await api.delete(`/users/${userId}/roles/${roleId}/`);
};

/**
 * Get user's roles
 */
export const getUserRoles = async (userId: number): Promise<Role[]> => {
  const response = await api.get(`/users/${userId}/roles/`);
  return response.data;
};

// ================= UTILITY API =================

/**
 * Get role statistics
 */
export const getRoleStats = async (): Promise<{
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  system_roles: number;
  custom_roles: number;
  users_per_role: Array<{ role_id: number; role_name: string; user_count: number }>;
}> => {
  const response = await api.get("/roles/stats/");
  return response.data;
};

/**
 * Export roles (for backup)
 */
export const exportRoles = async (): Promise<Blob> => {
  const response = await api.get("/roles/export/", {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Import roles from file
 */
export const importRoles = async (file: File, mergeStrategy: 'replace' | 'merge' | 'skip' = 'merge'): Promise<{
  success: boolean;
  created_roles: number;
  updated_roles: number;
  skipped_roles: number;
  errors: string[];
}> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('merge_strategy', mergeStrategy);
  
  const response = await api.post("/roles/import/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Get permission categories
 */
export const getPermissionCategories = async (): Promise<{
  categories: Array<{ name: string; label: string; count: number }>;
}> => {
  const response = await api.get("/roles/permissions/categories/");
  return response.data;
};






export const createPermission = (data: {
  name: string;
  codename: string;
  content_type_id: number;  // Make it required, not optional
}) => {
  console.log("Creating permission with data:", data);
  return api.post("/roles/permissions/", data);
};


// ✏️ UPDATE permission
export const updatePermission = (
  id: number,
  data: {
    name?: string;
    codename?: string;
  }
) => api.put(`/roles/permissions/${id}/`, data);