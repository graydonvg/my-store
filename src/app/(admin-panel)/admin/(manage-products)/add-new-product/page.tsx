'use client';

import { FormEvent, useEffect } from 'react';
import { InsertProductDb } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import addProduct from '@/services/products/add';
import addProductImageData from '@/services/product-image-data/add';
import deleteProduct from '@/services/products/delete';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import revalidateAllData from '@/services/revalidateAllData';
import ProductFormAdminPanel from '@/components/forms/productFormAdminPanel/ProductFormAdminPanel';
import { Add } from '@mui/icons-material';
import ManageProductImagesAdminPanel from '@/components/adminPanel/manageProductImages/ManageProductImagesAdminPanel';
import { Box } from '@mui/material';
import { clearAllProductImagesData } from '@/lib/redux/features/productImages/productImagesSlice';
import { clearProductFormData, setIsSubmitting } from '@/lib/redux/features/productForm/productFormSlice';

export default function AdminPanelAddNewProductPage() {
  const router = useRouter();
  const { productFormData, isSubmitting } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);
  const dispatch = useAppDispatch();
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
    dispatch(setIsSubmitting(true));

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
        dispatch(setIsSubmitting(false));
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

    dispatch(setIsSubmitting(false));
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, padding: { xs: 2, md: 3 } }}>
      <ManageProductImagesAdminPanel />
      <ProductFormAdminPanel
        onSubmit={handleAddProduct}
        isSubmitting={isSubmitting}
        submitButtonLabel={!isSubmitting ? 'add product' : ''}
        submitButtonStartIcon={!isSubmitting ? <Add /> : null}
      />
    </Box>
  );
}
