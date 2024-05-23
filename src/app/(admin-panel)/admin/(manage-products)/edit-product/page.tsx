'use client';

import { FormEvent, useEffect } from 'react';
import { UpdateProductDb } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import addProductImageData from '@/services/product-image-data/add';
import updateProduct from '@/services/products/update';
import { getEmptyFormFields } from '@/utils/checkForms';
import { getNumberOfFormFields } from '@/utils/checkForms';
import revalidateAllData from '@/services/revalidateAllData';
import updateProductImageData from '@/services/product-image-data/update';
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

  async function addImageData(productId: string) {
    const newData = imageData.filter((data) => !data.productImageId);

    const dataToAdd = newData.map((data) => {
      const { productImageId, ...restOfData } = data;
      return { ...restOfData, productId };
    });

    if (dataToAdd.length === 0) {
      return { success: true, message: 'No new images added' };
    }

    const { success, message } = await addProductImageData(dataToAdd);

    return { success, message };
  }

  async function revalidateAndRefresh() {
    const data = await revalidateAllData();

    if (data.success === true) {
      router.refresh();
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(setIsProductFormSubmitting(true));

    const { success: updateProductSuccess, message: updateProductMessage } = await updateProduct({
      ...productFormData,
      productId: productFormData.productId!,
    } as UpdateProductDb);

    if (updateProductSuccess === true) {
      let updateImageDataSuccess = true;
      let updateImageDataMessage = null;
      const imageDataToUpdate = imageData.find((data) => data.productImageId);

      const { success: addImageDataSuccess, message: addImageDataMessage } = await addImageData(
        productFormData.productId!
      );

      if (imageDataToUpdate) {
        const { success, message } = await updateProductImageData(imageData);

        updateImageDataSuccess = success;
        updateImageDataMessage = message;
      }

      if (addImageDataSuccess === true && updateImageDataSuccess === true) {
        await revalidateAndRefresh();
        dispatch(clearProductFormData());
        dispatch(clearImageData());
        toast.success('Product updated');
        dispatch(setIsProductFormSubmitting(false));
        router.push('/admin/products');
      } else if (addImageDataSuccess === false && updateImageDataSuccess === true) {
        toast.error(addImageDataMessage);
      } else if (updateImageDataSuccess === false && addImageDataSuccess === true) {
        toast.error(updateImageDataMessage);
      } else {
        toast.error(addImageDataMessage);
        toast.error(updateImageDataMessage);
      }
    } else {
      toast.error(updateProductMessage);
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
