import { Database } from '@/lib/supabase/database.types';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import { toast } from 'react-toastify';
import { Logger } from 'next-axiom';
import { USER_ERROR_MESSAGES } from '@/constants';

const log = new Logger();
const supabase = createSupabaseBrowserClient();

export default async function checkAuthorizationClient(
  requestedPermission: Database['public']['Enums']['appPermission']
) {
  const logger = log.with({ context: 'utils: checkAuthorizationClient', requestedPermission });
  logger.info('Checking authorization on client');

  try {
    const { data: isAuthorized, error } = await supabase.rpc('authorizeInvoker', {
      requestedPermission,
    });

    if (error) {
      const errorMessage = 'Error checking authorization';
      log.error(errorMessage, { error });
      toast.error(`${errorMessage}. ${error}`);
      return false;
    }

    if (!isAuthorized) toast.error(USER_ERROR_MESSAGES.notAuthorized);

    logger.info('Checked authorization successfully', { isAuthorized });

    return isAuthorized;
  } catch (error) {
    log.error('An unexpected error occured during authorization check.', { error });

    toast.error('An unexpected error occured during authorization check. Please try again later.');

    return false;
  } finally {
    await log.flush();
  }
}
