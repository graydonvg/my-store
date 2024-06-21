import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';
import { CONSTANTS } from '@/constants';

type Props = {
  boxBorderColor: string;
};

export default function EmptySmallBoxWithBorder({ boxBorderColor }: Props) {
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const numberOfEmptyBoxes = CONSTANTS.MAXIMUM_PRODUCT_IMAGES - imageData.length - imageUploadProgress.length;

  return Array.from(Array(numberOfEmptyBoxes)).map((_, index) => (
    <SmallProductImageBox
      key={`empty-small-box-${index}`}
      boxBorderColor={boxBorderColor}
    />
  ));
}
