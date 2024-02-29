import { memo } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import DraggableProductImage from './DraggableProductImage';
import { Box } from '@mui/material';
import { DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUpdatedImageData } from '@/lib/redux/slices/productImagesSlice';

const DraggableProductImages = memo(() => {
  const dispatch = useAppDispatch();
  const imageData = useAppSelector((state) => state.productImages.imageData);

  function handleDragStart() {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  function handleDragEnd({ destination, source }: DropResult) {
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
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable-list">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {imageData.map((data, index) => (
                  <DraggableProductImage
                    key={data.fileName}
                    imageData={data}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
});

DraggableProductImages.displayName = 'DraggableProductImages';

export default DraggableProductImages;
