import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';

export default async function updateProductImageData(
  imageData: InsertProductImageDataTypeStore[]
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/secure/admin/product-image-data/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/product-image-data/update. ${error}`);
  }
}
