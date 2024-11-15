import { useAppSelector } from '@/lib/redux/hooks';
import { CircularProgressWithLabel } from '@/components/ui/progress/CircularProgressWithLabel';
import LargeProductImageContainer from './LargeProductImageContainer';

type Props = {
  selectedImageIndex: number;
  boxBorderColor: string;
};

export default function LargeBoxWithUploadProgress({ selectedImageIndex, boxBorderColor }: Props) {
  const { imageUploadProgress } = useAppSelector((state) => state.productImages);

  return (
    <LargeProductImageContainer boxBorderColor={boxBorderColor}>
      <CircularProgressWithLabel value={imageUploadProgress[selectedImageIndex].progress} />
    </LargeProductImageContainer>
  );
}
