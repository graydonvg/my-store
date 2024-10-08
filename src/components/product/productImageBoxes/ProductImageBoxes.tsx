'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Container, Grid2, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';
import { Product } from '@/types';
import SmallProductImageBoxStorefront from './smallProductImageBox/SmallProductImageBoxStorefront';
import SmallProductImageBoxesAdminPanel from './smallProductImageBox/SmallProductImageBoxesAdminPanel';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';

type Props = {
  product?: Product;
};

export default function ProductImageBoxes({ product }: Props) {
  const theme = useTheme();
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const productFormData = useAppSelector(selectProductFormData);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);

  useEffect(() => {
    if ((isAdminPath && imageData.length === 0) || product?.productImageData.length === 0) {
      setSelectedImageIndex(0);
    }
  }, [isAdminPath, imageData, product]);

  useEffect(() => {
    if (isAdminPath && !imageData[selectedImageIndex]) {
      setSelectedImageIndex(0);
    }
  }, [imageData, selectedImageIndex, isAdminPath]);

  function selectedImage(index: number) {
    setSelectedImageIndex(index);
  }

  function getBoxBorderColor({ defaultBorderColor = false, focusedBorderColor = false }) {
    if (focusedBorderColor) {
      return theme.palette.custom.textField.focused;
    } else if (defaultBorderColor) {
      return theme.palette.custom.textField.border;
    } else {
      return 'transparent';
    }
  }

  return (
    <Container
      maxWidth={isAdminPath ? 'xs' : 'sm'}
      disableGutters>
      <Grid2
        container
        spacing={1}>
        <Grid2
          size={{ xs: 12, sm: 2 }}
          sx={{ order: { xs: 2, sm: 1 } }}>
          <Grid2
            container
            spacing={{ xs: 1, sm: 1.32 }}>
            {!isAdminPath && product ? (
              <SmallProductImageBoxStorefront
                product={product}
                selectImage={selectedImage}
                selectedImageIndex={selectedImageIndex}
                boxBorderColor="transparent"
              />
            ) : null}

            {isAdminPath ? (
              <SmallProductImageBoxesAdminPanel
                selectImage={selectedImage}
                selectedImageIndex={selectedImageIndex}
                getBoxBorderColor={getBoxBorderColor}
              />
            ) : null}
          </Grid2>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 10 }}
          sx={{ order: { xs: 1, sm: 2 } }}>
          {!isAdminPath && product ? (
            <LargeProductImageBox
              productName={product?.name ?? ''}
              productImageData={product?.productImageData[selectedImageIndex]}
              selectedImageIndex={selectedImageIndex}
              boxBorderColor="transparent"
            />
          ) : null}

          {isAdminPath ? (
            <LargeProductImageBox
              productName={productFormData.name}
              productImageData={imageData[selectedImageIndex]}
              selectedImageIndex={selectedImageIndex}
              boxBorderColor={getBoxBorderColor({
                defaultBorderColor: !imageData[selectedImageIndex],
                focusedBorderColor: imageUploadProgress[selectedImageIndex] && !imageData[selectedImageIndex],
              })}
            />
          ) : null}
        </Grid2>
      </Grid2>
    </Container>
  );
}
