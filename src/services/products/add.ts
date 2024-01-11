import { AddProductResponseType, CustomResponseType, InsertProductTypeDb } from '@/types';

export default async function addProduct(
  productData: InsertProductTypeDb
): Promise<CustomResponseType<AddProductResponseType>> {
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
