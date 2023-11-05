'use client';

import { Check, CloudUpload, DeleteForever, Edit } from '@mui/icons-material';
import CustomButton from './buttons/CustomButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Spinner } from './progress/Spinner';
import ProductImageBoxes from './ProductImageBoxes';
import { useEffect, useState } from 'react';
import { resetImageData } from '@/lib/redux/addProduct/addProductSlice';
import { deleteAllProductImages } from '@/lib/utils';
import ImageInput from './inputFields/ImageInput';
import { InputProps } from '@mui/material';

type Props = InputProps & {
  isLoading: boolean;
};

export default function ProductImages({ isLoading, ...inputProps }: Props) {
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
    <>
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
    </>
  );
}
