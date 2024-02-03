import { DropResult } from '@hello-pangea/dnd';
import DraggableProductImages from './DraggableProductImages';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUpdatedImageData } from '@/lib/redux/productForm/productFormSlice';

export default function DraggableProductImagesContainer() {
  const dispatch = useAppDispatch();
  const imageData = useAppSelector((state) => state.productForm.imageData);

  function onDragEnd({ destination, source }: DropResult) {
    // dropped outside the list
    if (!destination) return;

    // Create a copy of the items array to modify
    const updatedImageData = [...imageData];

    // Remove the dragged item from its original position
    const [draggedItem] = updatedImageData.splice(source.index, 1);

    // Insert the dragged item at its new position
    updatedImageData.splice(destination.index, 0, draggedItem);

    dispatch(setUpdatedImageData(updatedImageData));
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <Box sx={{ flex: 1 }}>
        <DraggableProductImages
          imageData={imageData}
          onDragEnd={onDragEnd}
        />
      </Box>
    </Box>
  );
}
