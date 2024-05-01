import { Box } from '@mui/material';
import { FormEvent, ReactNode, useState } from 'react';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DeleteForever } from '@mui/icons-material';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import ProductFormFields from '@/components/forms/productForm/ProductFormFields';
import { clearProductFormData } from '@/lib/redux/slices/productFormSlice';

type Props = {
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitButtonLabel: string;
  submitButtonStartIcon?: ReactNode;
};

export default function ProductForm({ isSubmitting, onSubmit, submitButtonLabel, submitButtonStartIcon }: Props) {
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const dispatch = useAppDispatch();
  const isOnSale = productFormData.isOnSale === 'Yes';
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  function clearAllFormFields() {
    setIsClearingAllFields(true);
    dispatch(clearProductFormData());
    setIsClearingAllFields(false);
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <ProductFormFields
        isSubmitting={isSubmitting}
        isClearingAllFields={isClearingAllFields}
        isOnSale={isOnSale}
      />
      <ContainedButton
        label={!isClearingAllFields ? 'clear all' : ''}
        onClick={clearAllFormFields}
        disabled={
          uploadInProgress || isSubmitting || isClearingAllFields || emptyFormFields.length === numberOfFormFields
        }
        fullWidth
        component="button"
        isLoading={isClearingAllFields}
        startIcon={<DeleteForever />}
        color="error"
      />
      <ContainedButton
        type="submit"
        disabled={
          uploadInProgress ||
          isSubmitting ||
          isClearingAllFields ||
          (isOnSale ? emptyFormFields.length > 0 : emptyFormFields.length > 1) ||
          imageData.length === 0
        }
        label={submitButtonLabel}
        fullWidth
        isLoading={isSubmitting}
        startIcon={submitButtonStartIcon}
        color="primary"
      />
    </Box>
  );
}
