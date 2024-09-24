import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CONSTANTS } from '@/constants';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchPreviousYearSalesTotal() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchPreviousYearSalesTotal' });
  logger.info('Fetching sales total for previous year');

  try {
    const { data, error } = await supabase.rpc('getPreviousYearSalesTotal');

    if (error) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error });
      return null;
    }

    logger.info('Fetched sales total for previous successfully');

    return data;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
