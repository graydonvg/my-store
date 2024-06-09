'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Refresh } from '@mui/icons-material';
import OutlinedButton from '../../ui/buttons/simple/OutlinedButton';
import revalidateAllData from '@/services/admin/revalidate-all-data';

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function revalidateAndRefresh() {
    setIsLoading(true);

    const data = await revalidateAllData();

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
      onClick={revalidateAndRefresh}
      fullWidth
      label={!isLoading ? 'revalidate' : ''}
      isLoading={isLoading}
      startIcon={<Refresh />}
    />
  );
}
