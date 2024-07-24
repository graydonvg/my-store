import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';
import { CONSTANTS } from '@/constants';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchOrderTotalsThisMonth() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchOrderTotalsThisMonth' });
  logger.info('Fetching order totals for current month');

  const startOfMonth = dayjs().startOf('month');
  const now = dayjs();

  try {
    const { data: orderTotalsThisMonth, error: orderTotalsError } = await supabase
      .from('orders')
      .select('createdAt, orderTotal')
      .or('orderStatus.eq.paid, orderStatus.eq.processing, orderStatus.eq.shipped, orderStatus.eq.delivered')
      .gte('createdAt', startOfMonth)
      .lte('createdAt', now);

    if (orderTotalsError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: orderTotalsError });
      return null;
    }

    logger.info('Fetched order totals for current month successfully');

    return orderTotalsThisMonth;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
