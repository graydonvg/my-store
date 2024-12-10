import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchRegisteredCustomersByDate(numberOfDays: number) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchRegisteredCustomersByDate' });
  logger.info('Fetching registered customers');

  const startDate = dayjs().subtract(numberOfDays, 'day').format('YYYY-MM-DD');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('createdAt, ...userRoles(role)')
      .is('userRoles.role', null)
      .gte('createdAt', startDate);

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return null;
    }

    logger.info('Fetched registered customers successfully');

    return data;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
