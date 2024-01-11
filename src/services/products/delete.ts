import { CustomResponseType } from '@/types';

export default async function deleteProduct(productId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch(`/api/admin/products/delete?product_id=${productId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/delete. ${error}`);
  }
}
