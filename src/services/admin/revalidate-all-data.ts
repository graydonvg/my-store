import { CONSTANTS } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function revalidateAllData(): Promise<ResponseWithNoData> {
  const logger = log.with({
    context: 'service: revalidateAllData',
    revalidatePath: '/',
    revalidateType: 'layout',
  });

  logger.info('Attempting to revalidate all data');

  try {
    const response = await fetch('/api/secure/admin/revalidate');

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}
