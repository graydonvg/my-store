'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Autorenew } from '@mui/icons-material';
import revalidateAllData from '@/services/admin/revalidate-all-data';
import { Button } from '@mui/material';

type Props = {
  isDeleting: boolean;
  commonStyle: {
    height: string;
    color: string;
  };
};

export default function RevalidateButton({ isDeleting, commonStyle }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function revalidateAndRefresh() {
    setIsLoading(true);

    const { success, message } = await revalidateAllData();

    if (success) {
      toast.success(message);
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsLoading(false);
  }

  return (
    <Button
      variant="text"
      disabled={isDeleting}
      onClick={revalidateAndRefresh}
      startIcon={
        isLoading ? (
          <Autorenew
            sx={{
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
        ) : (
          <Autorenew />
        )
      }
      sx={{
        paddingX: '5px',
        paddingY: '4px',
        pointerEvents: !isLoading ? 'auto' : 'none',
        whiteSpace: 'nowrap',
        ...commonStyle,
      }}>
      Revalidate
    </Button>
  );
}
