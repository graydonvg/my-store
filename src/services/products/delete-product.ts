import { CustomResponseType } from '@/types';

export default async function deleteProduct(product_id: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/admin/products/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(product_id),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-user. ${error}`);
  }
}
