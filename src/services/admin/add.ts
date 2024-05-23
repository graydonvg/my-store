import {
  AddNewUserAdminResponse,
  AddProductResponse,
  CreateUserAdminDb,
  CustomResponse,
  InsertProductDb,
  InsertProductImageDataDb,
  UserAuthData,
} from '@/types';

export async function addProduct(productData: InsertProductDb): Promise<CustomResponse<AddProductResponse>> {
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

export async function addProductImageData(imageData: InsertProductImageDataDb[]): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/product-image-data/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/product-image-data/add. ${error}`);
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
