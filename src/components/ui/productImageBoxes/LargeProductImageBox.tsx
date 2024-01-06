'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { InsertProductImageDataTypeDb, InsertProductImageDataTypeStore } from '@/types';
import { usePathname } from 'next/navigation';
import { borderRadius } from '@/constants/styles';

type NoFileChosenMessageProps = {
  show: boolean;
};

function NoFileChosenMessage({ show }: NoFileChosenMessageProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? customColorPalette.white.opacity.strong : customColorPalette.black.opacity.strong;

  if (!show) return null;

  return (
    <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ color: textColor }}>No file chosen</Typography>
      <Typography
        variant="body2"
        sx={{ color: textColor }}>
        {'(Max. 5 images)'}
      </Typography>
    </Box>
  );
}

type ProductImageProps = {
  show: boolean;
  productImageData?: InsertProductImageDataTypeDb | InsertProductImageDataTypeStore;
  productName: string;
};

function ProductImage({ show, productImageData, productName }: ProductImageProps) {
  if (!show || !productImageData) return null;

  return (
    <Image
      style={{ objectFit: 'cover', borderRadius: borderRadius }}
      fill
      sizes="(min-width: 1280px) 484px, (min-width: 900px) calc(34.72vw + 47px), (min-width: 760px) 497px, (min-width: 600px) calc(25.71vw + 307px), calc(100vw - 17px)"
      src={productImageData.imageUrl}
      alt={`${productName}`}
      priority
    />
  );
}

type UploadProgressProps = {
  show: boolean;
  selectedImageIndex: number;
};

function UploadProgress({ show, selectedImageIndex }: UploadProgressProps) {
  const { imageUploadProgress } = useAppSelector((state) => state.productForm);

  if (!show) return null;

  return <CircularProgressWithLabel value={imageUploadProgress[selectedImageIndex].progress} />;
}

type LargeProductImageBoxProps = {
  selectedImageIndex: number;
  borderColor: string;
  productImageData?: InsertProductImageDataTypeDb | InsertProductImageDataTypeStore;
  productName: string;
};

export default function LargeProductImageBox({
  selectedImageIndex,
  borderColor,
  productImageData,
  productName,
}: LargeProductImageBoxProps) {
  const { imageUploadProgress } = useAppSelector((state) => state.productForm);
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const boxBorderColor = isAdminView && !productImageData ? borderColor : 'transparent';

  return (
    <Box
      sx={{
        aspectRatio: 3 / 4,
        border: `1px solid ${boxBorderColor}`,
        position: 'relative',
        borderRadius: borderRadius,
        display: 'grid',
        placeItems: 'center',
      }}>
      <ProductImage
        show={!!productImageData}
        productImageData={productImageData}
        productName={productName}
      />
      <UploadProgress
        show={!!imageUploadProgress[selectedImageIndex] && !productImageData}
        selectedImageIndex={selectedImageIndex}
      />
      <NoFileChosenMessage show={!productImageData && !imageUploadProgress[selectedImageIndex]} />
    </Box>
  );
}
