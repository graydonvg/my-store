'use client';

import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import revalidate from '@/services/revalidate';
import { Refresh } from '@mui/icons-material';
import OutlinedButton from './OutlinedButton';

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function revalidateAndRefresh() {
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
    <OutlinedButton
      disabled={isLoading}
      onClick={revalidateAndRefresh}
      fullWidth
      label={!isLoading ? 'revalidate' : ''}
      isLoading={isLoading}
      startIcon={<Refresh />}
    />
  );
}
