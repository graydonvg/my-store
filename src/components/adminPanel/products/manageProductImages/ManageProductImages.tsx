import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ChangeEvent, useState } from 'react';
import { Box } from '@mui/material';
import UploadImageButton from './UploadImageButton';
import { toast } from 'react-toastify';
import { uploadProductImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/utils/fileUtils';
import {
  clearImageUploadProgess,
  setImageData,
  setImageUploadProgress,
} from '@/lib/redux/features/productImages/productImagesSlice';
import EditProductImagesDrawerButton from './EditProductImagesDrawerButton';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';
import { selectIsProductFormSubmitting } from '@/lib/redux/features/productForm/productFormSelectors';

import { useLogger } from 'next-axiom';
import EditProductImagesDrawer from './EditProductImagesDrawer';
import ProductImagesAdminPanel from '@/components/product/productImages/ProductImagesAdminPanel';
import checkAuthorizationClient from '@/utils/checkAuthorizationClient';
import { LOGGER_ERROR_MESSAGES, MAXIMUM_PRODUCT_IMAGES } from '@/constants';

export default function ManageProductImages() {
  const logger = useLogger();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const [checkingAuthorization, setCheckingAuthorization] = useState(false);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);
  const isLoading = checkingAuthorization || uploadInProgress;

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    setCheckingAuthorization(true);
    const isAuthorized = await checkAuthorizationClient('productImageData.insert');
    setCheckingAuthorization(false);

    if (!isAuthorized) return;

    const files = event.target.files;

    if (!files) return;

    if (files.length + imageData.length > MAXIMUM_PRODUCT_IMAGES) {
      toast.error(`Maximum of ${MAXIMUM_PRODUCT_IMAGES} images allowed.`);
      return;
    }

    try {
      const uploadImagePromises = Array.from(files).map((file) => {
        const uniqueFileName = generateUniqueFileName(file.name);

        return uploadProductImageToStorage(file, uniqueFileName, (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          dispatch(
            setImageUploadProgress({
              fileName: uniqueFileName,
              progress,
            })
          );
        });
      });

      const results = await Promise.allSettled(uploadImagePromises);

      const { successfulUploads, failedUploads } = processUploadResults(results);

      if (failedUploads.length > 0) {
        failedUploads.forEach(({ fileName, error }) => toast.error(`Failed to upload ${fileName}: ${error}`));
      }

      if (successfulUploads.length > 0) {
        dispatch(setImageData(successfulUploads));

        const numberOfSuccessfulUploads =
          successfulUploads.length === uploadImagePromises.length ? 'All' : successfulUploads.length;

        toast.success(`${numberOfSuccessfulUploads} images uploaded successfully.`);
      }
    } catch (error) {
      logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

      toast.error('An unexpected error occurred during the image upload.');
    } finally {
      dispatch(clearImageUploadProgess());
    }
  }

  function processUploadResults(results: PromiseSettledResult<{ fileName: string; imageUrl: string }>[]) {
    const successfulUploads: { fileName: string; imageUrl: string; imageIndex: number }[] = [];
    const failedUploads: { fileName: string; error: string }[] = [];

    let imageIndex = imageData.length;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { fileName, imageUrl } = result.value;
        successfulUploads.push({ fileName, imageUrl, imageIndex: imageIndex++ });
      } else {
        const { fileName, error } = result.reason;
        failedUploads.push({ fileName: fileName || `Image ${index + 1}`, error: error.message || 'Unknown error' });
      }
    });

    return { successfulUploads, failedUploads };
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <ProductImagesAdminPanel />
      <EditProductImagesDrawerButton />
      <EditProductImagesDrawer />
      <UploadImageButton
        onChange={handleImageUpload}
        isLoading={isLoading}
        disabled={isSubmitting || imageData.length === MAXIMUM_PRODUCT_IMAGES}
      />
    </Box>
  );
}
