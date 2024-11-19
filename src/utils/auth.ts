import { LOGGER_ERROR_MESSAGES } from '@/constants';
import { UserRole } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function getUserRoleFromSession(supabase: SupabaseClient) {
  let role: UserRole = null;

  const logger = log.with({ context: 'utils: getUserRoleFromSession' });
  logger.info('Getting user role from session');

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      logger.error('Error getting user role from session', { error: sessionError });
      return null;
    }

    if (session) {
      const jwt = jwtDecode(session.access_token) as { user_role: UserRole };
      role = jwt.user_role;
    }

    logger.info('Got user role from session successfully');

    return role;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}

export function getUserRoleBoolean(userRole: UserRole) {
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isOwner = userRole === 'owner';

  return { isAdmin, isManager, isOwner };
}
