'use client';

import ProductImagesContainer from './ProductImagesContainer';
import SmallProductImagesStorefront from './smallImages/SmallProductImagesStorefront';
import { useState } from 'react';
import { ProductImageData } from '@/types';
import LargeProductImage from './largeImage/LargeProductImage';

type Props = {
  productName: string;
  productImageData: ProductImageData[];
};

export default function ProductImagesStorefront({ productName, productImageData }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  function selectImage(index: number) {
    setSelectedImageIndex(index);
  }

  return (
    <ProductImagesContainer
      smallImages={
        <SmallProductImagesStorefront
          productName={productName}
          productImageData={productImageData}
          selectImage={selectImage}
          selectedImageIndex={selectedImageIndex}
        />
      }
      largeImage={<LargeProductImage productImageData={productImageData[selectedImageIndex]} />}
    />
  );
}
