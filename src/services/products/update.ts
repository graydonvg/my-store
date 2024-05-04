import { CustomResponse, UpdateProductDb } from '@/types';

export default async function updateProduct(productData: UpdateProductDb): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/products/update', {
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
