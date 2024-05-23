import { CustomResponse } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';

export async function deleteProduct(productId: string): Promise<CustomResponse> {
  try {
    const response = await fetch(`/api/secure/admin/products/delete?product_id=${productId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/delete. ${error}`);
  }
}

export async function deleteProductImageDataFromDb(productImageId: string): Promise<CustomResponse> {
  try {
    const response = await fetch(`/api/secure/admin/product-image-data/delete?product_image_id=${productImageId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/product-image-data/delete. ${error}`);
  }
}

export async function deleteUserAdmin(userIds: GridRowSelectionModel): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/users/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userIds),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/admin/delete. ${error}`);
  }
}
