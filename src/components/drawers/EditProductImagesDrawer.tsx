'use client';

import DrawerComponent from './DrawerComponent';
import { ArrowDropDown, ArrowDropUp, Close, DeleteForever, Edit } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/ContainedButton';
import useColorPalette from '@/hooks/useColorPalette';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  deleteImage,
  resetImageData,
  setIsDeletingImage,
  setIsEditImageDrawerOpen,
  setUpdatedImageData,
} from '@/lib/redux/productForm/productFormSlice';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { deleteImageFromStorage } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { borderRadius } from '@/constants/styles';
import Image from 'next/image';

type Props = {
  isSubmitting: boolean;
};

export default function EditProductImagesDrawer({ isSubmitting }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const { imageData, isDeletingImage, productFormData, imageUploadProgress, isEditImageDrawerOpen } = useAppSelector(
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

  async function handleDeleteImage(fileName: string, productImageId?: string) {
    dispatch(setIsDeletingImage(true));

    if (fileName.length > 0) {
      await deleteImageFromStorage(fileName);
    }
    if (productFormData.productId && productImageId) {
      const { success, message } = await deleteProductImageDataFromDb(productImageId);

      if (success === false) {
        toast.error(message);
      }
    }

    dispatch(deleteImage({ fileName }));
    dispatch(setIsDeletingImage(false));
  }

  function getNewImageIndexes(currentIndex: number, newIndex: number) {
    return imageData.map((data) =>
      data.index === newIndex
        ? { ...data, index: currentIndex }
        : data.index === currentIndex
        ? { ...data, index: newIndex }
        : data
    );
  }

  function handleDecrementImageIndex(currentIndex: number) {
    if (currentIndex === 0) return;

    const newIndex = currentIndex - 1;

    const updatedImageIndexes = getNewImageIndexes(currentIndex, newIndex);

    dispatch(setUpdatedImageData(updatedImageIndexes));
  }

  function handleIncrementImageIndex(currentIndex: number) {
    if (currentIndex === imageData.length - 1) return;

    const newIndex = currentIndex + 1;

    const updatedImageIndexes = getNewImageIndexes(currentIndex, newIndex);

    dispatch(setUpdatedImageData(updatedImageIndexes));
  }

  return (
    <>
      <ContainedButton
        isDisabled={uploadInProgress || isSubmitting || imageData.length === 0}
        onClick={handleOpenEditImageDrawer}
        fullWidth
        label={'edit'}
        styles={{
          backgroundColor: colorPalette.shade.medium,
          '&:hover': {
            backgroundColor: colorPalette.shade.medium,
            filter: 'brightness(1.2)',
            transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
        }}
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
        <Box sx={{ padding: 2, overflowY: 'auto', height: 1 }}>
          <Grid
            container
            rowSpacing={4}>
            {imageData.map((image) => (
              <Grid
                key={`${image.fileName}`}
                item
                xs={12}>
                <Grid container>
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
                          cursor: 'pointer',
                        }}
                        fill
                        sizes="(min-width: 600px) 100px, calc(35vw - 25px)"
                        src={image.imageUrl}
                        alt={`Image for ${image.fileName}`}
                        priority
                      />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={4}>
                    <Box
                      sx={{
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 2,
                      }}>
                      <IconButton
                        onClick={() => handleDecrementImageIndex(image.index)}
                        disabled={isDeletingImage}
                        size="small">
                        <ArrowDropUp fontSize="large" />
                      </IconButton>
                      <Typography fontSize={24}>{image.index + 1}</Typography>
                      <IconButton
                        onClick={() => handleIncrementImageIndex(image.index)}
                        disabled={isDeletingImage}
                        size="small">
                        <ArrowDropDown fontSize="large" />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={4}>
                    <Box
                      sx={{
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <IconButton
                        disabled={isDeletingImage}
                        size="small"
                        onClick={() => handleDeleteImage(image.fileName, image.productImageId)}>
                        <DeleteForever fontSize="large" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
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
