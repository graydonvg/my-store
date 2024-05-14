import { CustomResponse, UpdateOrderAdminDb, UpdateUserAdminDb } from '@/types';

export async function updateUserAdmin(userData: UpdateUserAdminDb): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/users/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/admin/update. ${error}`);
  }
}

export async function updateOrderAdmin(orderData: UpdateOrderAdminDb): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/orders/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/admin/update. ${error}`);
  }
}
