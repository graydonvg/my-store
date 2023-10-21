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
import ProductImageBoxes from '../ProductImageBoxes';

type InputImageUploadProps = InputProps & {
  isLoading: boolean;
};

export default function InputImageUpload({ isLoading, ...inputProps }: InputImageUploadProps) {
  const color = useCustomColorPalette();

  return (
    <>
      <ProductImageBoxes />
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
