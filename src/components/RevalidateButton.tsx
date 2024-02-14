'use client';

import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import revalidate from '@/services/revalidate';

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRevalidate() {
    setIsLoading(true);

    const data = await revalidate('/');

    if (data.success === true) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }

    setIsLoading(false);
  }

  return (
    <ContainedButton
      disabled={isLoading}
      onClick={handleRevalidate}
      fullWidth
      label={isLoading ? '' : 'revalidate'}
      isLoading={isLoading}
      backgroundColor="primary"
    />
  );
}
