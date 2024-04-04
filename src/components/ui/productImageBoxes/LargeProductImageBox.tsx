import useColorPalette from '@/hooks/useColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { InsertProductImageDataTypeDb, InsertProductImageDataTypeStore } from '@/types';
import { BORDER_RADIUS } from '@/config';
import { useState } from 'react';

type Props = {
  selectedImageIndex: number;
  productImageData?: InsertProductImageDataTypeDb | InsertProductImageDataTypeStore;
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
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        aspectRatio: 3 / 4,
        border: `1px solid ${boxBorderColor}`,
        position: 'relative',
        borderRadius: BORDER_RADIUS,
        display: 'grid',
        placeItems: 'center',
      }}>
      {productImageData ? (
        <>
          <Image
            style={{ objectFit: 'cover', borderRadius: BORDER_RADIUS, opacity: !isImageLoaded ? 0 : 100 }}
            fill
            sizes="(min-width: 1280px) 484px, (min-width: 900px) calc(34.72vw + 47px), (min-width: 760px) 497px, (min-width: 600px) calc(25.71vw + 307px), calc(100vw - 17px)"
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
              style={{ borderRadius: BORDER_RADIUS }}
            />
          ) : null}
        </>
      ) : null}

      {imageUploadProgress[selectedImageIndex] && !productImageData ? (
        <CircularProgressWithLabel value={imageUploadProgress[selectedImageIndex].progress} />
      ) : null}

      {!productImageData && !imageUploadProgress[selectedImageIndex] ? (
        <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography color={colorPalette.textField.label}>Upload an image</Typography>
          <Typography
            variant="body2"
            color={colorPalette.textField.label}>
            {`(Max. ${maxImageCount} images)`}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
