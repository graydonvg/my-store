import { CONSTANTS } from '@/constants';
import { AddProduct, CreateUser, ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function addProduct(data: AddProduct): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: addProduct' });

  logger.info('Attempting to add product');

  try {
    const response = await fetch('/api/secure/admin/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}

export async function createNewUser(data: CreateUser): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: createNewUser' });

  logger.info('Attempting to create user');

  try {
    const response = await fetch('/api/secure/admin/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}
