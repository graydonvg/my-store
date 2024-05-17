import DrawerComponent from '../ui/DrawerComponent';
import { DeleteForever } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/simple/ContainedButton';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteAllProductImages } from '@/utils/deleteProductImages';
import { Box, Divider, useTheme } from '@mui/material';
import DrawerHeader from './DrawerHeader';
import { clearImageData, setIsEditImagesDrawerOpen } from '@/lib/redux/features/productImages/productImagesSlice';
import DraggableProductImages from '../draggableProductImages/DraggableProductImages';

export default function EditProductImagesDrawerAdminPanel() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, isDeletingImage, isEditImagesDrawerOpen } = useAppSelector((state) => state.productImages);

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
  );
}
