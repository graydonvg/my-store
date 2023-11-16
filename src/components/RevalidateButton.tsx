'use client';

import CustomButton from '@/components/ui/buttons/CustomButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import revalidate from '@/services/revalidate';
import { PulseLoader } from 'react-spinners';

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
      disabled={isLoading}
      onClick={handleRevalidate}
      fullWidth
      label={isLoading ? '' : 'revalidate'}
      startIcon={
        isLoading ? (
          <PulseLoader
            color="white"
            loading={isLoading}
            size={10}
          />
        ) : null
      }
      backgroundColor="blue"
    />
  );
}
