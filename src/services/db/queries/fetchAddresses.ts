import { LOGGER_ERROR_MESSAGES } from '@/constants';
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
    } = await supabase.auth.getUser();

    const { data: addresses, error: addressesError } = await supabase
      .from('addresses')
      .select('*')
      .eq('userId', authUser?.id ?? '')
      .order('createdAt', { ascending: true });

    if (addressesError) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: addressesError });
      return null;
    }

    logger.info('Fetched addresses successfully');

    return addresses;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
