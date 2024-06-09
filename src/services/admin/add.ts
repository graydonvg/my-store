import { CONSTANTS } from '@/constants';
import {
  AddNewUserAdminResponse,
  AddProduct,
  CreateUserAdminDb,
  ResponseWithData,
  ResponseWithNoData,
  UserAuthData,
} from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function addProduct(productData: AddProduct): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'addProduct' });

  serviceLog.info('Attempting to add product');

  try {
    const response = await fetch('/api/secure/admin/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await serviceLog.flush();
  }
}

export async function createNewUser(
  userData: UserAuthData & CreateUserAdminDb
): Promise<ResponseWithData<AddNewUserAdminResponse | null>> {
  const serviceLog = log.with({ scope: 'service', function: 'createNewUser' });

  serviceLog.info('Attempting to create user');

  try {
    const response = await fetch('/api/secure/admin/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED, data: null };
  } finally {
    await serviceLog.flush();
  }
}
