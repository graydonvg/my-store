import { CustomResponseType } from '@/types';

export default async function deleteProductImageData(product_image_id: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/product-image-data/delete', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(product_image_id),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/delete-product-image-data. ${error}`);
  }
}
