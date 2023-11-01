'use client';

import CustomButton from '@/components/ui/buttons/CustomButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRevalidate() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${location.origin}/api/revalidate?path=/&secret=${process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN}`
      );

      const data = await response.json();

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
      label="revalidate"
      styles={{
        backgroundColor: 'custom.blue.dark',
        '&:hover': {
          backgroundColor: 'custom.blue.light',
        },
      }}
    />
  );
}
