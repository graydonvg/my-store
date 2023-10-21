import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DeleteForever, ZoomOutMap } from '@mui/icons-material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CircularProgressWithLabel } from './CircularProgressWithLabel';
import { AddNewProductFormDataType } from '@/types';
import { GetDesignTokensType } from '../theme/ThemeRegistry';
import { deleteImageFromStorage } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { deleteImage } from '@/lib/redux/addNewProductFormData/addNewProductFormDataSlice';
import { useState } from 'react';

type ProductImageBoxesProps = {};

function renderSmallImageBox(
  color: CustomColorPaletteReturnType,
  borderColor: string,
  formData: AddNewProductFormDataType,
  imageIndex: number,
  isAdminView: boolean,
  isEditMode: boolean,
  selectImage: () => void,
  deleteImage: () => void
) {
  return (
    <Box
      key={imageIndex}
      onClick={selectImage}
      sx={{
        flexGrow: 1,
        aspectRatio: 1 / 1,
        border: `1px solid ${borderColor}`,
        borderRadius: 1,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        '&:hover': {
          cursor: 'pointer',
        },
      }}>
      {formData.imageData[imageIndex] ? (
        'uploadProgress' in formData.imageData[imageIndex] ? (
          <CircularProgressWithLabel value={formData.imageData[imageIndex].uploadProgress} />
        ) : (
          <>
            <Image
              style={{ objectFit: 'cover', borderRadius: '4px' }}
              fill
              sizes="(min-width: 600px) 78px, (min-width: 440px) 72px, calc(19.17vw - 9px)"
              src={formData.imageData[imageIndex].imageUrl}
              alt={`Image of ${formData.name}`}
              priority
            />
            {isAdminView && isEditMode ? (
              <>
                <IconButton
                  onClick={deleteImage}
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
                  <DeleteForever sx={{ fontSize: '26px' }} />
                </IconButton>
              </>
            ) : null}
          </>
        )
      ) : null}
    </Box>
  );
}

export default function ProductImageBoxes({ isEditMode }: { isEditMode: boolean }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.addNewProductFormData);
  const pathname = usePathname();
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.white.opacity.strong : color.black.opacity.strong;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;

  const isAdminView = pathname.includes('admin-view');

  async function handleDeleteImage(fileName: string) {
    try {
      await deleteImageFromStorage(fileName);
    } catch (error) {
      toast.error('Error deleting image from storage.');
    } finally {
      dispatch(deleteImage({ fileName }));
    }
  }

  function handleSelectedImage(index: number) {
    setSelectedImageIndex(index);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          maxHeight: { xs: 'unset', sm: '400px' },
          maxWidth: { xs: '400px', sm: 'unset' },
          width: 1,
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: '400px',
            aspectRatio: 1 / 1,
            border: `1px solid ${borderColor}`,
            position: 'relative',
            borderRadius: 1,
            order: { xs: 1, sm: 2 },
            display: 'grid',
            placeItems: 'center',
          }}>
          {formData.imageData[selectedImageIndex] ? (
            'uploadProgress' in formData.imageData[selectedImageIndex] ? (
              <CircularProgressWithLabel value={formData.imageData[selectedImageIndex].uploadProgress} />
            ) : (
              <>
                <Image
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                  fill
                  sizes="(min-width: 460px) 398px, calc(82.86vw + 33px)"
                  src={formData.imageData[selectedImageIndex].imageUrl}
                  alt={`Image of ${formData.name}`}
                  priority
                />
              </>
            )
          ) : (
            <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ color: textColor }}>No file chosen</Typography>
              <Typography
                variant="body2"
                sx={{ color: textColor }}>
                {'(Max. 6 images)'}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            maxWidth: { xs: 'unset', sm: '80px' },
            maxHeight: { xs: '80px', sm: 'unset' },
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: 1,
            flexGrow: 1,
            order: { xs: 2, sm: 1 },
          }}>
          {Array.from(Array(5)).map((_, index) =>
            renderSmallImageBox(
              color,
              borderColor,
              formData,
              index,
              isAdminView,
              isEditMode,
              () => handleSelectedImage(index),
              () => handleDeleteImage(formData.imageData[index].fileName)
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}
