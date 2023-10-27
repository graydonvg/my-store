import { Database } from '@/lib/database.types';
import { ResponseType } from '@/types';

type formDataType = Pick<Database['public']['Tables']['users']['Row'], 'first_name' | 'last_name'>;

export default async function updateUser(formData: formDataType) {
  try {
    const response = await fetch('/api/user/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data: ResponseType = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
