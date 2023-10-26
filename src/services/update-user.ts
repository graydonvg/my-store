import { ResponseType } from '@/types';

export default async function updateUser(formData: {
  id: string;
  user_name: string;
  first_name: string;
  last_name: string;
}) {
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
