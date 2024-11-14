import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import ProductImageBoxes from '../../../product/productImageBoxes/ProductImageBoxes';
import { ChangeEvent } from 'react';
import { Box } from '@mui/material';
import UploadImageButton from './UploadImageButton';
import { toast } from 'react-toastify';
import { uploadProductImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/utils/fileUtils';
import EditProductImagesDrawer from '../../../drawers/EditProductImagesDrawer';
import {
  clearImageUploadProgess,
  setImageData,
  setImageUploadProgress,
} from '@/lib/redux/features/productImages/productImagesSlice';
import EditProductImagesDrawerButton from './EditProductImagesDrawerButton';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';
import { selectIsProductFormSubmitting } from '@/lib/redux/features/productForm/productFormSelectors';
import { CONSTANTS } from '@/constants';

export default function ManageProductImages() {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);
  const maxImageCount = CONSTANTS.MAXIMUM_PRODUCT_IMAGES;

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    if (files.length + imageData.length > maxImageCount) {
      toast.error(`Max. ${maxImageCount} images allowed`);
      return;
    }

    const imagesToUpload = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = generateUniqueFileName(file.name);

      imagesToUpload.push({ file, uniqueFileName });
    }

    const uploadImagePromises = imagesToUpload.map((image) =>
      uploadProductImageToStorage(image.file, image.uniqueFileName, (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        dispatch(setImageUploadProgress({ fileName: image.uniqueFileName, progress }));
      })
    );

    const uploadImagePromiseResults = await Promise.allSettled(uploadImagePromises);

    let imageIndex = imageData.length;

    const uploadImagelResults = uploadImagePromiseResults.map((result, index) => {
      if (result.status === 'fulfilled') {
        const { fileName, imageUrl } = result.value;

        const newImageIndex = imageIndex;
        imageIndex++;

        return { fileName, imageUrl, imageIndex: newImageIndex };
      } else {
        const { error, fileName } = result.reason;
        toast.error(`Image ${fileName} failed to upload. ${error}`);
        return { fileName: '', imageUrl: '', imageIndex: index };
      }
    });

    const successfullyUploadedImages = uploadImagelResults.filter((image) => image.imageUrl.length > 0);

    dispatch(setImageData(successfullyUploadedImages));
    dispatch(clearImageUploadProgess());
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <ProductImageBoxes />
      <EditProductImagesDrawerButton />
      <EditProductImagesDrawer />
      <UploadImageButton
        onChange={handleImageUpload}
        uploadInProgress={uploadInProgress}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
