import { Product } from '@/types';
import SmallProductImageBox from './SmallProductImageBox';

type Props = {
  product: Product;
  selectImage: (index: number) => void;
  selectedImageIndex: number;
  boxBorderColor: string;
};

export default function SmallProductImageBoxStorefront({
  product,
  selectImage,
  selectedImageIndex,
  boxBorderColor,
}: Props) {
  return (
    <>
      {product.productImageData
        .sort((a, b) => a.imageIndex - b.imageIndex)
        .map((data) => (
          <SmallProductImageBox
            key={data.fileName}
            productName={product?.name}
            productImageData={data}
            selectImage={() => selectImage(data.imageIndex)}
            imageIndex={data.imageIndex}
            selectedImageIndex={selectedImageIndex}
            boxBorderColor={boxBorderColor}
          />
        ))}
    </>
  );
}
