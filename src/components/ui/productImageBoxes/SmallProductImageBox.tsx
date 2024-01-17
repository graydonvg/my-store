'use client';

import useColorPalette from '@/hooks/useColorPalette';
import { Box, Grid } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { ImageUploadProgressType, InsertProductImageDataTypeStore } from '@/types';
import { borderRadius } from '@/constants/styles';

type ProductImageProps = {
  show: boolean;
  productName?: string;
  productImageData?: InsertProductImageDataTypeStore;
};

function ProductImage({ show, productName, productImageData }: ProductImageProps) {
  if (!show || !productImageData) return null;

  return (
    <>
      <Image
        style={{
          objectFit: 'cover',
          borderRadius: borderRadius,
          cursor: 'pointer',
        }}
        fill
        sizes="(min-width: 1280px) 91px, (min-width: 900px) calc(6.94vw + 4px), (min-width: 720px) 93px, (min-width: 600px) calc(7vw + 44px), calc(20vw - 10px)"
        src={productImageData.imageUrl}
        alt={`Image for ${!!productName ? productName : productImageData.fileName}`}
        priority
      />
    </>
  );
}

type SmallProductImageBoxProps = {
  productName?: string;
  productImageData?: InsertProductImageDataTypeStore;
  uploadProgressData?: ImageUploadProgressType;
  selectImage?: () => void;
  imageIndex?: number;
  selectedImageIndex?: number;
};

export default function SmallProductImageBox({
  productName,
  productImageData,
  uploadProgressData,
  selectImage,
  imageIndex,
  selectedImageIndex,
}: SmallProductImageBoxProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const colorPalette = useColorPalette();
  let boxBorderColor;

  // Only show borders when in admin view and no image exists. Highlight boxes that contain a loading spinner.
  if (isAdminView) {
    if (!!uploadProgressData && !productImageData) {
      boxBorderColor = colorPalette.textField.focused;
    } else if (!productImageData) {
      boxBorderColor = colorPalette.textField.border;
    }
  } else {
    boxBorderColor = 'transparent';
  }

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
          borderRadius: borderRadius,
          opacity: productImageData && imageIndex !== selectedImageIndex ? '50%' : null,
        }}>
        <ProductImage
          show={!!productImageData}
          productName={productName}
          productImageData={productImageData}
        />
        {!!uploadProgressData && isAdminView ? <CircularProgressWithLabel value={uploadProgressData.progress} /> : null}
      </Box>
    </Grid>
  );
}
