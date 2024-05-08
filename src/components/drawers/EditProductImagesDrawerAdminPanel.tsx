import DrawerComponent from './DrawerComponent';
import { DeleteForever, Edit } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/ContainedButton';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box, Divider, useTheme } from '@mui/material';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import DrawerHeader from './DrawerHeader';
import { clearImageData, setIsEditImagesDrawerOpen } from '@/lib/redux/slices/productImagesSlice';
import DraggableProductImages from '../draggableProductImages/DraggableProductImages';

type Props = {
  isSubmitting: boolean;
};

export default function EditProductImagesDrawerAdminPanel({ isSubmitting }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress, isDeletingImage, isEditImagesDrawerOpen } = useAppSelector(
    (state) => state.productImages
  );
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  function openEditImageDrawer() {
    dispatch(setIsEditImagesDrawerOpen(true));
  }

  function closeEditImageDrawer() {
    if (isDeletingAllImages || isDeletingImage) return;
    dispatch(setIsEditImagesDrawerOpen(false));
  }

  async function deleteAllImages() {
    setIsDeletingAllImages(true);

    await deleteAllProductImages(imageData, productFormData.productId);

    dispatch(clearImageData());
    setIsDeletingAllImages(false);
    dispatch(setIsEditImagesDrawerOpen(false));
  }

  return (
    <>
      <OutlinedButton
        isDisabled={uploadInProgress || isSubmitting || imageData.length === 0}
        onClick={openEditImageDrawer}
        fullWidth
        label={'edit'}
        startIcon={<Edit />}
      />
      <DrawerComponent
        isOpen={{ right: isEditImagesDrawerOpen }}
        closeDrawer={closeEditImageDrawer}
        drawerProps={{ sx: { zIndex: { xs: theme.zIndex.appBar + 1, sm: theme.zIndex.appBar - 1 } } }}
        paperProps={{
          sx: {
            width: { xs: '100vw', sm: '350px' },
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))',
          },
        }}>
        <DrawerHeader
          label="Edit images"
          onClick={closeEditImageDrawer}
        />
        <DraggableProductImages isDeletingAllImages={isDeletingAllImages} />
        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            padding: 2,
            gap: 2,
          }}>
          <ContainedButton
            onClick={deleteAllImages}
            disabled={isDeletingAllImages}
            isLoading={isDeletingAllImages}
            label={!isDeletingAllImages ? 'Delete all' : ''}
            color="secondary"
            fullWidth
            startIcon={<DeleteForever />}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
