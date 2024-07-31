'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Autorenew } from '@mui/icons-material';
import revalidateAllData from '@/services/admin/revalidate-all-data';
import { Button } from '@mui/material';

type Props = {
  commonStyle: {
    height: string;
    color: string;
  };
};

export default function RevalidateButton({ commonStyle }: Props) {
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
    <Button
      variant="text"
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
