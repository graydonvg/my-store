'use client';

import { FormEvent, useEffect } from 'react';
import { UpdateProductDb } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getEmptyFormFields } from '@/utils/checkForms';
import { getNumberOfFormFields } from '@/utils/checkForms';
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

export default function AdminPanelUpdateProductPage() {
  const router = useRouter();
  const productFormData = useAppSelector(selectProductFormData);
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const dispatch = useAppDispatch();
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);

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

  async function updateProductHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(setIsProductFormSubmitting(true));

    const { success, message } = await updateProduct({
      productData: {
        ...productFormData,
        productId: productFormData.productId!,
      } as UpdateProductDb,
      imageData,
    });

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
        onSubmit={updateProductHandler}
        isSubmitting={isSubmitting}
        submitButtonLabel={!isSubmitting ? 'save' : ''}
      />
    </Box>
  );
}
