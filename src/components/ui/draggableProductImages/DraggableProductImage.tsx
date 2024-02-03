import { Draggable } from '@hello-pangea/dnd';
import { Box, Divider, Grid, IconButton, ListItem, Skeleton } from '@mui/material';
import { InsertProductImageDataTypeStore } from '@/types';
import Image from 'next/image';
import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { DeleteForever, DragHandle } from '@mui/icons-material';
import TextButton from '../buttons/TextButton';
import { toast } from 'react-toastify';
import { deleteImageFromStorage } from '@/lib/firebase';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteImage, setIsDeletingImage } from '@/lib/redux/productForm/productFormSlice';
import { useState } from 'react';

export type Props = {
  imageData: InsertProductImageDataTypeStore;
  index: number;
};

export default function DraggableProductImage({ imageData, index }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const { isDeletingImage, productFormData } = useAppSelector((state) => state.productForm);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);
  const isDeletingCurrentImage = isDeletingImage && imageToDeleteIndex === index;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
            sx={{
              backgroundColor: snapshot.isDragging ? colorPalette.boxShadow : '',
              borderRadius: BORDER_RADIUS,
              paddingY: 2,
              opacity: isDeletingCurrentImage ? '50%' : null,
            }}>
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
                      borderRadius: BORDER_RADIUS,
                      opacity: !isImageLoaded ? 0 : 100,
                    }}
                    fill
                    sizes="(min-width: 600px) 100px, calc(35vw - 25px)"
                    src={imageData.imageUrl}
                    alt={`Image for ${imageData.fileName}`}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  {!isImageLoaded ? (
                    <Skeleton
                      height="100%"
                      width="100%"
                      variant="rectangular"
                    />
                  ) : null}
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
                    label={isDeletingCurrentImage ? '' : 'delete'}
                    onClick={handleDeleteImage}
                    isLoading={isDeletingCurrentImage}
                    disabled={isDeletingCurrentImage}
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
}
