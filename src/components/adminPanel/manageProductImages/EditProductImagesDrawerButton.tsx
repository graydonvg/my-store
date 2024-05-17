import OutlinedButton from '@/components/ui/buttons/simple/OutlinedButton';
import { setIsEditImagesDrawerOpen } from '@/lib/redux/features/productImages/productImagesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Edit } from '@mui/icons-material';

export default function EditProductImagesDrawerButton() {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  function openEditImageDrawer() {
    dispatch(setIsEditImagesDrawerOpen(true));
  }

  return (
    <OutlinedButton
      disabled={uploadInProgress || isSubmitting || imageData.length === 0}
      onClick={openEditImageDrawer}
      fullWidth
      label={'edit'}
      startIcon={<Edit />}
    />
  );
}
