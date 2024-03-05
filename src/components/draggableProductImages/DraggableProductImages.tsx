import DraggableProductImage from './DraggableProductImage';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUpdatedImageData } from '@/lib/redux/slices/productImagesSlice';

import { Reorder } from 'framer-motion';
import { InsertProductImageDataTypeStore } from '@/types';

export default function DraggableProductImages() {
  const dispatch = useAppDispatch();
  const imageData = useAppSelector((state) => state.productImages.imageData);

  function handleReorder(reorderedImageData: InsertProductImageDataTypeStore[]) {
    dispatch(setUpdatedImageData(reorderedImageData));
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1 }}>
        <Reorder.Group
          axis="y"
          layoutScroll
          values={imageData}
          onReorder={(reorderedImageData) => handleReorder(reorderedImageData)}>
          {imageData.map((data, index) => (
            <DraggableProductImage
              key={data.fileName}
              imageData={data}
              arrayIndex={index}
            />
          ))}
        </Reorder.Group>
      </Box>
    </Box>
  );
}
