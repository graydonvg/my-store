import { Box, Divider, Grid, IconButton, Skeleton, useTheme } from '@mui/material';
import { InsertProductImageDataStore } from '@/types';
import Image from 'next/image';
import { constants } from '@/constants';
import { DeleteForever, DragHandle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { deleteProductImageFromStorage } from '@/lib/firebase';
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
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData, selectIsDeletingImage } from '@/lib/redux/features/productImages/productImagesSelectors';
import { deleteProductImageDataFromDb } from '@/services/admin/delete';

export type Props = {
  imageDataProps: InsertProductImageDataStore & { id: string };
  activeItemId: UniqueIdentifier | null;
};

export default function DraggableProductImage({ imageDataProps, activeItemId }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const productFormData = useAppSelector(selectProductFormData);
  const selectedImageData = useAppSelector(selectImageData);
  const isDeletingImage = useAppSelector(selectIsDeletingImage);
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isDeletingCurrentImage = isDeletingImage && imageToDeleteId === imageDataProps.id;
  const {
    attributes: { role, ...restOfAttributes },
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: imageDataProps.id,
  });
  const darkMode = theme.palette.mode === 'dark';
  const containerBgColor = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';

  async function deleteImage() {
    dispatch(setIsDeletingImage(true));
    setImageToDeleteId(imageDataProps.id);

    if (imageDataProps.fileName.length > 0) {
      await deleteProductImageFromStorage(imageDataProps.fileName);
    }

    if (productFormData.productId && imageDataProps.productImageId) {
      const { success, message } = await deleteProductImageDataFromDb(imageDataProps.productImageId);

      if (success === false) {
        toast.error(message);
      }
    }

    dispatch(deleteImageData({ fileName: imageDataProps.fileName }));
    setImageToDeleteId(null);
    dispatch(setIsDeletingImage(false));

    if (selectedImageData.length === 1) {
      dispatch(setIsEditImagesDrawerOpen(false));
    }
  }

  return (
    <>
      <Grid
        container
        ref={setNodeRef}
        sx={{
          borderRadius: constants.borderRadius,
          paddingY: 2,
          backgroundColor: imageDataProps.id === activeItemId ? containerBgColor : 'transparent',
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
              borderRadius: constants.borderRadius,
              overflow: 'hidden',
            }}>
            <Image
              style={{
                objectFit: 'cover',
                opacity: !isImageLoaded ? 0 : isDeletingCurrentImage ? 0.5 : 100,
              }}
              fill
              sizes="(min-width: 600px) 113px, calc(35vw - 15px)"
              src={imageDataProps.imageUrl}
              alt={`Image for ${imageDataProps.fileName}`}
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
