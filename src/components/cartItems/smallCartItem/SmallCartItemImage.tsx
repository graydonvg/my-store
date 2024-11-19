import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

import { usePathname } from 'next/navigation';
import { BORDER_RADIUS } from '@/constants';

type Props = {
  productName: string;
  imageUrl: string;
  onClick: () => void;
};

export default function SmallCartItemImage({ imageUrl, productName, onClick }: Props) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const pathname = usePathname();
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  return (
    <Box
      onClick={onClick}
      sx={{
        pointerEvents: !isShippingPath ? 'auto' : 'none',
        display: 'flex',
        position: 'relative',
        aspectRatio: 3 / 4,
        width: '60px',
        flexShrink: 0,
        cursor: !isShippingPath ? 'pointer' : 'default',
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden',
      }}>
      <Image
        style={{ objectFit: 'cover', opacity: isImageLoading ? 0 : 100 }}
        fill
        sizes="60px"
        src={imageUrl!}
        alt={`Image for ${productName}`}
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
