import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchRegisteredUsersByDate(numberOfDays: number) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchRegisteredUsersByDate' });
  logger.info('Attempting to fetch registered users');

  const startDate = dayjs().subtract(numberOfDays, 'day').format('YYYY-MM-DD');

  try {
    const { data, error } = await supabase.from('users').select('createdAt').gte('createdAt', startDate);

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return null;
    }

    logger.info('Fetched registered users successfully');

    return data;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
