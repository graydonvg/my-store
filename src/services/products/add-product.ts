import { AddProductDbType, CustomResponseType } from '@/types';

export default async function addProduct(formData: AddProductDbType): Promise<
  CustomResponseType<{
    product_id: string;
  }>
> {
  try {
    const response = await fetch('/api/auth/products/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-user. ${error}`);
  }
}
