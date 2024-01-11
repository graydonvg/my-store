import { AddProductResponseType, CustomResponseType, InsertProductTypeDb } from '@/types';

export default async function addProduct(
  formData: InsertProductTypeDb
): Promise<CustomResponseType<AddProductResponseType>> {
  try {
    const response = await fetch('/api/admin/products/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-product. ${error}`);
  }
}
