import { DeleteForever } from '@mui/icons-material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, useTheme } from '@mui/material';
import { clearImageData, setIsEditImagesDrawerOpen } from '@/lib/redux/features/productImages/productImagesSlice';
import {
  selectImageData,
  selectIsDeletingImage,
  selectIsEditImagesDrawerOpen,
} from '@/lib/redux/features/productImages/productImagesSelectors';
import DrawerComponent from '@/components/ui/DrawerComponent';
import DrawerHeader from '@/components/drawers/DrawerHeader';
import DraggableProductImages from './draggableProductImages/DraggableProductImages';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { deleteProductImages } from '@/services/admin/delete';
import { toast } from 'react-toastify';

export default function EditProductImagesDrawer() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const isEditImagesDrawerOpen = useAppSelector(selectIsEditImagesDrawerOpen);
  const imageData = useAppSelector(selectImageData);
  const isDeletingImage = useAppSelector(selectIsDeletingImage);

  function closeEditImageDrawer() {
    if (isDeletingAllImages || isDeletingImage) return;
    dispatch(setIsEditImagesDrawerOpen(false));
  }

  async function deleteAllImages() {
    setIsDeletingAllImages(true);

    const imagesToDeleteData = imageData.map((item) => ({
      productImageId: item.productImageId,
      fileName: item.fileName,
    }));

    const { success, message } = await deleteProductImages(imagesToDeleteData);

    if (success) {
      toast.success(message);
      dispatch(setIsEditImagesDrawerOpen(false));
      dispatch(clearImageData());
    } else {
      toast.error(message);
    }

    setIsDeletingAllImages(false);
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
