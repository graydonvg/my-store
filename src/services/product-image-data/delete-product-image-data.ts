import { CustomResponseType } from '@/types';

export default async function deleteProductImageDataFromDb(productImageId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/admin/product-image-data/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productImageId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/delete-product-image-data. ${error}`);
  }
}
