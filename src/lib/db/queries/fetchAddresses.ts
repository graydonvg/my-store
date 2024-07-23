import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchAddresses() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchAddresses' });
  logger.info('Fetching user addresses');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { error: authError });

      return null;
    }

    if (!authUser) {
      logger.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED);

      return null;
    }

    const { data: addresses, error: addressesError } = await supabase
      .from('addresses')
      .select('*')
      .eq('userId', authUser.id)
      .order('createdAt', { ascending: true });

    if (addressesError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: addressesError });

      return null;
    }

    logger.info('Fetched addresses successfully', { count: addresses.length });

    return addresses;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return null;
  } finally {
    await logger.flush();
  }
}
