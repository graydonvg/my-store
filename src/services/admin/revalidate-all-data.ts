import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
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
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}
