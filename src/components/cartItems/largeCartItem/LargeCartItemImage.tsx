import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { constants } from '@/constants';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  productName: string;
  imageUrl: string;
  productHref: string;
};

export default function LargeCartItemImage({ imageUrl, productName, productHref }: Props) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Link href={productHref}>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          aspectRatio: 3 / 4,
          width: { xs: '60px', sm: '160px' },
          flexShrink: 0,
          borderRadius: constants.borderRadius,
          overflow: 'hidden',
        }}>
        <Image
          style={{ objectFit: 'cover', opacity: isImageLoading ? 0 : 100 }}
          fill
          sizes="(min-width: 600px) 160px, 60px"
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
    </Link>
  );
}
