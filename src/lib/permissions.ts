import { UserRole } from "@/types/user";

export type Permission = 'view_admin_dashboard' | 'view_user_dashboard' | 'manage_users';

const permissions: Record<UserRole, Permission[]> = {
  ADMIN: ['view_admin_dashboard', 'view_user_dashboard', 'manage_users'],
  USER: ['view_user_dashboard'],
};

export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return permissions[role] || [];
};
