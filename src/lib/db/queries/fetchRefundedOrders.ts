import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import dayjs from 'dayjs';
import { CONSTANTS } from '@/constants';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchUnsuccessfulOrderDates(numberOfDays: number) {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchRefundedOrders' });
  logger.info('Fetching refunded orders');

  const startDate = dayjs().subtract(numberOfDays, 'day').format('YYYY-MM-DD');

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('createdAt, orderStatus')
      .or('orderStatus.eq.refunded, orderStatus.eq.returned')
      .gte('createdAt', startDate);

    if (error) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error });
      return null;
    }

    logger.info('Fetched refunded orders successfully');

    return data;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
