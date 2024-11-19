import { useAppSelector } from '@/lib/redux/hooks';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import SmallProductImage from './SmallProductImage';

import SmallProductImageContainer from './SmallProductImageContainer';
import { CircularProgressWithLabel } from '@/components/ui/progress/CircularProgressWithLabel';
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

  return (
    <>
      {Array.from(Array(MAXIMUM_PRODUCT_IMAGES)).map((_, index) => {
        const imageUploadInfo = imageUploadProgress[index];
        const currentImageData = imageData.find((image) => image.imageIndex === index);

        const isDefaultBorderColor = !currentImageData;
        const isFocusedBorderColor = imageUploadInfo?.fileName?.length > 0;

        function handleImageClick() {
          if (currentImageData?.imageIndex !== undefined) {
            selectImage(currentImageData.imageIndex);
          }
        }

        return (
          <SmallProductImageContainer
            key={index}
            boxBorderColor={getBoxBorderColor({
              defaultBorderColor: isDefaultBorderColor,
              focusedBorderColor: isFocusedBorderColor,
            })}>
            {imageUploadInfo?.fileName && <CircularProgressWithLabel value={imageUploadInfo.progress} />}

            {currentImageData?.imageUrl && (
              <SmallProductImage
                productImageData={currentImageData}
                onClick={handleImageClick}
                imageIndex={currentImageData.imageIndex}
                selectedImageIndex={selectedImageIndex}
              />
            )}
          </SmallProductImageContainer>
        );
      })}
    </>
  );
}
