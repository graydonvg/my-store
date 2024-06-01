import { CONSTANTS } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function revalidateAllData(): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'revalidateAllData', path: '/', type: 'layout' });

  serviceLog.info('Attempting to revalidate all data');

  try {
    const response = await fetch('/api/secure/admin/revalidate');

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL };
  } finally {
    await serviceLog.flush();
  }
}
