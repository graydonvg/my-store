import { CONSTANTS } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteProduct(id: number): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteProduct' });

  logger.info('Attempting to delete product');

  try {
    const response = await fetch(`/api/secure/admin/products/delete?product_id=${id}`, {
      method: 'DELETE',
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

export async function deleteProductImageDataFromDb(id: number): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteProductImageDataFromDb' });

  logger.info('Attempting to delete product image data from db');

  try {
    const response = await fetch(`/api/secure/admin/product-image-data/delete?product_image_id=${id}`, {
      method: 'DELETE',
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

export async function deleteUser(userIds: GridRowSelectionModel): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteUser' });

  logger.info('Attempting to delete user');

  try {
    const response = await fetch('/api/secure/admin/users/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userIds),
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
