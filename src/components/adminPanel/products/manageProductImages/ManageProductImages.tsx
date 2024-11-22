import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ChangeEvent } from 'react';
import { Box } from '@mui/material';
import UploadImageButton from './UploadImageButton';
import { toast } from 'react-toastify';
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
import { LOGGER_ERROR_MESSAGES, MAXIMUM_PRODUCT_IMAGES } from '@/constants';
import { uploadFileResumable } from '@/utils/uploadFileResumable';
import { DetailedError } from 'tus-js-client';
import { UploadResult } from '@/types';

export default function ManageProductImages() {
  const logger = useLogger();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  // const [checkingAuthorization, setCheckingAuthorization] = useState(false);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);
  // const isLoading = checkingAuthorization || uploadInProgress;

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    // setCheckingAuthorization(true);
    // const isAuthorized = await checkAuthorizationClient('productImages.insert');
    // setCheckingAuthorization(false);

    // if (!isAuthorized) return;

    const files = event.target.files;

    if (!files) return;

    if (files.length + imageData.length > MAXIMUM_PRODUCT_IMAGES) {
      toast.error(`Maximum of ${MAXIMUM_PRODUCT_IMAGES} images allowed.`);
      return;
    }

    try {
      const uploadImagePromises = Array.from(files).map((file) => {
        const uniqueFileName = generateUniqueFileName(file.name);

        return uploadFileResumable('product-images', uniqueFileName, file, (uploadedBytes, totalBytes) => {
          const progress = (uploadedBytes / totalBytes) * 100;

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
      }
    } catch (error) {
      logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

      toast.error('An unexpected error occurred during the image upload.');
    } finally {
      dispatch(clearImageUploadProgess());
    }
  }

  function processUploadResults(results: PromiseSettledResult<UploadResult>[]) {
    const successfulUploads: { fileName: string; imageUrl: string; imageIndex: number }[] = [];
    const failedUploads: { fileName: string; error: string }[] = [];

    let imageIndex = imageData.length;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const value = result.value;

        if ('imageUrl' in value) {
          const { fileName, imageUrl } = value;

          successfulUploads.push({ fileName, imageUrl: imageUrl || '', imageIndex: imageIndex++ });
        }
      } else {
        const reason = result.reason;

        const fileName = reason.fileName || `Image ${index + 1}`;
        let error = reason.error;

        if (reason.error instanceof DetailedError && reason.error.originalResponse) {
          try {
            const errorData = JSON.parse(reason.error.originalResponse.getBody() as string);
            error = errorData.message;
          } catch (error) {
            error = 'Failed to parse error.';
          }
        }

        if (reason.error instanceof Error) {
          error = reason.error.message;
        }

        failedUploads.push({ fileName, error });
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
        isLoading={uploadInProgress}
        disabled={isSubmitting || imageData.length === MAXIMUM_PRODUCT_IMAGES}
      />
    </Box>
  );
}
