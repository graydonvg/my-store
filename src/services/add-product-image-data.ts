import { AddProductImageDataDbType, CustomResponseType } from '@/types';

export default async function addProductImageData(imageData: AddProductImageDataDbType[]): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/product-image-data/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-user. ${error}`);
  }
}