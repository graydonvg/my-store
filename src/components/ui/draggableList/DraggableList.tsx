import { memo } from 'react';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import DraggableListItem from './DraggableListItem';
import { Box } from '@mui/material';
import { InsertProductImageDataTypeStore } from '@/types';

export type DraggableListProps = {
  imageData: InsertProductImageDataTypeStore[];
  onDragEnd: OnDragEndResponder;
};

const DraggableList = memo(({ imageData, onDragEnd }: DraggableListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {imageData.map((data, index) => (
              <DraggableListItem
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

DraggableList.displayName = 'DraggableList';

export default DraggableList;
