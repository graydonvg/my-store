import { ProductImageData } from '@/types';
import SmallProductImage from './SmallProductImage';

type Props = {
  productName: string;
  productImageData: ProductImageData[];
  selectImage: (index: number) => void;
  selectedImageIndex: number;
};

export default function SmallProductImagesStorefront({
  productName,
  productImageData,
  selectImage,
  selectedImageIndex,
}: Props) {
  return (
    <>
      {productImageData
        .sort((a, b) => a.imageIndex - b.imageIndex)
        .map((data) => (
          <SmallProductImage
            key={data.fileName}
            productName={productName}
            productImageData={data}
            onClick={() => selectImage(data.imageIndex)}
            imageIndex={data.imageIndex}
            selectedImageIndex={selectedImageIndex}
          />
        ))}
    </>
  );
}
