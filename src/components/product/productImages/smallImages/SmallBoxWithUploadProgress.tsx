import SmallProductImageContainer from './SmallProductImageContainer';
import { CircularProgressWithLabel } from '@/components/ui/progress/CircularProgressWithLabel';

type Props = {
  progress: number;
  boxBorderColor: string;
};

export default function SmallBoxWithUploadProgress({ progress, boxBorderColor }: Props) {
  return (
    <SmallProductImageContainer boxBorderColor={boxBorderColor}>
      <CircularProgressWithLabel value={progress} />
    </SmallProductImageContainer>
  );
}
