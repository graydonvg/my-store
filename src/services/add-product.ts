import { AddNewProductDbType, CustomResponseType } from '@/types';

export default async function addNewProduct(formData: AddNewProductDbType) {
  const response = await fetch('/api/products/add', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data: CustomResponseType = await response.json();

  return data;
}
