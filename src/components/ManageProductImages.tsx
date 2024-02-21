'use client';

import { CloudUpload } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import ProductImageBoxes from './ui/productImageBoxes/ProductImageBoxes';
import { ChangeEvent } from 'react';
import { resetImageUploadProgess, setImageData, setImageUploadProgress } from '@/lib/redux/slices/productFormSlice';
import { Box } from '@mui/material';
import ContainedButton from './ui/buttons/ContainedButton';
import ImageInput from './ui/inputFields/ImageInput';
import { toast } from 'react-toastify';
import { uploadProductImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/utils/generateUniqueFileName';
import EditProductImagesDrawer from './drawers/EditProductImagesDrawer';

type Props = {
  isSubmitting: boolean;
};

export default function ManageProductImages({ isSubmitting }: Props) {
  const maxImageCount = 5;
  const dispatch = useAppDispatch();
  const { imageUploadProgress, imageData } = useAppSelector((state) => state.productForm);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    if (files.length + imageData.length > maxImageCount) return toast.error(`Max. ${maxImageCount} images allowed`);

    const imagesToUpload = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = generateUniqueFileName(file.name);

      imagesToUpload.push({ file, uniqueFileName });
    }

    const uploadPromises = imagesToUpload.map((image) =>
      uploadProductImageToStorage(image.file, image.uniqueFileName, (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        dispatch(setImageUploadProgress({ fileName: image.uniqueFileName, progress }));
      })
    );

    const imageDataArray = await Promise.allSettled(uploadPromises);

    const uploadPromiseResults = imageDataArray.map((result, index) => {
      if (result.status === 'fulfilled') {
        const { fileName, imageUrl } = result.value;

        const imageIndex = imageData.length > 0 ? imageData.length + index : index;

        return { fileName, imageUrl, index: imageIndex };
      } else {
        toast.error(`Image ${index + 1} failed to upload. ${result.reason}`);
        return { fileName: '', imageUrl: '', index };
      }
    });

    dispatch(setImageData(uploadPromiseResults));
    dispatch(resetImageUploadProgess());
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <ProductImageBoxes maxImageCount={maxImageCount} />
      <EditProductImagesDrawer isSubmitting={isSubmitting} />
      <ContainedButton
        backgroundColor="primary"
        disabled={uploadInProgress || isSubmitting}
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
