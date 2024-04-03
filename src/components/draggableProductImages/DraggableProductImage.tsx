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
import { useState } from 'react';
import { deleteImageData, setIsDeletingImage } from '@/lib/redux/slices/productImagesSlice';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export type Props = {
  imageData: InsertProductImageDataTypeStore & { id: string };
  activeItemId: UniqueIdentifier | null;
};

export default function DraggableProductImage({ imageData, activeItemId }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const isDeletingImage = useAppSelector((state) => state.productImages.isDeletingImage);
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isDeletingCurrentImage = isDeletingImage && imageToDeleteId === imageData.id;
  const {
    attributes: { role, ...restOfAttributes },
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: imageData.id,
  });

  async function deleteImage() {
    dispatch(setIsDeletingImage(true));
    setImageToDeleteId(imageData.id);

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
    setImageToDeleteId(null);
    dispatch(setIsDeletingImage(false));
  }

  return (
    <>
      <Grid
        container
        ref={setNodeRef}
        sx={{
          borderRadius: BORDER_RADIUS,
          paddingY: 2,
          opacity: isDeletingCurrentImage ? 0.5 : 1,
          backgroundColor: imageData.id === activeItemId ? colorPalette.boxShadow : 'transparent',
          transform: CSS.Translate.toString(transform),
          transition,
        }}>
        <Grid
          item
          xs={2}
          sx={{ display: 'grid', placeItems: 'center' }}>
          <IconButton
            {...listeners}
            {...restOfAttributes}
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
                style={{ borderRadius: BORDER_RADIUS }}
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
              display: 'grid',
              placeItems: 'center',
            }}>
            <TextButton
              label={!isDeletingCurrentImage ? 'delete' : ''}
              onClick={deleteImage}
              isLoading={isDeletingCurrentImage}
              disabled={isDeletingCurrentImage}
              labelColor={colorPalette.typography}
              startIcon={<DeleteForever />}
            />
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}
