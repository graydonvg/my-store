'use client';

import { Box, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { categories, generateUniqueFileName, getEmptyFormFields, getNumberOfFormFields } from '@/lib/utils';
import { AddNewProductDbType, AddNewProductStoreType } from '@/types';
import InputImageUpload from '@/components/ui/inputFields/InputImageUpload';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import CurrencyField from '@/components/ui/inputFields/CurrencyField';
import PercentageField from '@/components/ui/inputFields/PercentageField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import CustomButton from '@/components/ui/buttons/CustomButton';
import { Spinner } from '@/components/ui/progress/Spinner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  resetFormData,
  resetImageData,
  setFormData,
  setImageData,
  setImageUploadProgress,
} from '@/lib/redux/addNewProduct/addNewProductSlice';
import { toast } from 'react-toastify';
import { Add, DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import addNewProduct from '@/services/add-product';
import { deleteImageFromStorage, uploadImageToStorage } from '@/lib/firebase';

const toggleButtonOptions = [
  { label: 'XS', value: 'extra-small' },
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
  { label: 'XL', value: 'extra-large' },
];

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
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { formData, imageData, imageUploadProgress } = useAppSelector((state) => state.addNewProduct);
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

  console.log('upload', imageUploadProgress);
  console.log('data', imageData);

  if (!currentUser || currentUser?.is_admin === false) return <p>Not authorized</p>;

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    if (files.length > 5) return toast.error('Max. 5 images allowed');

    const imagesToUpload = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = generateUniqueFileName(file.name);

      imagesToUpload.push({ file, uniqueFileName });
    }

    const uploadPromises = imagesToUpload.map((image) =>
      uploadImageToStorage(image.file, image.uniqueFileName, (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        dispatch(setImageUploadProgress({ fileName: image.uniqueFileName, progress }));

        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      })
    );

    const imageDataArray = await Promise.allSettled(uploadPromises);

    imageDataArray.map((result) => {
      if (result.status === 'fulfilled') {
        const { fileName, url } = result.value;
        return dispatch(setImageData({ fileName, url }));
      } else if (result.status === 'rejected') {
        return toast.error('Image upload failed.');
      }
    });
  }

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    dispatch(setFormData({ field: 'sizes', value: selectedSize }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setFormData({ field: name as keyof AddNewProductStoreType, value }));
  }

  async function handleClearAllFormFields() {
    setIsClearingAllFields(true);

    const imagesToDelete = imageData.map((data) => data.fileName);

    const deletePromises = imagesToDelete.map((fileName) => deleteImageFromStorage(fileName));

    const promiseResults = await Promise.allSettled(deletePromises);

    const success = promiseResults.every((result) => result.status === 'fulfilled');

    if (!success) {
      toast.error('Error clearing all images from storage.');
    }

    dispatch(resetFormData());
    dispatch(resetImageData());
    setIsClearingAllFields(false);
  }

  async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const correctedFormData = formData.sale_percentage === '' ? { ...formData, sale_percentage: null } : formData;
      const response = await addNewProduct(correctedFormData as AddNewProductDbType);
      if (response.statusCode === 200) {
        dispatch(resetFormData());
        toast.success('Successfully added product.');
        router.refresh();
        router.push('/admin-view');
      } else {
        toast.error(`Failed to add product. ${response.message}.`);
      }
    } catch (error) {
      toast.error('Failed to add product. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleAddProduct}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <InputImageUpload
        onChange={handleImageUpload}
        isLoading={isLoading || uploadInProgress}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes *</Typography>
        <ToggleButtons
          aria-label="select size"
          selection={formData.sizes}
          onChange={handleSelectSize}
          buttons={toggleButtonOptions}
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
      <CustomButton
        label={isClearingAllFields ? 'clearing...' : 'clear all'}
        onClick={handleClearAllFormFields}
        disabled={isClearingAllFields || (emptyFormFields.length === numberOfFormFields && imageData.length === 0)}
        fullWidth={true}
        component="button"
        startIcon={isClearingAllFields ? <Spinner size={20} /> : <DeleteForever />}
        styles={{
          backgroundColor: color.red.dark,
          '&:hover': {
            backgroundColor: color.red.light,
          },
        }}
      />
      <CustomButton
        type="submit"
        disabled={
          uploadInProgress || isLoading || isClearingAllFields || isOnSale
            ? emptyFormFields.length > 0
            : emptyFormFields.length > 1
        }
        label={isLoading ? 'loading...' : 'add product'}
        fullWidth
        startIcon={isLoading ? <Spinner size={20} /> : <Add />}
        styles={{
          backgroundColor: color.blue.dark,
          '&:hover': { backgroundColor: color.blue.light },
        }}
      />
    </Box>
  );
}
