import { Box } from '@mui/material';
import { FormEvent, ReactNode, useState } from 'react';
import ContainedButton from '@/components/ui/buttons/simple/ContainedButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DeleteForever } from '@mui/icons-material';
import { getEmptyObjectKeys } from '@/utils/checkForms';
import { getObjectKeyCount } from '@/utils/checkForms';
import ProductFormFieldsAdminPanel from '@/components/forms/productFormAdminPanel/ProductFormFieldsAdminPanel';
import { clearProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import OutlinedButton from '@/components/ui/buttons/simple/OutlinedButton';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';

type Props = {
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitButtonLabel: string;
  submitButtonStartIcon?: ReactNode;
};

export default function ProductFormAdminPanel({
  isSubmitting,
  onSubmit,
  submitButtonLabel,
  submitButtonStartIcon,
}: Props) {
  const productFormData = useAppSelector(selectProductFormData);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const dispatch = useAppDispatch();
  const isOnSale = productFormData.isOnSale === 'Yes';
  const emptyFormFields = getEmptyObjectKeys(productFormData);
  const numberOfFormFields = getObjectKeyCount(productFormData);
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
      <ProductFormFieldsAdminPanel
        isSubmitting={isSubmitting}
        isClearingAllFields={isClearingAllFields}
        isOnSale={isOnSale}
      />
      <OutlinedButton
        label={!isClearingAllFields ? 'clear form' : ''}
        onClick={clearAllFormFields}
        disabled={
          uploadInProgress || isSubmitting || isClearingAllFields || emptyFormFields.length === numberOfFormFields
        }
        fullWidth
        component="button"
        isLoading={isClearingAllFields}
        startIcon={<DeleteForever />}
        color="secondary"
      />
      <ContainedButton
        type="submit"
        disabled={
          uploadInProgress ||
          isClearingAllFields ||
          (isOnSale ? emptyFormFields.length > 0 : emptyFormFields.length > 1) ||
          imageData.length === 0
        }
        label={submitButtonLabel}
        fullWidth
        isLoading={isSubmitting}
        startIcon={submitButtonStartIcon}
        color="secondary"
      />
    </Box>
  );
}
