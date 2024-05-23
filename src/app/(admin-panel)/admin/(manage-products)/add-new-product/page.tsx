'use client';

import { FormEvent, useEffect } from 'react';
import { InsertProductDb } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { addProduct, addProductImageData } from '@/services/admin/add';
import { getEmptyFormFields } from '@/utils/checkForms';
import { getNumberOfFormFields } from '@/utils/checkForms';
import revalidateAllData from '@/services/admin/revalidateAllData';
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
import { deleteProduct } from '@/services/admin/delete';

export default function AdminPanelAddNewProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productFormData = useAppSelector(selectProductFormData);
  const isSubmitting = useAppSelector(selectIsProductFormSubmitting);
  const imageUploadProgress = useAppSelector(selectImageUploadProgress);
  const imageData = useAppSelector(selectImageData);
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);

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
    const dataToAdd = imageData.map((data) => {
      const { productImageId, ...restOfData } = data;
      return { ...restOfData, productId };
    });

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

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(setIsProductFormSubmitting(true));

    let productId = '';

    const {
      success: addProductSuccess,
      message: addProductMessage,
      data: productData,
    } = await addProduct(productFormData as InsertProductDb);

    if (addProductSuccess === true && productData) {
      productId = productData.productId;

      const { success: addImageDataSuccess, message: addImageDataMessage } = await addImageData(productData.productId);

      if (addImageDataSuccess === true) {
        await revalidateAndRefresh();
        dispatch(clearProductFormData());
        dispatch(clearAllProductImagesData());
        toast.success('Product added');
        dispatch(setIsProductFormSubmitting(false));
        router.push('/admin/products');
      } else {
        const { success: deleteProductSuccess, message: deleteProductMessage } = await deleteProduct(productId);

        if (deleteProductSuccess === false) {
          toast.error(deleteProductMessage);
        }

        toast.error(addImageDataMessage);
      }
    } else {
      toast.error(addProductMessage);
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
