import { useAppSelector } from '@/lib/redux/hooks';
import SmallBoxWithUploadProgress from './SmallBoxWithUploadProgress';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import SmallProductImage from './SmallProductImage';
import { CONSTANTS } from '@/constants';
import SmallProductImageContainer from './SmallProductImageContainer';

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
  const numberOfEmptyBoxes = CONSTANTS.MAXIMUM_PRODUCT_IMAGES - imageData.length - imageUploadProgress.length;

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

      {imageData.length === 0 && imageUploadProgress.length > 0
        ? imageUploadProgress.map((data) => (
            <SmallBoxWithUploadProgress
              key={data.fileName}
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
