import DraggableProductImage from './DraggableProductImage';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setUpdatedImageData } from '@/lib/redux/features/productImages/productImagesSlice';
import { DndContext, DragEndEvent, UniqueIdentifier, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Box } from '@mui/material';
import { useState } from 'react';

type Props = {
  isDeletingAllImages: boolean;
};

export default function DraggableProductImages({ isDeletingAllImages }: Props) {
  const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);
  const dispatch = useAppDispatch();
  const imageData = useAppSelector((state) => state.productImages.imageData);
  const imageDataWithId = imageData.map((data) => {
    return { ...data, id: data.fileName };
  });

  function handleDragStart(event: DragEndEvent) {
    setActiveItemId(event.active.id);

    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItemId(null);

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = imageDataWithId.findIndex((data) => data.id === active.id);
    const overIndex = imageDataWithId.findIndex((data) => data.id === over.id);

    const sortedImageData = arrayMove(imageDataWithId, activeIndex, overIndex);

    const imageDataWithNoId = sortedImageData.map((data) => {
      const { id, ...restOfData } = data;
      return restOfData;
    });

    dispatch(setUpdatedImageData(imageDataWithNoId));
  }

  return (
    <Box style={{ overflowY: 'auto', opacity: isDeletingAllImages ? 0.5 : 1, height: '100%' }}>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={imageDataWithId}
          strategy={verticalListSortingStrategy}>
          {imageDataWithId.map((data) => (
            <DraggableProductImage
              key={data.fileName}
              imageDataProp={data}
              activeItemId={activeItemId}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
}
