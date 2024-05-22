import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';

type Props = {
  boxBorderColor: string;
  maxImageCount: number;
};

export default function EmptySmallBoxWithBorder({ boxBorderColor, maxImageCount }: Props) {
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const numberOfEmptyBoxes = maxImageCount - imageData.length - imageUploadProgress.length;

  return Array.from(Array(numberOfEmptyBoxes)).map((_, index) => (
    <SmallProductImageBox
      key={`empty-small-box-${index}`}
      boxBorderColor={boxBorderColor}
    />
  ));
}
