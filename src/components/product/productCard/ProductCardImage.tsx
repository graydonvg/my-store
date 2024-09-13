import { CONSTANTS } from '@/constants';
import useInView from '@/hooks/UseInView';
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

  const [isInView, setElement] = useInView({
    threshold: 0, // Load when any part of the image is in view
  });

  return (
    <Box
      ref={setElement} // Attach the ref to track when this Box enters the viewport
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
      {/* Only render the image when it's in the viewport */}
      {isInView && (
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
      )}

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
