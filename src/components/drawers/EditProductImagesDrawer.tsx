import DrawerComponent from './DrawerComponent';
import { DeleteForever, Edit } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/ContainedButton';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box, useTheme } from '@mui/material';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import DrawerHeader from './DrawerHeader';
import { clearImageData, setIsEditImagesDrawerOpen } from '@/lib/redux/slices/productImagesSlice';
import DraggableProductImages from '../draggableProductImages/DraggableProductImages';

type Props = {
  isSubmitting: boolean;
};

export default function EditProductImagesDrawer({ isSubmitting }: Props) {
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
        width={{ xs: '100vw', sm: '350px' }}
        isOpen={{ right: isEditImagesDrawerOpen }}
        sx={{ zIndex: { xs: theme.zIndex.appBar + 1, sm: theme.zIndex.appBar - 1 } }}
        closeDrawer={closeEditImageDrawer}>
        <DrawerHeader
          label="Edit images"
          onClick={closeEditImageDrawer}
        />
        <DraggableProductImages isDeletingAllImages={isDeletingAllImages} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            padding: 2,
            gap: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              boxShadow: `0 -2px 4px 0 ${theme.palette.custom.boxShadow}`,
              top: 0,
              right: 0,
              left: 0,
              height: '4px',
            },
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
