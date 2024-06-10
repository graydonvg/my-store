import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';

type Props = {
  boxBorderColor: string;
};

export default function SmallBoxWithUploadProgress({ boxBorderColor }: Props) {
  const { imageUploadProgress } = useAppSelector((state) => state.productImages);

  return (
    <>
      {imageUploadProgress.map((data) => (
        <SmallProductImageBox
          key={data.fileName}
          uploadProgressData={data}
          boxBorderColor={boxBorderColor}
        />
      ))}
    </>
  );
}
