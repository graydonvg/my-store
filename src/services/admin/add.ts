import { AddNewUserAdminResponse, AddProduct, CreateUserAdminDb, CustomResponse, UserAuthData } from '@/types';

export async function addProduct(productData: AddProduct): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/products/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/add. ${error}`);
  }
}

export async function createNewUserAdmin(
  userData: UserAuthData & CreateUserAdminDb
): Promise<CustomResponse<AddNewUserAdminResponse>> {
  try {
    const response = await fetch('/api/secure/admin/users/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/admin/add. ${error}`);
  }
}
