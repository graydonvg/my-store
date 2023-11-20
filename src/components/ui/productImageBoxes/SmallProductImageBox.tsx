'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DeleteForever } from '@mui/icons-material';
import { Box, Grid, IconButton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { deleteImageFromStorage } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { deleteImage, setIsDeletingImage } from '@/lib/redux/addProduct/addProductSlice';
import deleteProductImageData from '@/services/product-image-data/delete-product-image-data';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { Spinner } from '../progress/Spinner';
import { ImageUploadProgressType, ProductImageDataStoreType } from '@/types';

type Props = {
  productName?: string;
  productImageData?: ProductImageDataStoreType;
  imageIndex?: number;
  selectedImageIndex?: number;
  uploadProgressData?: ImageUploadProgressType;
  borderColor?: string;
  isEditMode?: boolean;
  selectImage?: () => void;
};

export default function SmallProductImageBox({
  productName,
  productImageData,
  imageIndex,
  selectedImageIndex,
  uploadProgressData,
  borderColor,
  isEditMode,
  selectImage,
}: Props) {
  const dispatch = useAppDispatch();
  const customColorPalette = useCustomColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const { isDeletingImage, productToUpdateId } = useAppSelector((state) => state.addProduct);

  async function handleDeleteImage(file_name: string, product_image_id: string) {
    dispatch(setIsDeletingImage(true));
    try {
      if (file_name.length > 0) {
        await deleteImageFromStorage(file_name);
      }
      if (productToUpdateId && product_image_id) {
        const { success, message } = await deleteProductImageData(product_image_id);

        if (success === false) {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error('Error deleting image from storage.');
    } finally {
      dispatch(deleteImage({ file_name }));
      dispatch(setIsDeletingImage(false));
    }
  }

  return (
    <Grid
      item
      xs={2.4}
      sm={12}>
      <Box
        onClick={selectImage}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: 3 / 4,
          outline: `1px solid ${borderColor}`,
          borderRadius: 1,
          opacity: productImageData && !isEditMode ? (imageIndex !== selectedImageIndex ? '50%' : null) : null,
        }}>
        {productImageData ? (
          <>
            <Image
              style={{
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              fill
              sizes="(min-width: 1260px) 86px, (min-width: 600px) calc(7.81vw - 11px), calc(20vw - 9px), (min-width: 1280px) 470px, (min-width: 600px) 37.88vw, 100vw"
              src={productImageData.image_url}
              alt={`Image of ${productName}`}
              priority
            />
            {isAdminView && isEditMode ? (
              <>
                <IconButton
                  onClick={() => handleDeleteImage(productImageData.file_name, productImageData.product_image_id ?? '')}
                  disabled={isDeletingImage}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    color: 'white',
                    padding: 0,
                    borderRadius: 1,
                    backgroundColor: customColorPalette.black.opacity.medium,
                    '&:hover': {
                      backgroundColor: 'unset',
                    },
                  }}>
                  {!isDeletingImage ? (
                    <DeleteForever sx={{ fontSize: '26px' }} />
                  ) : (
                    <Spinner
                      spinnerColor="white"
                      size={26}
                    />
                  )}
                </IconButton>
              </>
            ) : null}
          </>
        ) : null}
        {uploadProgressData && isAdminView ? <CircularProgressWithLabel value={uploadProgressData.progress} /> : null}
      </Box>
    </Grid>
  );
}
