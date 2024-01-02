'use client';

import { Box, Grid, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
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
import addProduct from '@/services/products/add-product';
import addProductImageData from '@/services/product-image-data/add-product-image-data';
import deleteProduct from '@/services/products/delete-product';
import updateProduct from '@/services/products/update-product';
import ManageProductImages from '@/components/ManageProductImages';
import NumberField from '@/components/ui/inputFields/NumberField';
import { toggleButtonSizeOptions } from '@/constants/sizes';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';

const formFields = [
  { label: 'Category', name: 'category', type: 'select', options: ['Men', 'Women', 'kids'] },
  { label: 'Name', name: 'name' },
  { label: 'Description', name: 'description', multiline: true },
  { label: 'Delivery info', name: 'delivery_info', multiline: true },
  { label: 'Return info', name: 'return_info', multiline: true },
  { label: 'Price', name: 'price', placeholder: 'e.g. 199' },
  { label: 'On sale', name: 'on_sale', type: 'select', options: ['No', 'Yes'] },
  { label: 'Sale %', name: 'sale_percentage', placeholder: 'e.g. 20' },
];

export default function AdminViewAddNewProduct() {
  const router = useRouter();
  const { productFormData, imageData, imageUploadProgress, isEditMode } = useAppSelector((state) => state.productForm);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? customColorPalette.white.opacity.strong : customColorPalette.black.opacity.strong;
  const isOnSale = productFormData.on_sale === 'Yes';
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

  async function handleAddImageData(product_id: string) {
    try {
      const newData = imageData.filter((data) => !data.product_image_id);
      const dataToInsert = newData.map((data) => {
        const { product_image_id, ...restOfData } = data;
        return { ...restOfData, product_id };
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

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    let product_id = '';

    try {
      const {
        success: addProductSuccess,
        message: addProductMessage,
        data: productData,
      } = await addProduct(productFormData as InsertProductTypeDb);

      if (addProductSuccess === true && productData) {
        product_id = productData.product_id;

        const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
          productData.product_id
        );

        if (addImageDataSuccess === true) {
          dispatch(resetProductFormData());
          dispatch(resetImageData());
          toast.success('Successfully added product.');
          router.push('/admin-view/all-products');
        } else {
          const { success: deleteProductSuccess, message: deleteProductMessage } = await deleteProduct(product_id);

          if (deleteProductSuccess === false) {
            toast.error(deleteProductMessage);
          }

          toast.error(addImageDataMessage);
        }
      } else {
        toast.error(addProductMessage);
      }
    } catch (error) {
      const { success: deleteProductSuccess, message: deleteProductMessage } = await deleteProduct(product_id);

      if (deleteProductSuccess === false) {
        toast.error(deleteProductMessage);
      }

      toast.error('Failed to add product. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { success: updateProductSuccess, message: updateProductMessage } = await updateProduct({
        ...productFormData,
        product_id: productFormData.product_id!,
      } as UpdateProductType);

      if (updateProductSuccess === true) {
        const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
          productFormData.product_id!
        );

        if (addImageDataSuccess === true) {
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
    } catch (error) {
      toast.error('Failed to update product. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={productFormData.product_id ? handleUpdateProduct : handleAddProduct}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Grid container>
        <Grid
          item
          xs={12}>
          <ManageProductImages isSubmitting={isSubmitting} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ color: textColor }}>Available Sizes *</Typography>
        <ToggleButtons
          aria-label="select size"
          selection={productFormData.sizes}
          onChange={handleSelectSize}
          buttons={toggleButtonSizeOptions}
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
        ) : field.name === 'sale_percentage' ? (
          <NumberField
            key={field.name}
            label={field.label}
            name={field.name}
            value={productFormData[field.name as keyof typeof productFormData]}
            onChange={handleInputChange}
            disabled={(!isOnSale && field.name === 'sale_percentage') || isSubmitting || isClearingAllFields}
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
        label={isSubmitting ? '' : productFormData.product_id ? 'update product' : 'add product'}
        fullWidth
        isLoading={isSubmitting}
        startIcon={<Add />}
        backgroundColor="blue"
      />
    </Box>
  );
}
