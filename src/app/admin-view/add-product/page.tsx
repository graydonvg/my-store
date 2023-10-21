'use client';

import { Box, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { addProductToDatabase, deleteImageFromStorage, uploadImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName, getEmptyFormFields, getNumberOfFormFields } from '@/lib/utils';
import { AddNewProductFormDataType } from '@/types';
import InputImageUpload from '@/components/ui/inputFields/InputImageUpload';
import ToggleButtons from '@/components/ui/buttons/ToggleButtons';
import SelectField from '@/components/ui/inputFields/SelectField';
import NumbertField from '@/components/ui/inputFields/NumberField';
import PercentageField from '@/components/ui/inputFields/PercentageField';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import CustomButton from '@/components/ui/buttons/CustomButton';
import { Spinner } from '@/components/ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetFormData, setFormData } from '@/lib/redux/addNewProductFormData/addNewProductFormDataSlice';
import { toast } from 'react-toastify';
import { Add, DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const toggleButtonOptions = [
  { label: 'XS', value: 'extra-small' },
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
  { label: 'XL', value: 'extra-large' },
];

const formFields = [
  { label: 'Category', name: 'category', type: 'select', options: ['Men', 'Women', 'kids'] },
  { label: 'Name', name: 'name' },
  { label: 'Description', name: 'description', multiline: true },
  { label: 'Delivery info', name: 'deliveryInfo', multiline: true },
  { label: 'Price', name: 'price', type: 'number' },
  { label: 'On sale', name: 'onSale', type: 'select', options: ['No', 'Yes'] },
  { label: 'Sale % (0 - 100)', name: 'salePercentage', type: 'percentage' },
];

export default function AdminViewAddNewProduct() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { formData } = useAppSelector((state) => state.addNewProductFormData);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingAllFields, setIsClearingAllFields] = useState(false);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const isOnSale = formData['onSale'] === 'Yes';
  const emptyFormFields = getEmptyFormFields(formData);
  const numberOfFormFields = getNumberOfFormFields(formData);
  const uploadInProgress = formData.imageData.some((data) => data.hasOwnProperty('uploadProgress'));

  if (!currentUser || currentUser?.isAdmin === false) return <p>Not authorized</p>;

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

        dispatch(
          setFormData({
            field: 'imageData',
            value: { uploadProgress: progress, fileName: image.uniqueFileName },
          })
        );

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
        return dispatch(setFormData({ field: 'imageData', value: result.value }));
      } else if (result.status === 'rejected') {
        return toast.error('Image upload failed.');
      }
    });
  }

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    if (formData.sizes.includes(selectedSize)) {
      const filteredSizes = formData.sizes.filter((size) => size !== selectedSize);
      dispatch(setFormData({ field: 'sizes', value: filteredSizes }));
    } else {
      dispatch(setFormData({ field: 'sizes', value: [...formData.sizes, selectedSize] }));
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch(setFormData({ field: name as keyof AddNewProductFormDataType, value }));
  }

  async function handleClearAllFormFields() {
    setIsClearingAllFields(true);

    const imagesToDelete = formData.imageData.map((data) => data.fileName);

    const deletePromises = imagesToDelete.map((fileName) => deleteImageFromStorage(fileName));

    const promiseResults = await Promise.allSettled(deletePromises);

    const success = promiseResults.every((result) => result.status === 'fulfilled');

    if (!success) {
      toast.error('Error clearing all images from storage.');
    }

    dispatch(resetFormData());
    setIsClearingAllFields(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await addProductToDatabase(formData);
      if (response === 'success') {
        dispatch(resetFormData());
        toast.success('Successfully added product.');
      }
    } catch (error) {
      toast.error('Failed to add product.');
    } finally {
      setIsLoading(false);
      router.refresh();
      router.push('/admin-view');
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <InputImageUpload
        onChange={handleImageUpload}
        isLoading={isLoading || uploadInProgress}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes</Typography>
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
          />
        ) : field.type === 'number' ? (
          <NumbertField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            disabled={isLoading || isClearingAllFields}
          />
        ) : field.type === 'percentage' ? (
          <PercentageField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            disabled={(!isOnSale && field.name === 'salePercentage') || isLoading || isClearingAllFields}
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
          />
        );
      })}
      <CustomButton
        label={isClearingAllFields ? 'clearing...' : 'clear all'}
        onClick={handleClearAllFormFields}
        disabled={isClearingAllFields || emptyFormFields.length === numberOfFormFields}
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
