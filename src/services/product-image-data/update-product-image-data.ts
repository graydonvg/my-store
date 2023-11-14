import { CustomResponseType, ProductImageDataStoreType } from '@/types';

export default async function updateProductImageData(
  imageData: ProductImageDataStoreType[]
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/admin/product-image-data/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-product-image-data. ${error}`);
  }
}
