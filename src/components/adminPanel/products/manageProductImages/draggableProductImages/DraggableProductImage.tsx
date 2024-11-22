import { Box, Divider, Grid2, IconButton, Skeleton, useTheme } from '@mui/material';
import { ProductImageData } from '@/types';
import Image from 'next/image';

import { DeleteForever, DragHandle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { MouseEvent, useState } from 'react';
import {
  deleteImageData,
  setIsDeletingImage,
  setIsEditImagesDrawerOpen,
} from '@/lib/redux/features/productImages/productImagesSlice';
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import TextButton from '@/components/ui/buttons/TextButton';
import { selectImageData, selectIsDeletingImage } from '@/lib/redux/features/productImages/productImagesSelectors';
import { deleteProductImages } from '@/services/admin/delete';
import { BORDER_RADIUS } from '@/constants';

export type Props = {
  imageDataProp: ProductImageData & { id: string };
  activeItemId: UniqueIdentifier | null;
};

export default function DraggableProductImage({ imageDataProp, activeItemId }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const imageDataStore = useAppSelector(selectImageData);
  const isDeletingImage = useAppSelector(selectIsDeletingImage);
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isDeletingCurrentImage = isDeletingImage && imageToDeleteId === imageDataProp.id;
  const {
    attributes: { role, ...restOfAttributes },
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: imageDataProp.id,
  });
  const darkMode = theme.palette.mode === 'dark';
  const containerBgColor = darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';

  async function deleteImage(event: MouseEvent) {
    // stopPropagation to prevent the drawer from closing on button click
    event.stopPropagation();

    dispatch(setIsDeletingImage(true));
    setImageToDeleteId(imageDataProp.id);

    const { success, message } = await deleteProductImages([
      { productImageId: imageDataProp.productImageId, fileName: imageDataProp.fileName },
    ]);

    if (success) {
      dispatch(deleteImageData({ fileName: imageDataProp.fileName }));
    } else {
      toast.error(message);
    }

    setImageToDeleteId(null);
    dispatch(setIsDeletingImage(false));

    if (imageDataStore.length === 1) {
      dispatch(setIsEditImagesDrawerOpen(false));
    }
  }

  return (
    <>
      <Grid2
        container
        ref={setNodeRef}
        sx={{
          borderRadius: BORDER_RADIUS,
          paddingY: 2,
          backgroundColor: imageDataProp.id === activeItemId ? containerBgColor : 'transparent',
          transform: CSS.Translate.toString(transform),
          transition,
        }}>
        <Grid2
          size={{ xs: 2 }}
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
        </Grid2>
        <Grid2
          size={{ xs: 4 }}
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
              sizes="(min-width: 600px) 113px, calc(35vw - 15px)"
              src={imageDataProp.imageUrl}
              alt={`Image for ${imageDataProp.fileName}`}
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
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
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
        </Grid2>
      </Grid2>
      <Divider />
    </>
  );
}
