import { useTheme } from '@mui/material/styles';
import { CloudUpload, DeleteForever } from '@mui/icons-material';
import CustomButton from '../buttons/CustomButton';
import { Box, IconButton, Input, InputProps, Typography } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../CircularProgressWithLabel';
import { deleteImageFromStorage } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteImage } from '@/lib/redux/addNewProductFormData/addNewProductFormDataSlice';
import { toast } from 'react-toastify';
import { Spinner } from '../Spinner';
import { StorageError, StorageErrorCode } from 'firebase/storage';

type InputImageUploadProps = InputProps & {
  isLoading: boolean;
};

export default function InputImageUpload({ isLoading, ...inputProps }: InputImageUploadProps) {
  const { formData } = useAppSelector((state) => state.addNewProductFormData);
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelColor = mode === 'dark' ? color.grey.dark : color.grey.light;
  const textColor = mode === 'dark' ? color.white.opacity.strong : color.black.opacity.strong;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;

  async function handleDeleteImage(fileName: string) {
    try {
      await deleteImageFromStorage(fileName);
    } catch (error) {
      toast.error('Error deleting image from storage.');
    } finally {
      dispatch(deleteImage({ fileName }));
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          border: `1px solid ${borderColor}`,
          borderRadius: 1,
          minHeight: '232px',
          padding: 2,
        }}>
        {formData.imageData && formData.imageData.length > 0 ? (
          formData.imageData.map((data, index) => {
            return 'uploadProgress' in data ? (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  height: '208px',
                  aspectRatio: 1 / 1,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 1,
                }}>
                <CircularProgressWithLabel value={data.uploadProgress} />
              </Box>
            ) : (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '208px',
                  aspectRatio: 1 / 1,
                }}>
                <Image
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                  fill
                  sizes="208px"
                  src={data.imageUrl as string}
                  alt={`Image of ${formData.name}`}
                  priority
                />
                <IconButton
                  onClick={() => handleDeleteImage(data.fileName)}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    color: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                    borderRadius: 1,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      color: color.grey.light,
                      backgroundColor: color.black.opacity.strong,
                    },
                  }}>
                  <DeleteForever sx={{ fontSize: '56px' }} />
                </IconButton>
              </Box>
            );
          })
        ) : (
          <Typography sx={{ color: textColor, margin: '0 auto' }}>No file chosen</Typography>
        )}
      </Box>
      <CustomButton
        disabled={isLoading}
        styles={{
          backgroundColor: color.blue.dark,
          '&:hover': { backgroundColor: color.blue.light },
        }}
        label={
          <>
            {isLoading ? 'uploading...' : 'upload images'}
            <Input
              inputProps={{ accept: 'image/*', multiple: true }}
              type="file"
              sx={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              {...inputProps}
            />
          </>
        }
        startIcon={isLoading ? <Spinner size={20} /> : <CloudUpload />}
        fullWidth={true}
        component="label"
      />
    </>
  );
}
