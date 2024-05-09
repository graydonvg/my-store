import { UserRole } from '@/types';

export default function getUserRoleBoolean(userRole: UserRole) {
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isOwner = userRole === 'owner';

  return { isAdmin, isManager, isOwner };
}
