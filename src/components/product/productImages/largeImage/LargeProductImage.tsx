import { Skeleton } from '@mui/material';
import Image from 'next/image';
import { ProductImageData } from '@/types';
import { useState } from 'react';
import LargeProductImageContainer from './LargeProductImageContainer';

type Props = {
  productName?: string;
  productImageData: ProductImageData;
};

export default function LargeProductImage({ productName, productImageData }: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <LargeProductImageContainer>
      <Image
        style={{ objectFit: 'cover', opacity: !isImageLoaded ? 0 : 100 }}
        fill
        sizes="(min-width: 1200px) 464px, (min-width: 900px) calc(34.72vw + 28px), (min-width: 660px) 497px, (min-width: 600px) calc(28.57vw + 286px), calc(100vw - 45px)"
        src={productImageData.imageUrl}
        alt={`Image for ${productName || 'product'}`}
        priority
        onLoad={() => setIsImageLoaded(true)}
      />

      {!isImageLoaded ? (
        <Skeleton
          height="100%"
          width="100%"
          variant="rectangular"
        />
      ) : null}
    </LargeProductImageContainer>
  );
}
