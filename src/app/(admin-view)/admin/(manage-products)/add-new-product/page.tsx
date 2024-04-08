'use client';

import { FormEvent, useEffect, useState } from 'react';
import { InsertProductTypeDb } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import addProduct from '@/services/products/add';
import addProductImageData from '@/services/product-image-data/add';
import deleteProduct from '@/services/products/delete';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import revalidate from '@/services/revalidate';
import ProductForm from '@/components/forms/productForm/ProductForm';
import { Add } from '@mui/icons-material';
import ManageProductImages from '@/components/ManageProductImages';
import { Box } from '@mui/material';
import { clearAllProductImagesData } from '@/lib/redux/slices/productImagesSlice';
import { clearProductFormData } from '@/lib/redux/slices/productFormSlice';

export default function AdminViewAddNewProductPage() {
  const router = useRouter();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);

  useEffect(() => {
    if (productFormData.productId) {
      dispatch(clearProductFormData());
      dispatch(clearAllProductImagesData());
    }
  }, [dispatch, productFormData.productId]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (
        !isSubmitting &&
        emptyFormFields.length === numberOfFormFields &&
        imageData.length === 0 &&
        imageUploadProgress.length === 0
      )
        return;
      e.preventDefault();
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
    const data = await revalidate('/');

    if (data.success === true) {
      router.refresh();
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let productId = '';

    const {
      success: addProductSuccess,
      message: addProductMessage,
      data: productData,
    } = await addProduct(productFormData as InsertProductTypeDb);

    if (addProductSuccess === true && productData) {
      productId = productData.productId;

      const { success: addImageDataSuccess, message: addImageDataMessage } = await addImageData(productData.productId);

      if (addImageDataSuccess === true) {
        await revalidateAndRefresh();
        dispatch(clearProductFormData());
        dispatch(clearAllProductImagesData());
        toast.success('Product added');
        setIsSubmitting(false);
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

    setIsSubmitting(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <ManageProductImages isSubmitting={isSubmitting} />
      <ProductForm
        onSubmit={handleAddProduct}
        isSubmitting={isSubmitting}
        submitButtonLabel={!isSubmitting ? 'add product' : ''}
        submitButtonStartIcon={!isSubmitting ? <Add /> : null}
      />
    </Box>
  );
}
