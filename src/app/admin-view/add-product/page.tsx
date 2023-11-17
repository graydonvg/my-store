'use client';

import { Box, Grid, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { categories, getEmptyFormFields, getNumberOfFormFields, toggleButtonSizeOptions } from '@/lib/utils';
import { AddProductDbType, AddProductStoreType, UpdateProductType } from '@/types';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import CurrencyField from '@/components/ui/inputFields/CurrencyField';
import PercentageField from '@/components/ui/inputFields/PercentageField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetFormData, resetImageData, setFormData } from '@/lib/redux/addProduct/addProductSlice';
import { toast } from 'react-toastify';
import { Add, DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import addProduct from '@/services/products/add-product';
import addProductImageData from '@/services/product-image-data/add-product-image-data';
import deleteProduct from '@/services/products/delete-product';
import updateProduct from '@/services/products/update-product';
import ManageProductImages from '@/components/ManageProductImages';
import updateProductImageData from '@/services/product-image-data/update-product-image-data';

const formFields = [
  { label: 'Category', name: 'category', type: 'select', options: categories },
  { label: 'Name', name: 'name' },
  { label: 'Description', name: 'description', multiline: true },
  { label: 'Delivery info', name: 'delivery_info', multiline: true },
  { label: 'Price', name: 'price', type: 'currency' },
  { label: 'On sale', name: 'on_sale', type: 'select', options: ['No', 'Yes'] },
  { label: 'Sale %', name: 'sale_percentage', type: 'percentage' },
];

export default function AdminViewAddNewProduct() {
  const router = useRouter();
  const { formData, imageData, imageUploadProgress, productToUpdateId } = useAppSelector((state) => state.addProduct);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.white.opacity.strong : color.black.opacity.strong;
  const isOnSale = formData['on_sale'] === 'Yes';
  const emptyFormFields = getEmptyFormFields(formData);
  const numberOfFormFields = getNumberOfFormFields(formData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setFormData({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setFormData({ field: name as keyof AddProductStoreType, value }));
  }

  async function handleClearAllFormFields() {
    setIsClearingAllFields(true);
    dispatch(resetFormData());
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

  async function handleUpdateImageData() {
    try {
      const imagesWithNewIndexes = imageData.filter((data, index) => data.index !== index);

      const dataToUpdate = imagesWithNewIndexes.map((data, index) => {
        return { ...data, index };
      });

      if (dataToUpdate.length === 0) {
        return { success: true, message: 'Image data is up to date.' };
      }

      const { success, message } = await updateProductImageData(dataToUpdate);

      return { success, message };
    } catch (error) {
      throw error;
    }
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    let product_id = '';

    try {
      const {
        success: addProductSuccess,
        message: addProductMessage,
        data: productData,
      } = await addProduct(formData as AddProductDbType);

      if (addProductSuccess === true && productData) {
        product_id = productData.product_id;

        const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
          productData.product_id
        );

        if (addImageDataSuccess === true) {
          dispatch(resetFormData());
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
      setIsLoading(false);
    }
  }

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { success: updateProductSuccess, message: updateProductMessage } = await updateProduct({
        ...formData,
        product_id: productToUpdateId!,
      } as UpdateProductType);

      if (updateProductSuccess === true) {
        const { success: addImageDataSuccess, message: addImageDataMessage } = await handleAddImageData(
          productToUpdateId!
        );

        const { success: updateImageDataSuccess, message: updateImageDataMessage } = await handleUpdateImageData();

        if (addImageDataSuccess === true && updateImageDataSuccess == true) {
          dispatch(resetFormData());
          dispatch(resetImageData());
          toast.success('Successfully updated product.');
          router.push('/admin-view/all-products');
        } else if (addImageDataSuccess === false) {
          toast.error(addImageDataMessage);
        } else if (updateImageDataSuccess == true) {
          toast.error(updateImageDataMessage);
        }
      } else {
        toast.error(updateProductMessage);
      }
    } catch (error) {
      toast.error('Failed to update product. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={productToUpdateId ? handleUpdateProduct : handleAddProduct}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Grid container>
        <Grid
          item
          xs={12}>
          <ManageProductImages isLoading={isLoading || uploadInProgress} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes *</Typography>
        <ToggleButtons
          aria-label="select size"
          selection={formData.sizes}
          onChange={handleSelectSize}
          buttons={toggleButtonSizeOptions}
          disabled={isLoading || isClearingAllFields}
        />
      </Box>
      {formFields.map((field) => {
        return field.type === 'select' ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            onChange={handleInputChange}
            value={formData[field.name as keyof typeof formData]}
            options={field.options ?? []}
            disabled={isLoading || isClearingAllFields}
            required
          />
        ) : field.type === 'currency' ? (
          <CurrencyField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            disabled={isLoading || isClearingAllFields}
            required
          />
        ) : field.type === 'percentage' ? (
          <PercentageField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            disabled={(!isOnSale && field.name === 'sale_percentage') || isLoading || isClearingAllFields}
            required
          />
        ) : (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            multiline={field.multiline ?? false}
            disabled={isLoading || isClearingAllFields}
            required
          />
        );
      })}
      <ContainedButton
        label={isClearingAllFields ? '' : 'clear all'}
        onClick={handleClearAllFormFields}
        isDisabled={
          uploadInProgress || isLoading || isClearingAllFields || emptyFormFields.length === numberOfFormFields
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
          uploadInProgress ||
          isLoading ||
          isClearingAllFields ||
          (isOnSale ? emptyFormFields.length > 0 : emptyFormFields.length > 1) ||
          imageData.length === 0
        }
        label={isLoading ? '' : productToUpdateId ? 'update product' : 'add product'}
        fullWidth
        isLoading={isLoading}
        startIcon={<Add />}
        backgroundColor="blue"
      />
    </Box>
  );
}
