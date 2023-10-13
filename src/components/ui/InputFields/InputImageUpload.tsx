import { useTheme } from '@mui/material/styles';
import { CloudUpload, HighlightOff } from '@mui/icons-material';
import BlueFormButton from '../Buttons/BlueFormButton';
import { Box, Input, InputProps, Typography } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import Image from 'next/image';
import { CircularProgressWithLabel } from '../CircularProgressWithLabel';
import { AddNewProductFormDataType } from '@/types';
import { deleteImageFromStorage } from '@/lib/firebase';

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
        objectFit="contain"
        fill
        src={url}
        alt={`image of ${name}`}
      />
      <HighlightOff
        onClick={onClick}
        fontSize="large"
        sx={{
          position: 'absolute',
          color: 'transparent',
          cursor: 'pointer',
          '&:hover': {
            color: iconColor,
          },
        }}
      />
    </Box>
  );
}

type InputImageUploadProps = InputProps & {
  formData: AddNewProductFormDataType;
  imageUploadProgress: number[];
  isDisabled: boolean;
};

export default function InputImageUpload({
  formData,
  imageUploadProgress,
  isDisabled,
  ...props
}: InputImageUploadProps) {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelColor = mode === 'dark' ? color.grey.dark : color.grey.light;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const borderColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

  function handleDeleteImageFromStorage(fileName: string) {
    deleteImageFromStorage(fileName);
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
          minHeight: '216px',
          paddingX: '8px',
        }}>
        {imageUploadProgress.length > 0 ? (
          imageUploadProgress.map((progress, index) =>
            progress === 100 && formData.imageData[index] && formData.imageData[index].imageUrl.length > 0 ? (
              renderProductImage(index, formData.imageData[index].imageUrl, formData.name, color.grey.light, () =>
                handleDeleteImageFromStorage(formData.imageData[index].fileName)
              )
            ) : (
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
                  value={progress}
                />
              </Box>
            )
          )
        ) : formData.imageData && formData.imageData.length > 0 ? (
          formData.imageData.map((data, index) =>
            renderProductImage(index, data.imageUrl, formData.name, color.grey.light, () =>
              handleDeleteImageFromStorage(data.fileName)
            )
          )
        ) : (
          <Typography sx={{ color: textColor, margin: '0 auto' }}>No file chosen</Typography>
        )}
      </Box>
      <BlueFormButton
        disabled={isDisabled}
        sx={{ color: labelColor }}
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
              {...props}
            />
          </>
        }
        startIcon={<CloudUpload sx={{ color: labelColor }} />}
        fullWidth={false}
        component="label"
      />
    </>
  );
}
