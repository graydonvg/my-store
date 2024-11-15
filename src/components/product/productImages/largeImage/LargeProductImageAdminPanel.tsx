import { ProductImageData } from '@/types';
import LargeProductImage from './LargeProductImage';
import LargeBoxWithUploadProgress from './LargeBoxWithUploadProgress';
import EmptyLargeBoxWithBorder from './EmptyLargeBoxWithBorder';
import { useAppSelector } from '@/lib/redux/hooks';

type Props = {
  productName: string;
  productImageData: ProductImageData;
  selectedImageIndex: number;
  getBoxBorderColor: ({
    defaultBorderColor,
    focusedBorderColor,
  }: {
    defaultBorderColor?: boolean | undefined;
    focusedBorderColor?: boolean | undefined;
  }) => string;
};

export default function LargeProductImageAdminPanel({
  productName,
  productImageData,
  selectedImageIndex,
  getBoxBorderColor,
}: Props) {
  const { imageUploadProgress } = useAppSelector((state) => state.productImages);

  return (
    <>
      {productImageData ? (
        <LargeProductImage
          productName={productName}
          productImageData={productImageData}
        />
      ) : null}

      {!productImageData && imageUploadProgress[selectedImageIndex] ? (
        <LargeBoxWithUploadProgress
          selectedImageIndex={selectedImageIndex}
          boxBorderColor={getBoxBorderColor({ focusedBorderColor: true })}
        />
      ) : null}

      {!productImageData && !imageUploadProgress[selectedImageIndex] ? (
        <EmptyLargeBoxWithBorder boxBorderColor={getBoxBorderColor({ defaultBorderColor: true })} />
      ) : null}
    </>
  );
}
