'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import SmallProductImageBox from './SmallProductImageBox';

type Props = {
  boxBorderColor: string;
};

export default function EmptySmallBoxWithBorder({ boxBorderColor }: Props) {
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productForm);

  return Array.from(Array(5 - imageData.length - imageUploadProgress.length)).map((_, index) => (
    <SmallProductImageBox
      key={`empty-small-box-${index}`}
      boxBorderColor={boxBorderColor}
    />
  ));
}
