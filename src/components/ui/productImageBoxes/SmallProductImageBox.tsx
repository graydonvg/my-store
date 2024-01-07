'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DeleteForever } from '@mui/icons-material';
import { Box, Grid, IconButton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { deleteImageFromStorage } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { deleteImage, setIsDeletingImage } from '@/lib/redux/productForm/productFormSlice';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete-product-image-data';
import { CircularProgressWithLabel } from '../progress/CircularProgressWithLabel';
import { Spinner } from '../progress/Spinner';
import { ImageUploadProgressType, InsertProductImageDataTypeStore } from '@/types';
import { borderRadius } from '@/constants/styles';

type DeleteButtonProps = {
  show: boolean;
  productImageData?: InsertProductImageDataTypeStore;
};

function DeleteButton({ show, productImageData }: DeleteButtonProps) {
  const dispatch = useAppDispatch();
  const customColorPalette = useCustomColorPalette();
  const { isDeletingImage, productFormData } = useAppSelector((state) => state.productForm);

  if (!show || !productImageData) return null;

  async function handleDeleteImage(fileName: string, productImageId: string) {
    dispatch(setIsDeletingImage(true));
    try {
      if (fileName.length > 0) {
        await deleteImageFromStorage(fileName);
      }
      if (productFormData.productId && productImageId) {
        const { success, message } = await deleteProductImageDataFromDb(productImageId);

        if (success === false) {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error('Error deleting image from storage.');
    } finally {
      dispatch(deleteImage({ fileName }));
      dispatch(setIsDeletingImage(false));
    }
  }

  return (
    <IconButton
      onClick={() => handleDeleteImage(productImageData.fileName, productImageData.productImageId ?? '')}
      disabled={isDeletingImage}
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        color: 'white',
        padding: 0,
        borderRadius: borderRadius,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  );
}

type ProductImageProps = {
  show: boolean;
  isEditMode?: boolean;
  productName?: string;
  productImageData?: InsertProductImageDataTypeStore;
};

function ProductImage({ show, isEditMode, productName, productImageData }: ProductImageProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

  if (!show || !productImageData) return null;

  return (
    <>
      <Image
        style={{
          objectFit: 'cover',
          borderRadius: borderRadius,
          cursor: 'pointer',
        }}
        fill
        sizes="(min-width: 1280px) 91px, (min-width: 900px) calc(6.94vw + 4px), (min-width: 720px) 93px, (min-width: 600px) calc(7vw + 44px), calc(20vw - 10px)"
        src={productImageData.imageUrl}
        alt={`${productName}`}
        priority
      />
      <DeleteButton show={isAdminView && isEditMode!} />
    </>
  );
}

type SmallProductImageBoxProps = {
  productName?: string;
  productImageData?: InsertProductImageDataTypeStore;
  imageIndex?: number;
  selectedImageIndex?: number;
  uploadProgressData?: ImageUploadProgressType;
  borderColor?: string;
  isEditMode?: boolean;
  selectImage?: () => void;
};

export default function SmallProductImageBoxProps({
  productName,
  productImageData,
  imageIndex,
  selectedImageIndex,
  uploadProgressData,
  borderColor,
  isEditMode,
  selectImage,
}: SmallProductImageBoxProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');

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
          borderRadius: borderRadius,
          opacity: productImageData && !isEditMode ? (imageIndex !== selectedImageIndex ? '50%' : null) : null,
        }}>
        <ProductImage
          show={!!productImageData}
          productName={productName}
          productImageData={productImageData}
          isEditMode={isEditMode}
        />
        {!!uploadProgressData && isAdminView ? <CircularProgressWithLabel value={uploadProgressData.progress} /> : null}
      </Box>
    </Grid>
  );
}
