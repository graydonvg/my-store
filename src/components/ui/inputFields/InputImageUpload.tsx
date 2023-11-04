'use client';

import { Check, CloudUpload, DeleteForever, Edit } from '@mui/icons-material';
import CustomButton from '../buttons/CustomButton';
import { Input, InputProps } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Spinner } from '../progress/Spinner';
import ProductImageBoxes from '../ProductImageBoxes';
import { useEffect, useState } from 'react';
import { deleteImageFromStorage } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { resetImageData } from '@/lib/redux/addProduct/addProductSlice';
import deleteProductImageData from '@/services/delete-product-image-data';
import { deleteAllProductImages } from '@/lib/utils';

type InputImageUploadProps = InputProps & {
  isLoading: boolean;
};

export default function InputImageUpload({ isLoading, ...inputProps }: InputImageUploadProps) {
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
            <Input
              inputProps={{ accept: 'image/*', multiple: true }}
              type="file"
              sx={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              {...inputProps}
            />
          </>
        }
        startIcon={isLoading ? <Spinner size={20} /> : <CloudUpload />}
        fullWidth={true}
        component="label"
      />
    </>
  );
}
