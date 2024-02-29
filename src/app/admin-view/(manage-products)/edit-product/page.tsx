'use client';

import { FormEvent, useEffect, useState } from 'react';
import { UpdateProductType } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import addProductImageData from '@/services/product-image-data/add';
import updateProduct from '@/services/products/update';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import revalidate from '@/services/revalidate';
import updateProductImageData from '@/services/product-image-data/update';
import ProductForm from '@/components/forms/productForm/ProductForm';
import { Box } from '@mui/material';
import ManageProductImages from '@/components/ManageProductImages';
import { clearProductFormData } from '@/lib/redux/slices/productFormSlice';
import { clearImageData } from '@/lib/redux/slices/productImagesSlice';

export default function AdminViewUpdateProductPage() {
  const router = useRouter();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (
        !isSubmitting &&
        emptyFormFields.length === numberOfFormFields &&
        imageData.length === 0 &&
        imageUploadProgress.length === 0
      )
        return;
      e.preventDefault();
    }

    window.addEventListener('beforeunload', handler);

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [isSubmitting, emptyFormFields, numberOfFormFields, imageData, imageUploadProgress]);

  async function handleAddImageData(productId: string) {
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

  async function handleRevalidate() {
    const data = await revalidate('/');

    if (data.success === true) {
      router.refresh();
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const { success: updateProductSuccess, message: updateProductMessage } = await updateProduct({
      ...productFormData,
      productId: productFormData.productId!,
    } as UpdateProductType);

    if (updateProductSuccess === true) {
      let updateImageDataSuccess = true;
      let updateImageDataMessage = null;
      const imageDataToUpdate = imageData.find((data) => data.productImageId);

      const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
        productFormData.productId!
      );

      if (imageDataToUpdate) {
        const { success, message } = await updateProductImageData(imageData);

        updateImageDataSuccess = success;
        updateImageDataMessage = message;
      }

      if (addImageDataSuccess === true && updateImageDataSuccess === true) {
        await handleRevalidate();
        dispatch(clearProductFormData());
        dispatch(clearImageData());
        toast.success('Successfully updated product.');
        setIsSubmitting(false);
        router.push('/admin-view/all-products');
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

    setIsSubmitting(false);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <ManageProductImages isSubmitting={isSubmitting} />
      <ProductForm
        onSubmit={handleUpdateProduct}
        isSubmitting={isSubmitting}
        submitButtonLabel={!isSubmitting ? 'update product' : ''}
      />
    </Box>
  );
}
