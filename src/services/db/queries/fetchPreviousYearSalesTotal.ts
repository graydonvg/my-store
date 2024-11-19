import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchPreviousYearSalesTotal() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchPreviousYearSalesTotal' });
  logger.info('Fetching sales total for previous year');

  try {
    const { data, error } = await supabase.rpc('getPreviousYearSalesTotal');

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return null;
    }

    logger.info('Fetched sales total for previous successfully');

    return data;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
