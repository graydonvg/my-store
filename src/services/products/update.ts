import { CustomResponseType, UpdateProductType } from '@/types';

export default async function updateProduct(productData: UpdateProductType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/admin/products/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/update. ${error}`);
  }
}
