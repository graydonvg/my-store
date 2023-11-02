'use client';

import CustomButton from '@/components/ui/buttons/CustomButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import getURL from '@/lib/utils';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { Spinner } from './ui/progress/Spinner';

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const color = useCustomColorPalette();
  const router = useRouter();

  async function handleRevalidate() {
    setIsLoading(true);
    try {
      const url = getURL('/api/revalidate');
      const response = await fetch(
        `${url}?path=/&secret=${process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN}`
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
      label={isLoading ? 'revalidating...' : 'revalidate'}
      startIcon={isLoading ? <Spinner size={20} /> : null}
      backgroundColor="blue"
    />
  );
}
