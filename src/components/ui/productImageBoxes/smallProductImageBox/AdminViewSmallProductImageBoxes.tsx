'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';

type Props = {
  selectImage: (index: number) => void;
  selectedImageIndex: number;
  boxBorderColor: string;
};

export default function AdminViewSmallProductImageBoxes({ selectImage, selectedImageIndex, boxBorderColor }: Props) {
  const { imageData, productFormData } = useAppSelector((state) => state.productForm);

  return (
    <>
      {imageData.map((data) => (
        <SmallProductImageBox
          key={data.fileName}
          productName={productFormData.name}
          productImageData={data}
          selectImage={() => selectImage(data.index)}
          imageIndex={data.index}
          selectedImageIndex={selectedImageIndex}
          boxBorderColor={boxBorderColor}
        />
      ))}
    </>
  );
}
