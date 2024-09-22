import { CONSTANTS } from '@/constants';
import useInView from '@/hooks/UseInView';
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
  const [isInView, setElement] = useInView({
    threshold: 0, // Load when any part of the image is in view
  });

  return (
    <Link
      href={`/products/${orderItem.product?.category.toLowerCase()}/${orderItem.product?.name
        .toLowerCase()
        .split(' ')
        .join('-')}/${orderItem.product?.productId}`}>
      <Box
        // Attach the ref to track when this Box enters the viewport
        ref={setElement}
        sx={{
          position: 'relative',
          aspectRatio: 25 / 36,
          borderRadius: CONSTANTS.BORDER_RADIUS,
          overflow: 'hidden',
        }}>
        {isInView && (
          <Image
            priority
            style={{
              objectFit: 'cover',
              cursor: 'pointer',
              opacity: !isImageLoaded ? 0 : 100,
              transition: 'opacity 0.4s ease-in-out',
            }}
            fill
            src={imageUrl}
            alt={`Image for ${orderItem.product?.name}`}
            sizes="(min-width: 1210px) 125px, (min-width: 900px) calc(10.88vw - 11px), calc(32.41vw - 30px)"
            onLoad={() => setIsImageLoaded(true)}
          />
        )}

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
