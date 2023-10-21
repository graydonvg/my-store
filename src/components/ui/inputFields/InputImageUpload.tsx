import { Check, CloudUpload, Edit } from '@mui/icons-material';
import CustomButton from '../buttons/CustomButton';
import { Input, InputProps } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Spinner } from '../Spinner';
import ProductImageBoxes from '../ProductImageBoxes';
import { useState } from 'react';

type InputImageUploadProps = InputProps & {
  isLoading: boolean;
};

export default function InputImageUpload({ isLoading, ...inputProps }: InputImageUploadProps) {
  const { formData } = useAppSelector((state) => state.addNewProductFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const color = useCustomColorPalette();

  function handleToggleEditMode() {
    setIsEditMode((previousMode) => !previousMode);
  }

  return (
    <>
      <ProductImageBoxes isEditMode={isEditMode} />
      <CustomButton
        disabled={formData.imageData.length === 0}
        onClick={() => handleToggleEditMode()}
        fullWidth={true}
        label={isEditMode ? 'save' : 'edit'}
        styles={{
          backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
          '&:hover': {
            backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
            filter: 'brightness(1.2)',
            transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
        }}
        startIcon={isEditMode ? <Check /> : <Edit />}
      />
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
