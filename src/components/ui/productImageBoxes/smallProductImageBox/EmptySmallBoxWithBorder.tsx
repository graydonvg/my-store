import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';

type Props = {
  boxBorderColor: string;
  maxImageCount: number;
};

export default function EmptySmallBoxWithBorder({ boxBorderColor, maxImageCount }: Props) {
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);
  const numberOfEmptyBoxes = maxImageCount - imageData.length - imageUploadProgress.length;

  return Array.from(Array(numberOfEmptyBoxes)).map((_, index) => (
    <SmallProductImageBox
      key={`empty-small-box-${index}`}
      boxBorderColor={boxBorderColor}
    />
  ));
}
