import { CONSTANTS } from '@/constants';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  imageUrl: string;
  imageSizes: string;
  productName: string;
};

export default function ProductCardImage({ imageUrl, imageSizes, productName }: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 25 / 36,
        borderTopLeftRadius: CONSTANTS.BORDER_RADIUS,
        borderTopRightRadius: CONSTANTS.BORDER_RADIUS,
        overflow: 'hidden',
      }}>
      <Image
        style={{
          objectFit: 'cover',
          opacity: !isImageLoaded ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out',
        }}
        fill
        sizes={imageSizes}
        src={imageUrl}
        alt={`Image for ${productName}`}
        onLoad={() => setIsImageLoaded(true)}
      />

      {!isImageLoaded && (
        <Skeleton
          height="100%"
          width="100%"
          variant="rectangular"
        />
      )}
    </Box>
  );
}
