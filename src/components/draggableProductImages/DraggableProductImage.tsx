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
import { deleteImageData, setIsDeletingImage } from '@/lib/redux/slices/productImagesSlice';
import { Reorder, useDragControls, useMotionValue } from 'framer-motion';
import { useBackgroundColorOnDrag } from '@/hooks/useBackgroundColorOnDrag';

export type Props = {
  imageData: InsertProductImageDataTypeStore;
  arrayIndex: number;
};

export default function DraggableProductImage({ imageData, arrayIndex }: Props) {
  const y = useMotionValue(1);
  const backgroundColorOnDrag = useBackgroundColorOnDrag(y);
  const dragControls = useDragControls();
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const isDeletingImage = useAppSelector((state) => state.productImages.isDeletingImage);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isDeletingCurrentImage = isDeletingImage && imageToDeleteIndex === arrayIndex;

  function handleDragStart(e: PointerEvent<HTMLButtonElement>) {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }

    dragControls.start(e);
  }

  async function deleteImage() {
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

    dispatch(deleteImageData({ fileName: imageData.fileName }));
    setImageToDeleteIndex(null);
    dispatch(setIsDeletingImage(false));
  }

  return (
    <>
      <Reorder.Item
        value={imageData}
        dragListener={false}
        dragControls={dragControls}
        style={{ position: 'relative', backgroundColor: backgroundColorOnDrag, y }}>
        <Grid
          container
          sx={{
            borderRadius: BORDER_RADIUS,
            paddingY: 2,
            opacity: isDeletingCurrentImage ? 0.5 : 1,
          }}>
          <Grid
            item
            xs={2}
            sx={{ display: 'grid', placeItems: 'center' }}>
            <IconButton
              aria-label="drag handle"
              onPointerDown={(e) => handleDragStart(e)}
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
                onClick={deleteImage}
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
