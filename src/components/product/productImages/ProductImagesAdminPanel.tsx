'use client';

import ProductImagesContainer from './ProductImagesContainer';
import { useEffect, useState } from 'react';
import SmallProductImagesAdminPanel from './smallImages/SmallProductImagesAdminPanel';
import { useTheme } from '@mui/material';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import LargeProductImageAdminPanel from './largeImage/LargeProductImageAdminPanel';

export default function ProductImagesAdminPanel() {
  const theme = useTheme();
  const imageData = useAppSelector(selectImageData);
  const productFormData = useAppSelector(selectProductFormData);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (imageData.length === 0) {
      setSelectedImageIndex(0);
    }
  }, [imageData]);

  useEffect(() => {
    if (!imageData[selectedImageIndex]) {
      setSelectedImageIndex(0);
    }
  }, [imageData, selectedImageIndex]);

  function selectImage(index: number) {
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
    <ProductImagesContainer
      smallImages={
        <SmallProductImagesAdminPanel
          selectImage={selectImage}
          selectedImageIndex={selectedImageIndex}
          getBoxBorderColor={getBoxBorderColor}
        />
      }
      largeImage={
        <LargeProductImageAdminPanel
          productName={productFormData.name}
          productImageData={imageData[selectedImageIndex]}
          selectedImageIndex={selectedImageIndex}
          getBoxBorderColor={getBoxBorderColor}
        />
      }
    />
  );
}
