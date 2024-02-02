'use client';

import useColorPalette from '@/hooks/useColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { InsertProductImageDataTypeDb, InsertProductImageDataTypeStore } from '@/types';
import { usePathname } from 'next/navigation';
import { borderRadius } from '@/constants/styles';

type NoFileChosenMessageProps = {
  show: boolean;
};

function NoFileChosenMessage({ show }: NoFileChosenMessageProps) {
  const colorPalette = useColorPalette();

  if (!show) return null;

  return (
    <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography color={colorPalette.textField.label}>No file chosen</Typography>
      <Typography
        variant="body2"
        color={colorPalette.textField.label}>
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
  productImageData?: InsertProductImageDataTypeDb | InsertProductImageDataTypeStore;
  productName: string;
};

export default function LargeProductImageBox({
  selectedImageIndex,
  productImageData,
  productName,
}: LargeProductImageBoxProps) {
  const { imageUploadProgress } = useAppSelector((state) => state.productForm);
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const colorPalette = useColorPalette();
  let boxBorderColor;

  // Only show borders when in admin view and no image exists. Highlight the box if it contains a loading spinner.
  if (isAdminView) {
    if (imageUploadProgress[selectedImageIndex] && !productImageData) {
      boxBorderColor = colorPalette.textField.focused;
    } else if (!productImageData) {
      boxBorderColor = colorPalette.textField.border;
    }
  } else {
    boxBorderColor = 'transparent';
  }

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
