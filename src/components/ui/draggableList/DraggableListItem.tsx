import { Draggable } from '@hello-pangea/dnd';
import { Box, Divider, Grid, IconButton, ListItem } from '@mui/material';
import { InsertProductImageDataTypeStore } from '@/types';
import Image from 'next/image';
import { borderRadius } from '@/constants/styles';
import useColorPalette from '@/hooks/useColorPalette';
import { DeleteForever, DragHandle, DragIndicator } from '@mui/icons-material';
import TextButton from '../buttons/TextButton';
import { toast } from 'react-toastify';
import { deleteImageFromStorage } from '@/lib/firebase';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteImage, setIsDeletingImage } from '@/lib/redux/productForm/productFormSlice';
import { useState } from 'react';

export type DraggableListItemProps = {
  imageData: InsertProductImageDataTypeStore;
  index: number;
};

const DraggableListItem = ({ imageData, index }: DraggableListItemProps) => {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const { isDeletingImage, productFormData } = useAppSelector((state) => state.productForm);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);

  async function handleDeleteImage() {
    dispatch(setIsDeletingImage(true));
    setImageToDeleteIndex(imageData.index);

    if (imageData.fileName.length > 0) {
      await deleteImageFromStorage(imageData.fileName);
    }
    if (productFormData.productId && imageData.productImageId) {
      const { success, message } = await deleteProductImageDataFromDb(imageData.productImageId);

      if (success === false) {
        toast.error(message);
      }
    }

    dispatch(deleteImage({ fileName: imageData.fileName }));
    setImageToDeleteIndex(null);
    dispatch(setIsDeletingImage(false));
  }

  return (
    <Draggable
      draggableId={imageData.fileName}
      index={index}>
      {(provided, snapshot) => (
        <>
          <ListItem
            disableGutters
            disablePadding
            ref={provided.innerRef}
            {...provided.draggableProps}
            // {...provided.dragHandleProps}
            sx={{ backgroundColor: snapshot.isDragging ? colorPalette.boxShadow : '', borderRadius, paddingY: 2 }}>
            <Grid container>
              <Grid
                item
                xs={2}
                sx={{ display: 'grid', placeItems: 'center' }}>
                <IconButton
                  {...provided.dragHandleProps}
                  disableRipple
                  sx={{ cursor: 'grab' }}>
                  <DragHandle fontSize="large" />
                </IconButton>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: 'grid' }}>
                <Box
                  sx={{
                    position: 'relative',
                    aspectRatio: 3 / 4,
                    alignSelf: 'center',
                  }}>
                  <Image
                    style={{
                      objectFit: 'cover',
                      borderRadius: borderRadius,
                    }}
                    fill
                    sizes="(min-width: 600px) 100px, calc(35vw - 25px)"
                    src={imageData.imageUrl}
                    alt={`Image for ${imageData.fileName}`}
                    priority
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={6}>
                <Box
                  sx={{
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextButton
                    label={isDeletingImage && imageToDeleteIndex === index ? '' : 'delete'}
                    onClick={handleDeleteImage}
                    isLoading={isDeletingImage && imageToDeleteIndex === index}
                    disabled={isDeletingImage && imageToDeleteIndex === index}
                    labelColor={colorPalette.typography}
                    startIcon={<DeleteForever />}
                  />
                </Box>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
        </>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
