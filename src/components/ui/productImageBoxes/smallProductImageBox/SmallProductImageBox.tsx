import { Box, Grid, Skeleton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CircularProgressWithLabel } from '../../progress/CircularProgressWithLabel';
import { ProductImageUploadProgress, InsertProductImageDataStore } from '@/types';
import { BORDER_RADIUS } from '@/data';
import { useState } from 'react';

type SmallProductImageBoxProps = {
  productName?: string;
  productImageData?: InsertProductImageDataStore;
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
  const isAdminPath = pathname.includes('/admin');

  return (
    <Grid
      item
      xs={2.4}
      sm={12}>
      <Box
        onClick={selectImage}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: 3 / 4,
          outline: `1px solid ${boxBorderColor}`,
          borderRadius: BORDER_RADIUS,
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
              priority
              sizes="(min-width: 1280px) 87px, (min-width: 900px) 6.94vw, (min-width: 740px) 93px, (min-width: 600px) calc(6.67vw + 45px), calc(20vw - 13px)"
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
    </Grid>
  );
}
