'use client';

import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { BORDER_RADIUS } from '@/config';
import { usePathname } from 'next/navigation';

type Props = {
  productName: string;
  imageUrl: string;
  onClick: () => void;
};

export default function ImageSmallCartItem({ imageUrl, productName, onClick }: Props) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const pathname = usePathname();
  const isShippingView = pathname.includes('/checkout/shipping');

  return (
    <Box
      onClick={!isShippingView ? onClick : undefined}
      sx={{
        display: 'flex',
        position: 'relative',
        aspectRatio: 3 / 4,
        width: '60px',
        flexShrink: 0,
        cursor: !isShippingView ? 'pointer' : 'default',
      }}>
      <Image
        style={{ objectFit: 'cover', borderRadius: BORDER_RADIUS, opacity: isImageLoading ? 0 : 100 }}
        fill
        sizes="60px"
        src={imageUrl!}
        alt={`${productName}`}
        priority
        onLoad={() => setIsImageLoading(false)}
      />
      {isImageLoading ? (
        <Skeleton
          height="100%"
          width="100%"
          variant="rectangular"
        />
      ) : null}
    </Box>
  );
}
