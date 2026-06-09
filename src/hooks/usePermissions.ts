// hooks/usePermissions.ts
import { useEffect, useState } from 'react';
import { getUserPermissions } from '../api/userApi';

export interface UserPermission {
  id: number;
  name: string;
  codename: string;
}

export const usePermissions = (userId?: number) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserPermissions();
    }
  }, [userId]);

  const loadUserPermissions = async () => {
    try {
      const response = await getUserPermissions(userId!);
      const perms = response.data.map((p: UserPermission) => p.codename);
      setPermissions(perms);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(p => permissions.includes(p));
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};