import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchOrderTotalsThisYear() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchOrderTotalsThisYear' });
  logger.info('Fetching order totals for current year');

  const startOfYear = dayjs().startOf('year');

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('createdAt, orderTotal')
      .or('orderStatus.eq.paid, orderStatus.eq.processing, orderStatus.eq.shipped, orderStatus.eq.delivered')
      .gte('createdAt', startOfYear);

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return null;
    }

    logger.info('Fetched order totals for current year successfully');

    return data;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
