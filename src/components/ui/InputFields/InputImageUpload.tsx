import { useTheme } from '@mui/material/styles';
import { CloudUpload, DeleteForever } from '@mui/icons-material';
import CustomButton from '../Buttons/CustomButton';
import { Box, IconButton, Input, InputProps, Typography } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../CircularProgressWithLabel';
import { deleteImageFromStorage } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFormData } from '@/lib/redux/addNewProductFormData/addNewProductFormDataSlice';
import { toast } from 'react-toastify';

function renderProductImage(index: number, url: string, name: string, iconColor: string, onClick: () => void) {
  return (
    <Box
      key={index}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: '200px',
        width: '133px',
      }}>
      <Image
        style={{ objectFit: 'cover', borderRadius: '4px' }}
        fill
        src={url}
        alt={`image of ${name}`}
        priority
      />
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          color: 'transparent',
          cursor: 'pointer',
          padding: 0,
          borderRadius: '4px',
          backgroundColor: 'transparent',
          '&:hover': {
            color: iconColor,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}>
        <DeleteForever sx={{ fontSize: '56px' }} />
      </IconButton>
    </Box>
  );
}

type InputImageUploadProps = InputProps & {
  isDisabled: boolean;
};

export default function InputImageUpload({ isDisabled, ...inputProps }: InputImageUploadProps) {
  const { formData } = useAppSelector((state) => state.addNewProductFormData);
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelColor = mode === 'dark' ? color.grey.dark : color.grey.light;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const borderColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

  async function handleDeleteImage(fileName: string) {
    const filteredImageData = formData.imageData.filter((data) => data.fileName !== fileName);

    try {
      const result = await deleteImageFromStorage(fileName);
      if (result === 'success') {
        dispatch(setFormData({ field: 'imageData', value: filteredImageData }));
      }
    } catch (error) {
      toast.error(`${error}`);
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
          borderRadius: '4px',
          minHeight: '232px',
          padding: '16px',
        }}>
        {formData.imageData && formData.imageData.length > 0 ? (
          formData.imageData.map((data, index) =>
            typeof data.imageUrl === 'number' ? (
              <Box
                key={index}
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  height: '200px',
                  width: '133px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '4px',
                }}>
                <CircularProgressWithLabel
                  key={index}
                  value={data.imageUrl as number}
                />
              </Box>
            ) : (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  height: '200px',
                  width: '133px',
                }}>
                <Image
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                  fill
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
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      color: color.grey.light,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                  }}>
                  <DeleteForever sx={{ fontSize: '56px' }} />
                </IconButton>
              </Box>
            )
          )
        ) : (
          <Typography sx={{ color: textColor, margin: '0 auto' }}>No file chosen</Typography>
        )}
      </Box>
      <CustomButton
        disabled={isDisabled}
        styles={{
          color: labelColor,
          backgroundColor: color.blue.dark,
          '&:hover': { backgroundColor: color.blue.light },
        }}
        label={
          <>
            Upload images
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
        startIcon={<CloudUpload sx={{ color: labelColor }} />}
        fullWidth={true}
        component="label"
      />
    </>
  );
}
