import { BORDER_RADIUS } from '@/config';
import { OrderItemType } from '@/types';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  imageUrl: string;
  orderItem: OrderItemType;
};

export default function OrderItemImage({ imageUrl, orderItem }: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Link href={`/products/${orderItem.product?.category.toLowerCase()}/${orderItem.product?.productId}`}>
      <Box sx={{ position: 'relative', aspectRatio: 25 / 36 }}>
        <Image
          priority
          style={{
            objectFit: 'cover',
            borderRadius: BORDER_RADIUS,
            cursor: 'pointer',
            opacity: !isImageLoaded ? 0 : 100,
          }}
          fill
          src={imageUrl}
          alt={`Image of ${orderItem.product?.name}`}
          sizes="(min-width: 1260px) 124px, (min-width: 900px) calc(10.88vw - 11px), calc(32.41vw - 30px)"
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded ? (
          <Skeleton
            height="100%"
            width="100%"
            variant="rectangular"
          />
        ) : null}
      </Box>
    </Link>
  );
}
