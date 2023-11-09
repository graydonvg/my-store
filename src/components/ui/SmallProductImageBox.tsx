'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DeleteForever } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { deleteImageFromStorage } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { deleteImage, setIsDeletingImage } from '@/lib/redux/addProduct/addProductSlice';
import { Spinner } from './progress/Spinner';
import { CircularProgressWithLabel } from './progress/CircularProgressWithLabel';
import deleteProductImageData from '@/services/product-image-data/delete-product-image-data';

type Props = { imageIndex: number; borderColor: string; isEditMode?: boolean; selectImage: () => void };

export default function SmallProductImageBox({ imageIndex, borderColor, isEditMode, selectImage }: Props) {
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const { imageUploadProgress, imageData, formData, isDeletingImage, productToUpdateId } = useAppSelector(
    (state) => state.addProduct
  );
  const boxBorderColor = isAdminView ? borderColor : imageData[imageIndex] ? borderColor : 'transparent';

  async function handleDeleteImage(file_name: string, product_image_id: string) {
    dispatch(setIsDeletingImage(true));
    selectImage();
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
    <Box
      id="small-product-image-box"
      key={imageIndex}
      onClick={selectImage}
      sx={{
        aspectRatio: 6 / 8,
        border: `1px solid ${boxBorderColor}`,
        borderRadius: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
      }}>
      {imageUploadProgress[imageIndex] || imageData[imageIndex] ? (
        imageData[imageIndex] ? (
          <>
            <Image
              style={{
                objectFit: 'cover',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              fill
              sizes="(min-width: 600px) 78px, (min-width: 440px) 72px, calc(19.17vw - 9px)"
              src={imageData[imageIndex].image_url}
              alt={`Image of ${formData.name}`}
              priority
            />
            {isAdminView && isEditMode ? (
              <>
                <IconButton
                  onClick={() =>
                    handleDeleteImage(imageData[imageIndex].file_name, imageData[imageIndex].product_image_id!)
                  }
                  disabled={isDeletingImage}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    color: color.grey.light,
                    cursor: 'pointer',
                    padding: 0,
                    borderRadius: 1,
                    backgroundColor: color.black.opacity.light,
                    '&:hover': {
                      color: color.grey.light,
                      backgroundColor: color.black.opacity.strong,
                    },
                  }}>
                  {!isDeletingImage ? (
                    <DeleteForever sx={{ fontSize: '26px' }} />
                  ) : (
                    <Spinner
                      providedColor="white"
                      size={26}
                    />
                  )}
                </IconButton>
              </>
            ) : null}
          </>
        ) : (
          <CircularProgressWithLabel value={imageUploadProgress[imageIndex].progress} />
        )
      ) : null}
    </Box>
  );
}
