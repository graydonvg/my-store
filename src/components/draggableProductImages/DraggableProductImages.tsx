import DraggableProductImage from './DraggableProductImage';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUpdatedImageData } from '@/lib/redux/slices/productImagesSlice';
import { Reorder } from 'framer-motion';
import { InsertProductImageDataTypeStore } from '@/types';

type Props = {
  isDeletingAllImages: boolean;
};

export default function DraggableProductImages({ isDeletingAllImages }: Props) {
  const dispatch = useAppDispatch();
  const imageData = useAppSelector((state) => state.productImages.imageData);

  function handleReorder(reorderedImageData: InsertProductImageDataTypeStore[]) {
    dispatch(setUpdatedImageData(reorderedImageData));
  }

  return (
    <Reorder.Group
      axis="y"
      values={imageData}
      layoutScroll
      style={{ overflowY: 'auto', opacity: isDeletingAllImages ? 0.5 : 1, height: '100%' }}
      onReorder={(reorderedImageData) => handleReorder(reorderedImageData)}>
      {imageData.map((data, index) => (
        <DraggableProductImage
          key={data.fileName}
          imageData={data}
          arrayIndex={index}
        />
      ))}
    </Reorder.Group>
  );
}
