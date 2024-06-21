import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';
import SmallBoxWithUploadProgress from './SmallBoxWithUploadProgress';
import EmptySmallBoxWithBorder from './EmptySmallBoxWithBorder';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';

type Props = {
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

export default function SmallProductImageBoxesAdminPanel({
  selectImage,
  selectedImageIndex,
  getBoxBorderColor,
}: Props) {
  const productFormData = useAppSelector(selectProductFormData);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);

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

      <EmptySmallBoxWithBorder boxBorderColor={getBoxBorderColor({ defaultBorderColor: true })} />
    </>
  );
}
