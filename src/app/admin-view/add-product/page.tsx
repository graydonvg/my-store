'use client';

import { Box, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { deleteImageFromStorage, uploadImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName, getEmptyFormFields, getNumberOfFormFields } from '@/lib/utils';
import { AddNewProductFormDataType } from '@/types';
import InputImageUpload from '@/components/ui/InputFields/InputImageUpload';
import ToggleButtons from '@/components/ui/Buttons/ToggleButtons';
import SelectField from '@/components/ui/InputFields/SelectField';
import NumbertField from '@/components/ui/InputFields/NumberField';
import PercentageField from '@/components/ui/InputFields/PercentageField';
import CustomTextField from '@/components/ui/InputFields/CustomTextField';
import CustomButton from '@/components/ui/Buttons/CustomButton';
import { Spinner } from '@/components/ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetFormData, setFormData } from '@/lib/redux/addNewProductFormData/addNewProductFormDataSlice';
import { toast } from 'react-toastify';
import { DeleteForever } from '@mui/icons-material';

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
  const numberFormFields = getNumberOfFormFields(formData);
  // const uploadInProgress = formData.imageData.some((data) => typeof data.imageUrl === 'number');
  // const uploadInProgressMessage = 'Please wait for the current upload to complete';

  console.log(formData.imageData);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    // if (uploadInProgress) return toast.error(uploadInProgressMessage);

    const files = event.target.files;

    if (!files) return;

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
        toast.error(`Image upload failed. Reason: ${result.reason}`);
        return dispatch(setFormData({ field: 'imageData', value: {} }));
      }
    });

    // dispatch(setFormData({ field: 'imageData', value: imageData }));
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
    // if (uploadInProgress) return toast.error(uploadInProgressMessage);
    setIsClearingAllFields(true);
    const imagesToDelete = formData.imageData.map((data) => data.fileName);

    const deletePromises = imagesToDelete.map((fileName) => deleteImageFromStorage(fileName));

    const promiseResults = await Promise.allSettled(deletePromises);

    const success = promiseResults.every((result) => result.status === 'fulfilled');

    if (success) {
      dispatch(resetFormData());
    } else {
      toast.error(`Failed to clear all images. Please try again later`);
    }
    setIsClearingAllFields(false);
  }

  // async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();

  //   if (isLoading) return;

  //   setIsLoading(true);

  //   const isUploadComplete = imageUploadProgress.every((uploadProgress) => uploadProgress === 100);

  //   if (!isUploadComplete) {
  //     return toast.error('Image upload still in progress', {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }

  //   try {
  //     await addProductToDatabase(formData);
  //     setFormData(defaultProductFormData);
  //     setImageUploadProgress([]);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(`${error}`, {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //     toast.success('Product added successfully', {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  // }

  return (
    <Box
      component="form"
      // onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginTop: 4, marginBottom: { xs: 4, md: 'none' } }}>
      <InputImageUpload
        onChange={handleImageUpload}
        isDisabled={isLoading}
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
        {/* {formData.sizes.length === 0 ? (
          <Typography sx={{ color: textColor }}>Please select at least one size</Typography>
        ) : null} */}
      </Box>
      {formFields.map((field) => {
        return field.type === 'select' ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            required={true}
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
            required={true}
            onChange={handleInputChange}
            disabled={isLoading || isClearingAllFields}
          />
        ) : field.type === 'percentage' ? (
          <PercentageField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            required={true}
            onChange={handleInputChange}
            disabled={(!isOnSale && field.name === 'salePercentage') || isLoading || isClearingAllFields}
          />
        ) : (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            required={true}
            onChange={handleInputChange}
            multiline={field.multiline ?? false}
            disabled={isLoading || isClearingAllFields}
          />
        );
      })}
      <CustomButton
        label={isClearingAllFields ? 'clearing...' : 'clear all'}
        onClick={handleClearAllFormFields}
        disabled={emptyFormFields.length === numberFormFields}
        fullWidth={true}
        component="button"
        startIcon={isClearingAllFields ? <Spinner size={20} /> : <DeleteForever />}
        styles={{
          color: color.grey.light,
          backgroundColor: color.grey.dark,
          '&:hover': { backgroundColor: color.grey.medium },
        }}
      />
      <CustomButton
        type="submit"
        disabled={isClearingAllFields || isOnSale ? emptyFormFields.length > 0 : emptyFormFields.length > 1}
        label={isLoading ? 'Loading...' : 'add product'}
        fullWidth
        startIcon={isLoading ? <Spinner size={20} /> : null}
        styles={{
          backgroundColor: color.blue.dark,
          '&:hover': { backgroundColor: color.blue.light },
        }}
      />
    </Box>
  );
}
