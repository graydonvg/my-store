import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../../ui/progress/CircularProgressWithLabel';
import { ProductImageData } from '@/types';
import { CONSTANTS } from '@/constants';
import { useState } from 'react';

type Props = {
  selectedImageIndex: number;
  productImageData?: ProductImageData;
  productName: string;
  boxBorderColor: string;
};

export default function LargeProductImageBox({
  selectedImageIndex,
  productImageData,
  productName,
  boxBorderColor,
}: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { imageUploadProgress } = useAppSelector((state) => state.productImages);

  return (
    <Box
      sx={{
        aspectRatio: 3 / 4,
        border: `1px solid ${boxBorderColor}`,
        position: 'relative',
        borderRadius: CONSTANTS.BORDER_RADIUS,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}>
      {productImageData ? (
        <>
          <Image
            style={{ objectFit: 'cover', opacity: !isImageLoaded ? 0 : 100, transition: 'opacity 0.5s ease-in-out' }}
            fill
            sizes="(min-width: 1200px) 464px, (min-width: 900px) calc(34.72vw + 28px), (min-width: 660px) 497px, (min-width: 600px) calc(28.57vw + 286px), calc(100vw - 45px)"
            src={productImageData.imageUrl}
            alt={`Image for ${productName}`}
            priority
            onLoad={() => setIsImageLoaded(true)}
          />

          {!isImageLoaded ? (
            <Skeleton
              height="100%"
              width="100%"
              variant="rectangular"
            />
          ) : null}
        </>
      ) : null}

      {imageUploadProgress[selectedImageIndex] && !productImageData ? (
        <CircularProgressWithLabel value={imageUploadProgress[selectedImageIndex].progress} />
      ) : null}

      {!productImageData && !imageUploadProgress[selectedImageIndex] ? (
        <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ color: (theme) => theme.palette.custom.textField.label }}>Upload an image</Typography>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.custom.textField.label }}>
            {`(Max. ${CONSTANTS.MAXIMUM_PRODUCT_IMAGES} images)`}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
