import { Database } from '@/lib/supabase/database.types';
import { Logger } from 'next-axiom';
import { SupabaseClient } from '@supabase/supabase-js';

const log = new Logger();

export default async function checkAuthorizationServer(
  supabase: SupabaseClient,
  requestedPermission: Database['public']['Enums']['appPermission']
) {
  const logger = log.with({ context: 'utils: checkAuthorizationServer', requestedPermission });
  logger.info('Checking authorization on server');

  const { data: isAuthorized, error } = await supabase.rpc('authorizeInvoker', {
    requestedPermission,
  });

  if (error) {
    throw error;
  }

  logger.info('Checked authorization successfully', { isAuthorized });

  return isAuthorized;
}
