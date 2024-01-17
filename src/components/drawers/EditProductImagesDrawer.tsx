'use client';

import DrawerComponent from './DrawerComponent';
import { Close, DeleteForever, Edit } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/ContainedButton';
import useColorPalette from '@/hooks/useColorPalette';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetImageData, setIsEditImageDrawerOpen } from '@/lib/redux/productForm/productFormSlice';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box, IconButton, Typography } from '@mui/material';
import DraggableListContainer from '../ui/draggableList/DraggableListContainer';
import OutlinedButton from '../ui/buttons/OutlinedButton';

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
        <Box
          sx={{
            backgroundColor: colorPalette.navBar.upper.background,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            padding: 2,
          }}>
          <Typography
            color={colorPalette.navBar.upper.text}
            variant="h5"
            component="span">
            Edit images
          </Typography>
          <IconButton
            size="small"
            sx={{
              cursor: 'pointer',
              padding: 0,
              color: colorPalette.navBar.upper.text,
              '&:hover': { backgroundColor: colorPalette.navBar.upper.background },
            }}
            aria-label="close navigation drawer"
            onClick={handleCloseEditImageDrawer}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ overflow: 'auto', height: 1, opacity: isDeletingAllImages ? '50%' : null }}>
          <DraggableListContainer />
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
            isDisabled={isDeletingAllImages}
            isLoading={isDeletingAllImages}
            label={isDeletingAllImages ? '' : 'Delete all'}
            backgroundColor="red"
            fullWidth
            startIcon={<DeleteForever />}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
