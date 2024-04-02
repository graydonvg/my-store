import { Box, Grid, Skeleton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CircularProgressWithLabel } from '../../progress/CircularProgressWithLabel';
import { ImageUploadProgressType, InsertProductImageDataTypeStore } from '@/types';
import { BORDER_RADIUS } from '@/config';
import { useState } from 'react';

type SmallProductImageBoxProps = {
  productName?: string;
  productImageData?: InsertProductImageDataTypeStore;
  uploadProgressData?: ImageUploadProgressType;
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
  const isAdminView = pathname.includes('/admin');

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
          opacity: productImageData && imageIndex !== selectedImageIndex ? '50%' : null,
        }}>
        {productImageData ? (
          <>
            <Image
              style={{
                objectFit: 'cover',
                borderRadius: BORDER_RADIUS,
                cursor: 'pointer',
                opacity: !isImageLoaded ? 0 : 100,
              }}
              fill
              sizes="(min-width: 1280px) 91px, (min-width: 900px) calc(6.94vw + 4px), (min-width: 720px) 93px, (min-width: 600px) calc(7vw + 44px), calc(20vw - 10px)"
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

        {uploadProgressData && isAdminView ? <CircularProgressWithLabel value={uploadProgressData.progress} /> : null}
      </Box>
    </Grid>
  );
}
