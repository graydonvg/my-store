'use client';

import CustomButton from '@/components/ui/buttons/ContainedButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import revalidate from '@/services/revalidate';

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRevalidate() {
    setIsLoading(true);
    try {
      const data = await revalidate('/api/revalidate');

      if (data.success === true) {
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Revalidation failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CustomButton
      isDisabled={isLoading}
      onClick={handleRevalidate}
      fullWidth
      label={isLoading ? '' : 'revalidate'}
      isLoading={isLoading}
      backgroundColor="blue"
    />
  );
}
