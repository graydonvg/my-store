import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { DeleteProductImage, ResponseWithNoData } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteProducts(productIds: number[]): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteProducts' });

  logger.info('Attempting to delete product(s)');

  try {
    const response = await fetch('/api/secure/admin/products/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productIds),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}

export async function deleteProductImages(imageData: DeleteProductImage): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteProductImages' });

  logger.info('Attempting to delete product image(s)');

  try {
    const response = await fetch('/api/secure/admin/products/images/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}

export async function deleteUsers(userIds: GridRowSelectionModel): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteUser' });

  logger.info('Attempting to delete user(s)');

  try {
    const response = await fetch('/api/secure/admin/users/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userIds),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}
