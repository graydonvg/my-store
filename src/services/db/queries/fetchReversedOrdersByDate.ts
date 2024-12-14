import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchReversedOrdersByDate(numberOfDays: number) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchReversedOrdersByDate' });
  logger.info('Attempting to fetch reversed orders');

  const startDate = dayjs().subtract(numberOfDays, 'day').format('YYYY-MM-DD');

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('createdAt, orderStatus')
      .or('orderStatus.eq.refunded, orderStatus.eq.returned')
      .gte('createdAt', startDate);

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return null;
    }

    logger.info('Fetched reversed orders successfully');

    return data;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
