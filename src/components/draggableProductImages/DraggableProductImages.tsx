import { memo } from 'react';
import { DragDropContext, DragStart, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import DraggableProductImage from './DraggableProductImage';
import { Box } from '@mui/material';
import { InsertProductImageDataTypeStore } from '@/types';

export type Props = {
  imageData: InsertProductImageDataTypeStore[];
  onDragEnd: OnDragEndResponder;
};

const DraggableProductImages = memo(({ imageData, onDragEnd }: Props) => {
  function handleDragStart() {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}>
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
  );
});

DraggableProductImages.displayName = 'DraggableProductImages';

export default DraggableProductImages;
