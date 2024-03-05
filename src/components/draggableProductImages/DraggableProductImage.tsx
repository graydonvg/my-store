import { Box, Divider, Grid, IconButton, Skeleton } from '@mui/material';
import { InsertProductImageDataTypeStore } from '@/types';
import Image from 'next/image';
import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { DeleteForever, DragHandle } from '@mui/icons-material';
import TextButton from '../ui/buttons/TextButton';
import { toast } from 'react-toastify';
import { deleteProductImageFromStorage } from '@/lib/firebase';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { PointerEvent, useState } from 'react';
import { deleteImage, setIsDeletingImage } from '@/lib/redux/slices/productImagesSlice';

import { Reorder, useDragControls } from 'framer-motion';

export type Props = {
  imageData: InsertProductImageDataTypeStore;
  arrayIndex: number;
};

export default function DraggableProductImage({ imageData, arrayIndex }: Props) {
  const dragControls = useDragControls();
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const isDeletingImage = useAppSelector((state) => state.productImages.isDeletingImage);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDeletingCurrentImage = isDeletingImage && imageToDeleteIndex === arrayIndex;

  async function handleDeleteImage() {
    dispatch(setIsDeletingImage(true));
    setImageToDeleteIndex(imageData.index);

    if (imageData.fileName.length > 0) {
      await deleteProductImageFromStorage(imageData.fileName);
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

  function handleDragStart(e: PointerEvent<HTMLButtonElement>) {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }

    setIsDragging(true);

    dragControls.start(e);
  }

  function onDragEnd() {
    setIsDragging(false);
  }

  return (
    <>
      <Reorder.Item
        value={imageData}
        dragListener={false}
        dragControls={dragControls}
        style={{ position: 'relative' }}>
        <Grid
          container
          sx={{
            backgroundColor: isDragging ? colorPalette.boxShadow : '',
            borderRadius: BORDER_RADIUS,
            paddingY: 2,
            opacity: isDeletingCurrentImage ? '50%' : null,
          }}>
          <Grid
            item
            xs={2}
            sx={{ display: 'grid', placeItems: 'center' }}>
            <IconButton
              aria-label="reorder handle"
              onPointerDown={(e) => handleDragStart(e)}
              onPointerUp={onDragEnd}
              disableRipple
              sx={{ cursor: 'grab', touchAction: 'none' }}>
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
      </Reorder.Item>
      <Divider />
    </>
  );
}
