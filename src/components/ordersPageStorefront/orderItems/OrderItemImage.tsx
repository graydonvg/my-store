import { CONSTANTS } from '@/constants';
import { OrderItem } from '@/types';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  imageUrl: string;
  orderItem: OrderItem;
};

export default function OrderItemImage({ imageUrl, orderItem }: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Link
      href={`/products/${orderItem.product?.category.toLowerCase()}/${orderItem.product?.name
        .toLowerCase()
        .split(' ')
        .join('-')}/${orderItem.product?.productId}`}>
      <Box
        sx={{ position: 'relative', aspectRatio: 25 / 36, borderRadius: CONSTANTS.BORDER_RADIUS, overflow: 'hidden' }}>
        <Image
          priority
          style={{
            objectFit: 'cover',
            cursor: 'pointer',
            opacity: !isImageLoaded ? 0 : 100,
          }}
          fill
          src={imageUrl}
          alt={`Image for ${orderItem.product?.name}`}
          sizes="(min-width: 1210px) 125px, (min-width: 900px) calc(10.88vw - 11px), calc(32.41vw - 30px)"
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
