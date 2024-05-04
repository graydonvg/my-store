import { AddProductResponse, CustomResponse, InsertProductDb } from '@/types';

export default async function addProduct(productData: InsertProductDb): Promise<CustomResponse<AddProductResponse>> {
  try {
    const response = await fetch('/api/secure/admin/products/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/add. ${error}`);
  }
}
