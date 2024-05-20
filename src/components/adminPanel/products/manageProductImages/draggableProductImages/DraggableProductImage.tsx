import { Box, Divider, Grid, IconButton, Skeleton, useTheme } from '@mui/material';
import { InsertProductImageDataStore } from '@/types';
import Image from 'next/image';
import { BORDER_RADIUS } from '@/data';
import { DeleteForever, DragHandle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { deleteProductImageFromStorage } from '@/lib/firebase';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useState } from 'react';
import {
  deleteImageData,
  setIsDeletingImage,
  setIsEditImagesDrawerOpen,
} from '@/lib/redux/features/productImages/productImagesSlice';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import TextButton from '@/components/ui/buttons/simple/TextButton';

export type Props = {
  imageData: InsertProductImageDataStore & { id: string };
  activeItemId: UniqueIdentifier | null;
};

export default function DraggableProductImage({ imageData, activeItemId }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { isDeletingImage, imageData: imageDataArray } = useAppSelector((state) => state.productImages);
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
  const darkMode = theme.palette.mode === 'dark';
  const containerBgColor = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';

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

    if (imageDataArray.length === 1) {
      dispatch(setIsEditImagesDrawerOpen(false));
    }
  }

  return (
    <>
      <Grid
        container
        ref={setNodeRef}
        sx={{
          borderRadius: BORDER_RADIUS,
          paddingY: 2,
          backgroundColor: imageData.id === activeItemId ? containerBgColor : 'transparent',
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
            <DragHandle
              fontSize="large"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                },
                '&:active': {
                  color: theme.palette.text.primary,
                },
              }}
            />
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
              borderRadius: BORDER_RADIUS,
              overflow: 'hidden',
            }}>
            <Image
              style={{
                objectFit: 'cover',
                opacity: !isImageLoaded ? 0 : isDeletingCurrentImage ? 0.5 : 100,
              }}
              fill
              sizes="(min-width: 600px) 224px,(min-width: 420px) 390px, 272px"
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
              display: 'grid',
              placeItems: 'center',
            }}>
            <TextButton
              label={!isDeletingCurrentImage ? 'delete' : ''}
              onClick={deleteImage}
              isLoading={isDeletingCurrentImage}
              startIcon={<DeleteForever />}
              sxStyles={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                },
                '&:active': {
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}
