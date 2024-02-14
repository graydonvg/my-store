'use client';

import { Box, Grid, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { InsertProductTypeDb, InsertProductTypeStore, UpdateProductType } from '@/types';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetProductFormData, resetImageData, setProductFormData } from '@/lib/redux/productForm/productFormSlice';
import { toast } from 'react-toastify';
import { Add, DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import addProduct from '@/services/products/add';
import addProductImageData from '@/services/product-image-data/add';
import deleteProduct from '@/services/products/delete';
import updateProduct from '@/services/products/update';
import ManageProductImages from '@/components/ManageProductImages';
import NumberField from '@/components/ui/inputFields/NumberField';
import { ORDERED_SIZES_FOR_TOGGLE_BUTTONS } from '@/config';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import revalidate from '@/services/revalidate';
import updateProductImageData from '@/services/product-image-data/update';

export default function AdminViewAddNewProduct() {
  const router = useRouter();
  const { productFormData, imageData, imageUploadProgress } = useAppSelector((state) => state.productForm);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const colorPalette = useColorPalette();
  const isOnSale = productFormData.isOnSale === 'Yes';
  const emptyFormFields = getEmptyFormFields(productFormData);
  const numberOfFormFields = getNumberOfFormFields(productFormData);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);

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

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setProductFormData({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setProductFormData({ field: name as keyof InsertProductTypeStore, value }));
  }

  async function handleClearAllFormFields() {
    setIsClearingAllFields(true);
    dispatch(resetProductFormData());
    setIsClearingAllFields(false);
  }

  async function handleAddImageData(productId: string) {
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
        setIsSubmitting(false);
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

  console.log(imageData);

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
        dispatch(resetProductFormData());
        dispatch(resetImageData());
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
          buttons={ORDERED_SIZES_FOR_TOGGLE_BUTTONS}
          disabled={isSubmitting || isClearingAllFields}
        />
      </Box>
      <SelectField
        label="Category"
        name="category"
        onChange={handleInputChange}
        value={productFormData['category']}
        options={['Men', 'Women', 'Kids']}
        disabled={isSubmitting || isClearingAllFields}
        required
      />
      <CustomTextField
        label="Name"
        name="name"
        value={productFormData['name']}
        onChange={handleInputChange}
        disabled={isSubmitting || isClearingAllFields}
        required
      />
      <CustomTextField
        label="Brand"
        name="brand"
        value={productFormData['brand']}
        onChange={handleInputChange}
        disabled={isSubmitting || isClearingAllFields}
        required
      />
      <CustomTextField
        label="Product details"
        name="details"
        value={productFormData['details']}
        onChange={handleInputChange}
        disabled={isSubmitting || isClearingAllFields}
        multiline
        placeholder="e.g. Black, Regular fit, ..."
        required
      />
      <CustomTextField
        label="Delivery info"
        name="deliveryInfo"
        value={productFormData['deliveryInfo']}
        onChange={handleInputChange}
        disabled={isSubmitting || isClearingAllFields}
        multiline
        required
      />
      <CustomTextField
        label="Return info"
        name="returnInfo"
        value={productFormData['returnInfo']}
        onChange={handleInputChange}
        disabled={isSubmitting || isClearingAllFields}
        multiline
        required
      />
      <NumberField
        label="Price"
        name="price"
        value={productFormData['price']}
        onChange={handleInputChange}
        disabled={isSubmitting || isClearingAllFields}
        placeholder="e.g. 199"
        required
      />
      <SelectField
        label="On sale"
        name="isOnSale"
        onChange={handleInputChange}
        value={productFormData['category']}
        options={['No', 'Yes']}
        disabled={isSubmitting || isClearingAllFields}
        required
      />
      <NumberField
        label="Sale %"
        name="salePercentage"
        value={productFormData['salePercentage']}
        onChange={handleInputChange}
        disabled={!isOnSale || isSubmitting || isClearingAllFields}
        placeholder="e.g. 20"
        required
      />
      <ContainedButton
        label={isClearingAllFields ? '' : 'clear all'}
        onClick={handleClearAllFormFields}
        disabled={
          uploadInProgress || isSubmitting || isClearingAllFields || emptyFormFields.length === numberOfFormFields
        }
        fullWidth
        component="button"
        isLoading={isClearingAllFields}
        startIcon={<DeleteForever />}
        backgroundColor="warning"
      />
      <ContainedButton
        type="submit"
        disabled={
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
        backgroundColor="primary"
      />
    </Box>
  );
}
