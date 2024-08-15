'use client';

import { FormEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getEmptyObjectKeys } from '@/utils/checkObject';
import { getObjectKeyCount } from '@/utils/checkObject';
import ProductFormAdminPanel from '@/components/forms/productFormAdminPanel/ProductFormAdminPanel';
import { Box } from '@mui/material';
import ManageProductImages from '@/components/adminPanel/products/manageProductImages/ManageProductImages';
import { clearProductFormData, setIsProductFormSubmitting } from '@/lib/redux/features/productForm/productFormSlice';
import { clearImageData } from '@/lib/redux/features/productImages/productImagesSlice';
import {
  selectIsProductFormSubmitting,
  selectProductFormData,
} from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';
import { updateProduct } from '@/services/admin/update';
import { UpdateProductSchema } from '@/types';
import { constructZodErrorMessage } from '@/utils/construct';
import { useLogger } from 'next-axiom';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { CONSTANTS } from '@/constants';

export default function AdminPanelEditProductPage() {
  const log = useLogger();
  const router = useRouter();
  const productFormData = useAppSelector(selectProductFormData);
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const dispatch = useAppDispatch();
  const emptyFormFields = getEmptyObjectKeys(productFormData);
  const numberOfFormFields = getObjectKeyCount(productFormData);
  const userData = useAppSelector(selectUserData);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (
        !isSubmitting &&
        emptyFormFields.length === numberOfFormFields &&
        imageData.length === 0 &&
        imageUploadProgress.length === 0
      )
        return;
      event.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitting, emptyFormFields, numberOfFormFields, imageData, imageUploadProgress]);

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const productData = {
      productData: {
        ...productFormData,
        productId: productFormData.productId!,
      },
      imageData,
    };

    const validation = UpdateProductSchema.safeParse(productData);

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
        userId: userData?.userId,
        payload: productData,
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    dispatch(setIsProductFormSubmitting(true));

    const { success, message } = await updateProduct(validation.data);

    if (success) {
      dispatch(clearProductFormData());
      dispatch(clearImageData());
      dispatch(setIsProductFormSubmitting(false));
      toast.success(message);
      router.push('/admin/products');
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsProductFormSubmitting(false));
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, padding: { xs: 2, md: 3 } }}>
      <ManageProductImages />
      <ProductFormAdminPanel
        onSubmit={handleUpdateProduct}
        isSubmitting={isSubmitting}
        submitButtonLabel={!isSubmitting ? 'save' : ''}
      />
    </Box>
  );
}
