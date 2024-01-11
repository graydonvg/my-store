import { CustomResponseType } from '@/types';

export default async function deleteProductImageDataFromDb(productImageId: string): Promise<CustomResponseType> {
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
