import { UserRole } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';

export default async function getUserRoleFromSession(supabase: SupabaseClient) {
  let role: UserRole | null = null;

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (session && !sessionError) {
    const jwt = jwtDecode(session.access_token) as { user_role: UserRole };
    role = jwt.user_role;
  }

  return role;
}
