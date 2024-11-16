import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ChangeEvent } from 'react';
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
import { CONSTANTS } from '@/constants';
import { useLogger } from 'next-axiom';
import EditProductImagesDrawer from './EditProductImagesDrawer';
import ProductImagesAdminPanel from '@/components/product/productImages/ProductImagesAdminPanel';

export default function ManageProductImages() {
  const logger = useLogger();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    if (files.length + imageData.length > CONSTANTS.MAXIMUM_PRODUCT_IMAGES) {
      toast.error(`Maximum of ${CONSTANTS.MAXIMUM_PRODUCT_IMAGES} images allowed.`);
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
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

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
        uploadInProgress={uploadInProgress}
        disabled={isSubmitting || imageData.length === CONSTANTS.MAXIMUM_PRODUCT_IMAGES}
      />
    </Box>
  );
}
