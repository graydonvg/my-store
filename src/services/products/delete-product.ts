import { CustomResponseType } from '@/types';

export default async function deleteProduct(productId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/admin/products/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/delete-product. ${error}`);
  }
}
