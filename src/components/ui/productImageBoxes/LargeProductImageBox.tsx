'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { ProductImageDataDbType, ProductImageDataStoreType } from '@/types';
import { usePathname } from 'next/navigation';

type Props = {
  selectedImageIndex: number;
  borderColor: string;
  productImageData?: ProductImageDataDbType | ProductImageDataStoreType;
  productName: string;
};

export default function LargeProductImageBox({
  selectedImageIndex,
  borderColor,
  productImageData,
  productName,
}: Props) {
  const { imageUploadProgress } = useAppSelector((state) => state.addProduct);
  const color = useCustomColorPalette();
  const theme = useTheme();
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.white.opacity.strong : color.black.opacity.strong;
  const boxBorderColor = isAdminView && !productImageData ? borderColor : 'transparent';

  return (
    <Box
      sx={{
        aspectRatio: { xs: 11 / 12, sm: 3 / 4 },
        border: `1px solid ${boxBorderColor}`,
        position: 'relative',
        borderRadius: 1,
        display: 'grid',
        placeItems: 'center',
      }}>
      {imageUploadProgress[selectedImageIndex] || productImageData ? (
        productImageData ? (
          <Image
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            fill
            sizes="(min-width: 1280px) 470px, (min-width: 600px) 37.88vw, 100vw"
            src={productImageData.image_url}
            alt={`Image of ${productName}`}
            priority
          />
        ) : (
          <CircularProgressWithLabel value={imageUploadProgress[selectedImageIndex].progress} />
        )
      ) : (
        <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ color: textColor }}>No file chosen</Typography>
          <Typography
            variant="body2"
            sx={{ color: textColor }}>
            {'(Max. 5 images)'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
