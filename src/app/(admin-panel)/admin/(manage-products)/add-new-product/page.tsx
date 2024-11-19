'use client';

import { FormEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/services/admin/add';
import { getEmptyObjectKeys } from '@/utils/objectHelpers';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import ProductFormAdminPanel from '@/components/forms/productFormAdminPanel/ProductFormAdminPanel';
import { Add } from '@mui/icons-material';
import ManageProductImages from '@/components/adminPanel/products/manageProductImages/ManageProductImages';
import { Box } from '@mui/material';
import { clearAllProductImagesData } from '@/lib/redux/features/productImages/productImagesSlice';
import { clearProductFormData, setIsProductFormSubmitting } from '@/lib/redux/features/productForm/productFormSlice';
import {
  selectIsProductFormSubmitting,
  selectProductFormData,
} from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData, selectImageUploadProgress } from '@/lib/redux/features/productImages/productImagesSelectors';
import { AddProductSchema } from '@/types';
import { LOGGER_ERROR_MESSAGES } from '@/constants';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { useLogger } from 'next-axiom';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

export default function AdminPanelAddNewProductPage() {
  const log = useLogger();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const productFormData = useAppSelector(selectProductFormData);
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const emptyFormFields = getEmptyObjectKeys(productFormData);
  const numberOfFormFields = getObjectKeyCount(productFormData);

  useEffect(() => {
    if (productFormData.productId) {
      dispatch(clearProductFormData());
      dispatch(clearAllProductImagesData());
    }
  }, [dispatch, productFormData.productId]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (
        !isSubmitting &&
        emptyFormFields.length === numberOfFormFields &&
        imageData.length === 0 &&
        imageUploadProgress.length === 0
      ) {
        return;
      }
      event.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitting, emptyFormFields, numberOfFormFields, imageData, imageUploadProgress]);

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const productData = {
      productData: productFormData,
      imageData,
    };

    const validation = AddProductSchema.safeParse(productData);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, {
        userId: userData?.userId,
        payload: productData,
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    dispatch(setIsProductFormSubmitting(true));

    const { success, message } = await addProduct(validation.data);

    if (success) {
      dispatch(clearProductFormData());
      dispatch(clearAllProductImagesData());
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
        onSubmit={handleAddProduct}
        isSubmitting={isSubmitting}
        submitButtonLabel={!isSubmitting ? 'add product' : ''}
        submitButtonStartIcon={!isSubmitting ? <Add /> : null}
      />
    </Box>
  );
}
