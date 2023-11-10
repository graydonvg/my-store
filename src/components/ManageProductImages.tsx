'use client';

import { Check, CloudUpload, DeleteForever, Edit } from '@mui/icons-material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import ProductImageBoxes from './ui/productImages/ProductImageBoxes';
import { useEffect, useState } from 'react';
import { resetImageData } from '@/lib/redux/addProduct/addProductSlice';
import { deleteAllProductImages } from '@/lib/utils';
import { Box, InputProps } from '@mui/material';
import CustomButton from './ui/buttons/CustomButton';
import { Spinner } from './ui/progress/Spinner';
import ImageInput from './ui/inputFields/ImageInput';

type Props = InputProps & {
  isLoading: boolean;
};

export default function ManageProductImages({ isLoading, ...inputProps }: Props) {
  const dispatch = useAppDispatch();
  const { imageUploadProgress, imageData, isDeletingImage, productToUpdateId } = useAppSelector(
    (state) => state.addProduct
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const color = useCustomColorPalette();
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  useEffect(() => {
    if (imageData.length === 0) {
      setIsEditMode(false);
    }
  }, [imageData]);

  function handleToggleEditMode() {
    setIsEditMode((previousMode) => !previousMode);
  }

  async function handleDeleteAllImages() {
    setIsDeletingAllImages(true);

    await deleteAllProductImages(imageData, productToUpdateId);

    dispatch(resetImageData());
    setIsDeletingAllImages(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <ProductImageBoxes isEditMode={isEditMode} />
      <CustomButton
        onClick={handleDeleteAllImages}
        fullWidth
        label="delete all"
        backgroundColor="red"
        disabled={isDeletingAllImages || !isEditMode}
        startIcon={isDeletingAllImages ? <Spinner size={20} /> : <DeleteForever />}
      />
      <CustomButton
        disabled={isDeletingImage || uploadInProgress || imageData.length === 0}
        onClick={() => handleToggleEditMode()}
        fullWidth={true}
        label={isEditMode ? 'done' : 'edit'}
        styles={{
          backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
          '&:hover': {
            backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
            filter: 'brightness(1.2)',
            transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
        }}
        startIcon={
          isEditMode ? (
            isDeletingImage ? (
              <Spinner
                providedColor="white"
                size={20}
              />
            ) : (
              <Check />
            )
          ) : (
            <Edit />
          )
        }
      />
      <CustomButton
        disabled={isLoading || isEditMode}
        styles={{
          backgroundColor: color.blue.dark,
          '&:hover': { backgroundColor: color.blue.light },
        }}
        label={
          <>
            {isLoading ? 'uploading...' : 'upload images'}
            <ImageInput {...inputProps} />
          </>
        }
        startIcon={isLoading ? <Spinner size={20} /> : <CloudUpload />}
        fullWidth={true}
        component="label"
      />
    </Box>
  );
}
