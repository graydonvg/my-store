import { CustomResponseType, UpdateProductType } from '@/types';

export default async function updateProduct(formData: UpdateProductType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/auth/products/update', {
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
