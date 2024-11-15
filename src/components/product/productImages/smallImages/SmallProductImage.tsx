import { Skeleton } from '@mui/material';
import Image from 'next/image';
import { ProductImageData } from '@/types';
import { useState } from 'react';
import SmallProductImageContainer from './SmallProductImageContainer';

type Props = {
  productName?: string;
  productImageData: ProductImageData;
  onClick?: () => void;
  imageIndex?: number;
  selectedImageIndex?: number;
};

export default function SmallProductImage({
  productName,
  productImageData,
  onClick,
  imageIndex,
  selectedImageIndex,
}: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <SmallProductImageContainer
      productImageData={productImageData}
      onClick={onClick}
      selectedImageIndex={selectedImageIndex}
      imageIndex={imageIndex}>
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
    </SmallProductImageContainer>
  );
}
