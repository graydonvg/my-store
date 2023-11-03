import { Database } from '@/lib/database.types';
import { CustomResponseType } from '@/types';

type formDataType = Pick<Database['public']['Tables']['users']['Row'], 'first_name' | 'last_name'>;

export default async function updateUser(formData: formDataType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/update', {
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
