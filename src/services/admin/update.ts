import { CustomResponse, UpdateOrderAdminDb, UpdateProduct, UpdateUserAdminDb } from '@/types';

export async function updateProduct(productData: UpdateProduct): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/products/update', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/update. ${error}`);
  }
}

export async function updateUserAdmin(userData: UpdateUserAdminDb): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/users/update', {
      method: 'PUT',
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
      method: 'PUT',
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
