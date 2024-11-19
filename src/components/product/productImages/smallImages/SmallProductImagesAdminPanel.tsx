import { useAppSelector } from '@/lib/redux/hooks';
import SmallBoxWithUploadProgress from './SmallBoxWithUploadProgress';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import SmallProductImage from './SmallProductImage';
import SmallProductImageContainer from './SmallProductImageContainer';
import { MAXIMUM_PRODUCT_IMAGES } from '@/constants';

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

export default function SmallProductImagesAdminPanel({ selectImage, selectedImageIndex, getBoxBorderColor }: Props) {
  const imageData = useAppSelector(selectImageData);
  const { imageUploadProgress } = useAppSelector((state) => state.productImages);
  const numberOfEmptyBoxes = MAXIMUM_PRODUCT_IMAGES - imageData.length - imageUploadProgress.length;

  return (
    <>
      {imageData.length > 0
        ? imageData.map((data) => (
            <SmallProductImage
              key={data.fileName}
              productImageData={data}
              onClick={() => selectImage(data.imageIndex)}
              imageIndex={data.imageIndex}
              selectedImageIndex={selectedImageIndex}
            />
          ))
        : null}

      {imageUploadProgress.length > 0
        ? imageUploadProgress.map((data, index) => (
            <SmallBoxWithUploadProgress
              key={index}
              progress={data.progress}
              boxBorderColor={getBoxBorderColor({ focusedBorderColor: true })}
            />
          ))
        : null}

      {Array.from(Array(numberOfEmptyBoxes)).map((_, index) => (
        <SmallProductImageContainer
          key={`empty-small-box-${index}`}
          boxBorderColor={getBoxBorderColor({ defaultBorderColor: true })}
        />
      ))}
    </>
  );
}
