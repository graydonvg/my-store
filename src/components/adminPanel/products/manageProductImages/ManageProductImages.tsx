import { CloudUpload } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import ProductImageBoxes from '../../../product/productImageBoxes/ProductImageBoxes';
import { ChangeEvent } from 'react';
import { Box } from '@mui/material';
import ContainedButton from '../../../ui/buttons/simple/ContainedButton';
import ImageInput from '../../../ui/inputFields/ImageInput';
import { toast } from 'react-toastify';
import { uploadProductImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/utils/generate';
import EditProductImagesDrawer from '../../../drawers/EditProductImagesDrawer';
import {
  clearImageUploadProgess,
  setImageData,
  setImageUploadProgress,
} from '@/lib/redux/features/productImages/productImagesSlice';
import EditProductImagesDrawerButton from './EditProductImagesDrawerButton';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';
import { selectIsProductFormSubmitting } from '@/lib/redux/features/productForm/productFormSelectors';

export default function ManageProductImages() {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);
  const maxImageCount = 5;

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

    const uploadImagelResults = uploadImagePromiseResults.map((result, index) => {
      if (result.status === 'fulfilled') {
        const { fileName, imageUrl } = result.value;

        const imageIndex = imageData.length > 0 ? imageData.length + index : index;

        return { fileName, imageUrl, index: imageIndex };
      } else {
        toast.error(`Image ${index + 1} failed to upload. ${result.reason}`);
        return { fileName: '', imageUrl: '', index };
      }
    });

    dispatch(setImageData(uploadImagelResults));
    dispatch(clearImageUploadProgess());
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <ProductImageBoxes maxImageCount={maxImageCount} />
      <EditProductImagesDrawerButton />
      <EditProductImagesDrawer />
      <ContainedButton
        tabIndex={-1}
        color="primary"
        label={
          <>
            {!uploadInProgress ? 'upload images' : ''}
            <ImageInput onChange={handleImageUpload} />
          </>
        }
        isLoading={uploadInProgress}
        disabled={isSubmitting}
        startIcon={<CloudUpload />}
        fullWidth
        component="label"
      />
    </Box>
  );
}
