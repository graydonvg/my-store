import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';
import SmallBoxWithUploadProgress from './SmallBoxWithUploadProgress';
import EmptySmallBoxWithBorder from './EmptySmallBoxWithBorder';

type Props = {
  maxImageCount: number;
  selectImage: (index: number) => void;
  selectedImageIndex: number;
  getBoxBorderColor: ({
    defaultBorderColor,
    focusedBorderColor,
  }: {
    defaultBorderColor?: boolean | undefined;
    focusedBorderColor?: boolean | undefined;
  }) => string;
};

export default function AdminViewSmallProductImageBoxes({
  maxImageCount,
  selectImage,
  selectedImageIndex,
  getBoxBorderColor,
}: Props) {
  const { imageData, productFormData, imageUploadProgress } = useAppSelector((state) => state.productForm);

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
          boxBorderColor="transparent"
        />
      ))}

      {imageUploadProgress.length > 0 ? (
        <SmallBoxWithUploadProgress boxBorderColor={getBoxBorderColor({ focusedBorderColor: true })} />
      ) : null}

      <EmptySmallBoxWithBorder
        maxImageCount={maxImageCount}
        boxBorderColor={getBoxBorderColor({ defaultBorderColor: true })}
      />
    </>
  );
}
