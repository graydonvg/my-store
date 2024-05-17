import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../../ui/progress/CircularProgressWithLabel';
import { InsertProductImageDataDb, InsertProductImageDataStore } from '@/types';
import { BORDER_RADIUS } from '@/data';
import { useState } from 'react';

type Props = {
  selectedImageIndex: number;
  productImageData?: InsertProductImageDataDb | InsertProductImageDataStore;
  productName: string;
  boxBorderColor: string;
  maxImageCount?: number;
};

export default function LargeProductImageBox({
  selectedImageIndex,
  productImageData,
  productName,
  boxBorderColor,
  maxImageCount,
}: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { imageUploadProgress } = useAppSelector((state) => state.productImages);

  return (
    <Box
      sx={{
        aspectRatio: 3 / 4,
        border: `1px solid ${boxBorderColor}`,
        position: 'relative',
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}>
      {productImageData ? (
        <>
          <Image
            style={{ objectFit: 'cover', opacity: !isImageLoaded ? 0 : 100 }}
            fill
            sizes="(min-width: 1280px) 464px, (min-width: 900px) calc(34.72vw + 27px), (min-width: 760px) 497px, (min-width: 600px) calc(28.57vw + 286px), calc(100vw - 34px)"
            src={productImageData.imageUrl}
            alt={`${productName}`}
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
            {`(Max. ${maxImageCount} images)`}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
