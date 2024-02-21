'use client';

import DrawerComponent from './DrawerComponent';
import { DeleteForever, Edit } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/ContainedButton';
import useColorPalette from '@/hooks/useColorPalette';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetImageData, setIsEditImageDrawerOpen } from '@/lib/redux/slices/productFormSlice';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box } from '@mui/material';
import DraggableProductImagesContainer from '../draggableProductImages/DraggableProductImagesContainer';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import DrawerHeader from './DrawerHeader';

type Props = {
  isSubmitting: boolean;
};

export default function EditProductImagesDrawer({ isSubmitting }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const { imageData, productFormData, imageUploadProgress, isEditImageDrawerOpen } = useAppSelector(
    (state) => state.productForm
  );
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  function handleOpenEditImageDrawer() {
    dispatch(setIsEditImageDrawerOpen(true));
  }

  function handleCloseEditImageDrawer() {
    dispatch(setIsEditImageDrawerOpen(false));
  }

  async function handleDeleteAllImages() {
    setIsDeletingAllImages(true);

    await deleteAllProductImages(imageData, productFormData.productId);

    dispatch(resetImageData());
    setIsDeletingAllImages(false);
    dispatch(setIsEditImageDrawerOpen(false));
  }

  return (
    <>
      <OutlinedButton
        isDisabled={uploadInProgress || isSubmitting || imageData.length === 0}
        onClick={handleOpenEditImageDrawer}
        fullWidth
        label={'edit'}
        startIcon={<Edit />}
      />
      <DrawerComponent
        elevation={1}
        width={{ xs: '100vw', sm: '350px' }}
        isOpen={isEditImageDrawerOpen}
        zIndex={(theme) => theme.zIndex.appBar + 1}>
        <DrawerHeader
          label="Edit images"
          onClick={handleCloseEditImageDrawer}
        />
        <Box sx={{ overflow: 'auto', height: 1, opacity: isDeletingAllImages ? '50%' : null }}>
          <DraggableProductImagesContainer />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            padding: 2,
            gap: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              boxShadow: `0 -2px 4px 0 ${colorPalette.boxShadow}`,
              top: 0,
              right: 0,
              left: 0,
              height: '4px',
            },
          }}>
          <ContainedButton
            onClick={handleDeleteAllImages}
            disabled={isDeletingAllImages}
            isLoading={isDeletingAllImages}
            label={isDeletingAllImages ? '' : 'Delete all'}
            backgroundColor="warning"
            fullWidth
            startIcon={<DeleteForever />}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
