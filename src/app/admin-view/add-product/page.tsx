'use client';

import { Box, Grid, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { InsertProductTypeDb, InsertProductTypeStore, UpdateProductType } from '@/types';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  resetProductFormData,
  resetImageData,
  setProductFormDataOnChange,
} from '@/lib/redux/productForm/productFormSlice';
import { toast } from 'react-toastify';
import { Add, DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import addProduct from '@/services/products/add';
import addProductImageData from '@/services/product-image-data/add';
import deleteProduct from '@/services/products/delete';
import updateProduct from '@/services/products/update';
import ManageProductImages from '@/components/ManageProductImages';
import NumberField from '@/components/ui/inputFields/NumberField';
import { orderedSizesForToggleButtons } from '@/constants/sizes';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import revalidate from '@/services/revalidate';

const formFields = [
  { label: 'Category', name: 'category', type: 'select', options: ['Men', 'Women', 'kids'] },
  { label: 'Name', name: 'name' },
  { label: 'Brand', name: 'brand' },
  { label: 'Product Details', name: 'details', multiline: true, placeholder: 'e.g. Black, Regular fit, ...' },
  { label: 'Delivery info', name: 'deliveryInfo', multiline: true },
  { label: 'Return info', name: 'returnInfo', multiline: true },
  { label: 'Price', name: 'price', placeholder: 'e.g. 199' },
  { label: 'On sale', name: 'isOnSale', type: 'select', options: ['No', 'Yes'] },
  { label: 'Sale %', name: 'salePercentage', placeholder: 'e.g. 20' },
];

export default function AdminViewAddNewProduct() {
  const router = useRouter();
  const { productFormData, imageData, imageUploadProgress, isEditMode } = useAppSelector((state) => state.productForm);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const colorPalette = useColorPalette();
  const isOnSale = productFormData.isOnSale === 'Yes';
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setProductFormDataOnChange({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setProductFormDataOnChange({ field: name as keyof InsertProductTypeStore, value }));
  }

  async function handleClearAllFormFields() {
    setIsClearingAllFields(true);
    dispatch(resetProductFormData());
    setIsClearingAllFields(false);
  }

  async function handleAddImageData(productId: string) {
    try {
      const newData = imageData.filter((data) => !data.productImageId);
      const dataToInsert = newData.map((data) => {
        const { productImageId, ...restOfData } = data;
        return { ...restOfData, productId };
      });

      if (dataToInsert.length === 0) {
        return { success: true, message: 'No new images added' };
      }

      const { success, message } = await addProductImageData(dataToInsert);

      return { success, message };
    } catch (error) {
      throw error;
    }
  }

  async function handleRevalidate() {
    const data = await revalidate('/');

    if (data.success === true) {
      toast.success(data.message);
      router.refresh();
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

      const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
        productData.productId
      );

      if (addImageDataSuccess === true) {
        await handleRevalidate();
        dispatch(resetProductFormData());
        dispatch(resetImageData());
        toast.success('Successfully added product.');
        router.push('/admin-view/all-products');
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

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const { success: updateProductSuccess, message: updateProductMessage } = await updateProduct({
      ...productFormData,
      productId: productFormData.productId!,
    } as UpdateProductType);

    if (updateProductSuccess === true) {
      const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
        productFormData.productId!
      );

      if (addImageDataSuccess === true) {
        await handleRevalidate();
        dispatch(resetProductFormData());
        dispatch(resetImageData());
        toast.success('Successfully updated product.');
        router.push('/admin-view/all-products');
      } else if (addImageDataSuccess === false) {
        toast.error(addImageDataMessage);
      }
    } else {
      toast.error(updateProductMessage);
    }

    setIsSubmitting(false);
  }

  return (
    <Box
      component="form"
      onSubmit={productFormData.productId ? handleUpdateProduct : handleAddProduct}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Grid container>
        <Grid
          item
          xs={12}>
          <ManageProductImages isSubmitting={isSubmitting} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography color={colorPalette.textField.label}>Available Sizes *</Typography>
        <ToggleButtons
          aria-label="select size"
          selection={productFormData.sizes}
          onChange={handleSelectSize}
          buttons={orderedSizesForToggleButtons}
          disabled={isSubmitting || isClearingAllFields}
        />
      </Box>
      {formFields.map((field) => {
        return field.type === 'select' ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            onChange={handleInputChange}
            value={productFormData[field.name as keyof typeof productFormData]}
            options={field.options ?? []}
            disabled={isSubmitting || isClearingAllFields}
            required
          />
        ) : field.name === 'price' ? (
          <NumberField
            key={field.name}
            label={field.label}
            name={field.name}
            value={productFormData[field.name as keyof typeof productFormData]}
            onChange={handleInputChange}
            disabled={isSubmitting || isClearingAllFields}
            placeholder={field.placeholder}
            required
          />
        ) : field.name === 'salePercentage' ? (
          <NumberField
            key={field.name}
            label={field.label}
            name={field.name}
            value={productFormData[field.name as keyof typeof productFormData]}
            onChange={handleInputChange}
            disabled={(!isOnSale && field.name === 'salePercentage') || isSubmitting || isClearingAllFields}
            placeholder={field.placeholder}
            required
          />
        ) : (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={productFormData[field.name as keyof typeof productFormData]}
            onChange={handleInputChange}
            multiline={field.multiline ?? false}
            disabled={isSubmitting || isClearingAllFields}
            placeholder={field.placeholder}
            required
          />
        );
      })}
      <ContainedButton
        label={isClearingAllFields ? '' : 'clear all'}
        onClick={handleClearAllFormFields}
        isDisabled={
          uploadInProgress || isSubmitting || isClearingAllFields || emptyFormFields.length === numberOfFormFields
        }
        fullWidth
        component="button"
        isLoading={isClearingAllFields}
        startIcon={<DeleteForever />}
        backgroundColor="red"
      />
      <ContainedButton
        type="submit"
        isDisabled={
          isEditMode ||
          uploadInProgress ||
          isSubmitting ||
          isClearingAllFields ||
          (isOnSale ? emptyFormFields.length > 0 : emptyFormFields.length > 1) ||
          imageData.length === 0
        }
        label={isSubmitting ? '' : productFormData.productId ? 'update product' : 'add product'}
        fullWidth
        isLoading={isSubmitting}
        startIcon={<Add />}
        backgroundColor="blue"
      />
    </Box>
  );
}
