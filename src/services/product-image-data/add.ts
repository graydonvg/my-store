import { InsertProductImageDataDb, CustomResponse } from '@/types';

export default async function addProductImageData(imageData: InsertProductImageDataDb[]): Promise<CustomResponse> {
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
