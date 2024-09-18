import { Box, Grid2, Skeleton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CircularProgressWithLabel } from '../../../ui/progress/CircularProgressWithLabel';
import { ProductImageUploadProgress, ProductImageData } from '@/types';
import { CONSTANTS } from '@/constants';
import { useState } from 'react';

type SmallProductImageBoxProps = {
  productName?: string;
  productImageData?: ProductImageData;
  uploadProgressData?: ProductImageUploadProgress;
  selectImage?: () => void;
  imageIndex?: number;
  selectedImageIndex?: number;
  boxBorderColor: string;
};

export default function SmallProductImageBox({
  productName,
  productImageData,
  uploadProgressData,
  selectImage,
  imageIndex,
  selectedImageIndex,
  boxBorderColor,
}: SmallProductImageBoxProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <Grid2 size={{ xs: 2.4, sm: 12 }}>
      <Box
        onClick={selectImage}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: 3 / 4,
          outline: `1px solid ${boxBorderColor}`,
          borderRadius: CONSTANTS.BORDER_RADIUS,
          overflow: 'hidden',
          opacity: productImageData && imageIndex !== selectedImageIndex ? '50%' : null,
        }}>
        {productImageData ? (
          <>
            <Image
              style={{
                objectFit: 'cover',
                cursor: 'pointer',
                opacity: !isImageLoaded ? 0 : 100,
              }}
              fill
              sizes="(min-width: 1200px) 87px, (min-width: 900px) 6.94vw, (min-width: 660px) 94px, (min-width: 600px) calc(7.5vw + 45px), calc(20vw - 13px)"
              src={productImageData.imageUrl}
              alt={`Image for ${productName ? productName : productImageData.fileName}`}
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

        {uploadProgressData && isAdminPath ? <CircularProgressWithLabel value={uploadProgressData.progress} /> : null}
      </Box>
    </Grid2>
  );
}
