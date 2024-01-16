'use client';

import { CloudUpload } from '@mui/icons-material';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { ChangeEvent, useEffect } from 'react';
import {
  resetImageUploadProgess,
  setImageData,
  setImageUploadProgress,
} from '@/lib/redux/productForm/productFormSlice';
import { Box } from '@mui/material';
import ContainedButton from './ui/buttons/ContainedButton';
import ImageInput from './ui/inputFields/ImageInput';
import { toast } from 'react-toastify';
import { uploadImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/utils/generateUniqueFileName';
import EditProductImagesDrawer from './drawers/EditProductImagesDrawer';

type Props = {
  isSubmitting: boolean;
};

export default function ManageProductImages({ isSubmitting }: Props) {
  const dispatch = useAppDispatch();
  const { imageUploadProgress, imageData } = useAppSelector((state) => state.productForm);
  const colorPalette = useColorPalette();
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

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

        dispatch(setImageUploadProgress({ fileName: image.uniqueFileName, progress }));

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

    const uploadPromiseResults = imageDataArray.map((result, index) => {
      if (result.status === 'fulfilled') {
        const { fileName, imageUrl } = result.value;
        return { fileName, imageUrl };
      } else {
        toast.error(`Image ${index + 1} failed to upload. ${result.reason}`);
        return { fileName: '', imageUrl: '' };
      }
    });

    dispatch(setImageData(uploadPromiseResults));
    dispatch(resetImageUploadProgess());
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <ProductImageBoxes />
      <EditProductImagesDrawer isSubmitting={isSubmitting} />
      <ContainedButton
        backgroundColor="blue"
        isDisabled={uploadInProgress || isSubmitting}
        styles={{
          '&:hover': { backgroundColor: colorPalette.primary.light },
        }}
        label={
          <>
            {uploadInProgress ? '' : 'upload images'}
            <ImageInput onChange={handleImageUpload} />
          </>
        }
        isLoading={uploadInProgress}
        startIcon={<CloudUpload />}
        fullWidth
        component="label"
      />
    </Box>
  );
}
