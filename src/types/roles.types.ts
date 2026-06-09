// src/types/roles.types.ts

/**
 * Role status options
 */
export type RoleStatus = 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';

/**
 * Permission resource types
 */
export type PermissionResource = 
  | 'user'
  | 'role'
  | 'permission'
  | 'team'
  | 'ticket'
  | 'customer'
  | 'report'
  | 'setting'
  | 'category'
  | 'priority'
  | 'location'
  | 'property'
  | 'integration'
  | 'webhook'
  | 'audit'
  | 'backup';

/**
 * Permission action types
 */
export type PermissionAction = 
  | 'create'
  | 'view'
  | 'edit'
  | 'delete'
  | 'assign'
  | 'approve'
  | 'export'
  | 'import'
  | 'manage'
  | 'sync';

/**
 * Combined permission string format: "resource:action"
 * Example: "user:create", "ticket:view", "role:manage"
 */
export type Permission = `${PermissionResource}:${PermissionAction}` | string;

/**
 * Permission definition
 */
export interface PermissionDefinition {
  id: number;
  name: Permission;
  resource: PermissionResource;
  action: PermissionAction;
  description?: string;
  category?: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Role interface
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
  status: RoleStatus;
  is_system: boolean;
  is_default: boolean;
  level: number; // Higher level = more privileges
  created_at: string;
  updated_at: string;
  permissions?: PermissionDefinition[];
  user_count?: number;
  metadata?: Record<string, any>;
}

/**
 * Role creation payload
 */
export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: Permission[];
  level?: number;
  is_default?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Role update payload
 */
export interface UpdateRolePayload extends Partial<CreateRolePayload> {
  id: number;
  status?: RoleStatus;
}

/**
 * Role list query parameters
 */
export interface RoleListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: RoleStatus;
  is_system?: boolean;
  is_default?: boolean;
  ordering?: string;
}

/**
 * Role list response
 */
export interface RoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

/**
 * Permission list query parameters
 */
export interface PermissionListParams {
  page?: number;
  page_size?: number;
  search?: string;
  resource?: PermissionResource;
  category?: string;
  is_system?: boolean;
  ordering?: string;
}

/**
 * Permission list response
 */
export interface PermissionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PermissionDefinition[];
}

/**
 * Role assignment payload
 */
export interface AssignRolePayload {
  user_id: number;
  role_id: number;
  assigned_by?: number;
  expires_at?: string;
}

/**
 * User role assignment
 */
export interface UserRoleAssignment {
  id: number;
  user_id: number;
  user_name: string;
  role_id: number;
  role_name: string;
  assigned_by: number;
  assigned_by_name: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
}

/**
 * Role permission assignment payload
 */
export interface AssignRolePermissionPayload {
  role_id: number;
  permissions: Permission[];
}

/**
 * Role statistics
 */
export interface RoleStatistics {
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  system_roles: number;
  custom_roles: number;
  users_per_role: {
    role_id: number;
    role_name: string;
    user_count: number;
  }[];
}

/**
 * Role permission matrix (visual representation)
 */
export interface PermissionMatrix {
  roles: Role[];
  permissions: PermissionDefinition[];
  matrix: {
    role_id: number;
    permission_id: number;
    has_permission: boolean;
  }[];
}

/**
 * Permission category with grouped permissions
 */
export interface PermissionCategory {
  name: string;
  label: string;
  description?: string;
  permissions: PermissionDefinition[];
}

/**
 * Role hierarchy (for inheritance)
 */
export interface RoleHierarchy {
  role_id: number;
  role_name: string;
  level: number;
  parent_id?: number;
  parent_name?: string;
  children: RoleHierarchy[];
  permissions: Permission[];
}

/**
 * Role comparison result
 */
export interface RoleComparison {
  role_a: {
    id: number;
    name: string;
    permissions: Permission[];
  };
  role_b: {
    id: number;
    name: string;
    permissions: Permission[];
  };
  only_in_role_a: Permission[];
  only_in_role_b: Permission[];
  common: Permission[];
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  has_permission: boolean;
  role_name?: string;
  permission_name?: Permission;
  reason?: string;
}

/**
 * Bulk role assignment payload
 */
export interface BulkRoleAssignmentPayload {
  user_ids: number[];
  role_id: number;
  assigned_by: number;
}

/**
 * Bulk role assignment response
 */
export interface BulkRoleAssignmentResponse {
  success: boolean;
  assigned_count: number;
  failed_count: number;
  errors?: {
    user_id: number;
    error: string;
  }[];
}

/**
 * Role export format
 */
export interface RoleExport {
  version: string;
  exported_at: string;
  roles: Role[];
  permissions: PermissionDefinition[];
  assignments?: UserRoleAssignment[];
}

/**
 * Role import payload
 */
export interface RoleImportPayload {
  data: RoleExport;
  merge_strategy?: 'replace' | 'merge' | 'skip';
  dry_run?: boolean;
}

/**
 * Role import response
 */
export interface RoleImportResponse {
  success: boolean;
  created_roles: number;
  updated_roles: number;
  skipped_roles: number;
  created_permissions: number;
  errors: string[];
}

/**
 * Default role definitions
 */
export const DEFAULT_ROLES: Omit<Role, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'SUPER_ADMIN',
    description: 'Super Administrator with full system access',
    status: 'ACTIVE',
    is_system: true,
    is_default: false,
    level: 100,
  },
  {
    name: 'ADMIN',
    description: 'Administrator with most system privileges',
    status: 'ACTIVE',
    is_system: true,
    is_default: false,
    level: 90,
  },
  {
    name: 'MANAGER',
    description: 'Manager with team and report access',
    status: 'ACTIVE',
    is_system: true,
    is_default: false,
    level: 70,
  },
  {
    name: 'TEAM_LEAD',
    description: 'Team Leader with team management privileges',
    status: 'ACTIVE',
    is_system: true,
    is_default: false,
    level: 60,
  },
  {
    name: 'AGENT',
    description: 'Support Agent with ticket management',
    status: 'ACTIVE',
    is_system: true,
    is_default: true,
    level: 50,
  },
  {
    name: 'QA_ANALYST',
    description: 'Quality Assurance Analyst',
    status: 'ACTIVE',
    is_system: true,
    is_default: false,
    level: 55,
  },
  {
    name: 'USER',
    description: 'Regular user with basic access',
    status: 'ACTIVE',
    is_system: true,
    is_default: false,
    level: 10,
  },
];

/**
 * Default permission definitions
 */
export const DEFAULT_PERMISSIONS: Omit<PermissionDefinition, 'id' | 'created_at' | 'updated_at'>[] = [
  // User permissions
  { name: 'user:create', resource: 'user', action: 'create', description: 'Create new users', category: 'users', is_system: true },
  { name: 'user:view', resource: 'user', action: 'view', description: 'View user details', category: 'users', is_system: true },
  { name: 'user:edit', resource: 'user', action: 'edit', description: 'Edit user information', category: 'users', is_system: true },
  { name: 'user:delete', resource: 'user', action: 'delete', description: 'Delete users', category: 'users', is_system: true },
  { name: 'user:assign', resource: 'user', action: 'assign', description: 'Assign roles to users', category: 'users', is_system: true },
  
  // Role permissions
  { name: 'role:create', resource: 'role', action: 'create', description: 'Create new roles', category: 'roles', is_system: true },
  { name: 'role:view', resource: 'role', action: 'view', description: 'View role details', category: 'roles', is_system: true },
  { name: 'role:edit', resource: 'role', action: 'edit', description: 'Edit role information', category: 'roles', is_system: true },
  { name: 'role:delete', resource: 'role', action: 'delete', description: 'Delete roles', category: 'roles', is_system: true },
  { name: 'role:manage', resource: 'role', action: 'manage', description: 'Manage role permissions', category: 'roles', is_system: true },
  
  // Permission permissions
  { name: 'permission:view', resource: 'permission', action: 'view', description: 'View permissions', category: 'permissions', is_system: true },
  { name: 'permission:manage', resource: 'permission', action: 'manage', description: 'Manage permissions', category: 'permissions', is_system: true },
  
  // Team permissions
  { name: 'team:create', resource: 'team', action: 'create', description: 'Create new teams', category: 'teams', is_system: true },
  { name: 'team:view', resource: 'team', action: 'view', description: 'View team details', category: 'teams', is_system: true },
  { name: 'team:edit', resource: 'team', action: 'edit', description: 'Edit team information', category: 'teams', is_system: true },
  { name: 'team:delete', resource: 'team', action: 'delete', description: 'Delete teams', category: 'teams', is_system: true },
  { name: 'team:manage', resource: 'team', action: 'manage', description: 'Manage team members', category: 'teams', is_system: true },
  
  // Ticket permissions
  { name: 'ticket:create', resource: 'ticket', action: 'create', description: 'Create tickets', category: 'tickets', is_system: true },
  { name: 'ticket:view', resource: 'ticket', action: 'view', description: 'View tickets', category: 'tickets', is_system: true },
  { name: 'ticket:edit', resource: 'ticket', action: 'edit', description: 'Edit tickets', category: 'tickets', is_system: true },
  { name: 'ticket:delete', resource: 'ticket', action: 'delete', description: 'Delete tickets', category: 'tickets', is_system: true },
  { name: 'ticket:assign', resource: 'ticket', action: 'assign', description: 'Assign tickets', category: 'tickets', is_system: true },
  { name: 'ticket:approve', resource: 'ticket', action: 'approve', description: 'Approve tickets', category: 'tickets', is_system: true },
  
  // Customer permissions
  { name: 'customer:create', resource: 'customer', action: 'create', description: 'Create customers', category: 'customers', is_system: true },
  { name: 'customer:view', resource: 'customer', action: 'view', description: 'View customers', category: 'customers', is_system: true },
  { name: 'customer:edit', resource: 'customer', action: 'edit', description: 'Edit customers', category: 'customers', is_system: true },
  { name: 'customer:delete', resource: 'customer', action: 'delete', description: 'Delete customers', category: 'customers', is_system: true },
  { name: 'customer:export', resource: 'customer', action: 'export', description: 'Export customer data', category: 'customers', is_system: true },
  
  // Report permissions
  { name: 'report:view', resource: 'report', action: 'view', description: 'View reports', category: 'reports', is_system: true },
  { name: 'report:export', resource: 'report', action: 'export', description: 'Export reports', category: 'reports', is_system: true },
  
  // Setting permissions
  { name: 'setting:view', resource: 'setting', action: 'view', description: 'View settings', category: 'settings', is_system: true },
  { name: 'setting:manage', resource: 'setting', action: 'manage', description: 'Manage settings', category: 'settings', is_system: true },
  
  // Location permissions
  { name: 'location:create', resource: 'location', action: 'create', description: 'Create locations', category: 'locations', is_system: true },
  { name: 'location:view', resource: 'location', action: 'view', description: 'View locations', category: 'locations', is_system: true },
  { name: 'location:edit', resource: 'location', action: 'edit', description: 'Edit locations', category: 'locations', is_system: true },
  { name: 'location:delete', resource: 'location', action: 'delete', description: 'Delete locations', category: 'locations', is_system: true },
  { name: 'location:import', resource: 'location', action: 'import', description: 'Import locations', category: 'locations', is_system: true },
  
  // Property permissions
  { name: 'property:create', resource: 'property', action: 'create', description: 'Create properties', category: 'properties', is_system: true },
  { name: 'property:view', resource: 'property', action: 'view', description: 'View properties', category: 'properties', is_system: true },
  { name: 'property:edit', resource: 'property', action: 'edit', description: 'Edit properties', category: 'properties', is_system: true },
  { name: 'property:delete', resource: 'property', action: 'delete', description: 'Delete properties', category: 'properties', is_system: true },
  
  // Integration permissions
  { name: 'integration:view', resource: 'integration', action: 'view', description: 'View integrations', category: 'integrations', is_system: true },
  { name: 'integration:manage', resource: 'integration', action: 'manage', description: 'Manage integrations', category: 'integrations', is_system: true },
  { name: 'integration:sync', resource: 'integration', action: 'sync', description: 'Sync integrations', category: 'integrations', is_system: true },
  
  // Webhook permissions
  { name: 'webhook:create', resource: 'webhook', action: 'create', description: 'Create webhooks', category: 'webhooks', is_system: true },
  { name: 'webhook:view', resource: 'webhook', action: 'view', description: 'View webhooks', category: 'webhooks', is_system: true },
  { name: 'webhook:edit', resource: 'webhook', action: 'edit', description: 'Edit webhooks', category: 'webhooks', is_system: true },
  { name: 'webhook:delete', resource: 'webhook', action: 'delete', description: 'Delete webhooks', category: 'webhooks', is_system: true },
  
  // Audit permissions
  { name: 'audit:view', resource: 'audit', action: 'view', description: 'View audit logs', category: 'audit', is_system: true },
  { name: 'audit:export', resource: 'audit', action: 'export', description: 'Export audit logs', category: 'audit', is_system: true },
  
  // Backup permissions
  { name: 'backup:create', resource: 'backup', action: 'create', description: 'Create backups', category: 'backup', is_system: true },
  { name: 'backup:view', resource: 'backup', action: 'view', description: 'View backups', category: 'backup', is_system: true },
  { name: 'backup:restore', resource: 'backup', action: 'manage', description: 'Restore from backups', category: 'backup', is_system: true },
];

/**
 * Helper function to check if a role has a specific permission
 */
export const roleHasPermission = (role: Role, permission: Permission): boolean => {
  return role.permissions?.some(p => p.name === permission) ?? false;
};

/**
 * Helper function to get all permissions for a role
 */
export const getRolePermissions = (role: Role): Permission[] => {
  return role.permissions?.map(p => p.name) ?? [];
};

/**
 * Helper function to group permissions by category
 */
export const groupPermissionsByCategory = (
  permissions: PermissionDefinition[]
): PermissionCategory[] => {
  const grouped = permissions.reduce((acc, permission) => {
    const category = permission.category || 'other';
    if (!acc[category]) {
      acc[category] = {
        name: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        permissions: [],
      };
    }
    acc[category].permissions.push(permission);
    return acc;
  }, {} as Record<string, PermissionCategory>);
  
  return Object.values(grouped);
};

/**
 * Helper function to compare two roles
 */
export const compareRoles = (roleA: Role, roleB: Role): RoleComparison => {
  const permissionsA = new Set(getRolePermissions(roleA));
  const permissionsB = new Set(getRolePermissions(roleB));
  
  const onlyInA = [...permissionsA].filter(p => !permissionsB.has(p));
  const onlyInB = [...permissionsB].filter(p => !permissionsA.has(p));
  const common = [...permissionsA].filter(p => permissionsB.has(p));
  
  return {
    role_a: { id: roleA.id, name: roleA.name, permissions: [...permissionsA] },
    role_b: { id: roleB.id, name: roleB.name, permissions: [...permissionsB] },
    only_in_role_a: onlyInA,
    only_in_role_b: onlyInB,
    common: common,
  };
};