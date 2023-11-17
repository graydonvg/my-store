'use client';

import { Check, CloudUpload, DeleteForever, Edit } from '@mui/icons-material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  resetImageData,
  resetImageUploadProgess,
  setImageData,
  setImageUploadProgress,
} from '@/lib/redux/addProduct/addProductSlice';
import { deleteAllProductImages, generateUniqueFileName } from '@/lib/utils';
import { Box } from '@mui/material';
import ContainedButton from './ui/buttons/ContainedButton';
import ImageInput from './ui/inputFields/ImageInput';
import { toast } from 'react-toastify';
import { uploadImageToStorage } from '@/lib/firebase';

type Props = {
  isLoading: boolean;
};

export default function ManageProductImages({ isLoading }: Props) {
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

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    if (files.length + imageData.length > 5) return toast.error('Max. 5 images allowed');

    const imagesToUpload = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = generateUniqueFileName(file.name);

      imagesToUpload.push({ file, uniqueFileName });
    }

    const uploadPromises = imagesToUpload.map((image) =>
      uploadImageToStorage(image.file, image.uniqueFileName, (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        dispatch(setImageUploadProgress({ file_name: image.uniqueFileName, progress }));

        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      })
    );

    const imageDataArray = await Promise.allSettled(uploadPromises);

    imageDataArray.map((result, index) => {
      if (result.status === 'fulfilled') {
        const { file_name, image_url } = result.value;
        return dispatch(setImageData({ file_name, image_url, index: index + imageData.length }));
      } else if (result.status === 'rejected') {
        toast.error('Image upload failed.');
        return dispatch(setImageData({ file_name: '', image_url: '', index: index + imageData.length }));
      }
    });

    dispatch(resetImageUploadProgess());
  }

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
      <ContainedButton
        onClick={handleDeleteAllImages}
        fullWidth
        label={isDeletingAllImages ? '' : 'delete all'}
        backgroundColor="red"
        isDisabled={!isEditMode || isDeletingAllImages}
        isLoading={isDeletingAllImages}
        startIcon={<DeleteForever />}
      />
      <ContainedButton
        isDisabled={isDeletingImage || uploadInProgress || imageData.length === 0}
        onClick={() => handleToggleEditMode()}
        fullWidth
        label={isDeletingImage ? '' : isEditMode ? 'done' : 'edit'}
        styles={{
          backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
          '&:hover': {
            backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
            filter: 'brightness(1.2)',
            transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
        }}
        startIcon={isEditMode ? <Check /> : <Edit />}
      />
      <ContainedButton
        backgroundColor="blue"
        isDisabled={isLoading || isEditMode}
        styles={{
          '&:hover': { backgroundColor: color.blue.light },
        }}
        label={
          <>
            {isLoading ? '' : 'upload images'}
            <ImageInput onChange={handleImageUpload} />
          </>
        }
        isLoading={isLoading}
        startIcon={<CloudUpload />}
        fullWidth
        component="label"
      />
    </Box>
  );
}
