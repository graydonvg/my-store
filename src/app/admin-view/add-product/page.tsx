'use client';

import { Box, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { addProductToDatabase, uploadImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/lib/utils';
import { AddNewProductFormDataType } from '@/types';
import InputImageUpload from '@/components/ui/InputFields/InputImageUpload';
import ToggleButtons from '@/components/ui/Buttons/ToggleButtons';
import SelectField from '@/components/ui/InputFields/SelectField';
import NumbertField from '@/components/ui/InputFields/NumberField';
import PercentageField from '@/components/ui/InputFields/PercentageField';
import CustomTextField from '@/components/ui/InputFields/CustomTextField';
import BlueFormButton from '@/components/ui/Buttons/BlueFormButton';
import { toast } from 'react-toastify';
import { Spinner } from '@/components/ui/Spinner';

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

const defaultProductFormData: AddNewProductFormDataType = {
  imageData: [],
  sizes: [],
  category: '',
  name: '',
  description: '',
  deliveryInfo: '',
  price: '',
  onSale: '',
  salePercentage: '',
};

export default function AdminViewAddNewProduct() {
  const [formData, setFormData] = useState(defaultProductFormData);
  const [imageUploadProgress, setImageUploadProgress] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const isOnSale = formData['onSale'] === 'Yes';
  const storageItem = 'addNewProductFormData';

  useEffect(() => {
    const savedFormData = localStorage.getItem(storageItem);
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageItem, JSON.stringify(formData));
  }, [formData]);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    const imagesToUpload = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = generateUniqueFileName(file.name);

      imagesToUpload.push({ file, uniqueFileName });
    }

    const uploadPromises = imagesToUpload.map((image, index) =>
      uploadImageToStorage(image.file, image.uniqueFileName, (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageUploadProgress((prevProgress) => {
          const updatedProgress = [...prevProgress];
          updatedProgress[index] = progress;
          return updatedProgress;
        });

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

    const imageData = imageDataArray.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Handle the rejection case if needed
        console.error('Image upload failed:', result.reason);
        return {} as { imageUrl: string; fileName: string };
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      imageData: imageData,
    }));
  }

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    if (formData.sizes.includes(selectedSize)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        sizes: prevFormData.sizes.filter((size) => size !== selectedSize),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        sizes: [...prevFormData.sizes, selectedSize],
      }));
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const isUploadComplete = imageUploadProgress.every((uploadProgress) => uploadProgress === 100);

    if (!isUploadComplete) {
      return toast.error('Image upload still in progress', {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    try {
      await addProductToDatabase(formData);
      setFormData(defaultProductFormData);
      setImageUploadProgress([]);
    } catch (error) {
      console.error(error);
      toast.error(`${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setIsLoading(false);
      toast.success('Product added successfully', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginTop: 4, marginBottom: { xs: 4, md: 'none' } }}>
      <InputImageUpload
        onChange={handleImageUpload}
        formData={formData}
        imageUploadProgress={imageUploadProgress}
        isDisabled={isLoading}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes</Typography>
        <ToggleButtons
          aria-label="select size"
          selection={formData.sizes}
          onChange={handleSelectSize}
          buttons={toggleButtonOptions}
          disabled={isLoading}
        />
        {formData.sizes.length === 0 ? (
          <Typography sx={{ color: textColor }}>Please select at least one size</Typography>
        ) : null}
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
            disabled={isLoading}
          />
        ) : field.type === 'number' ? (
          <NumbertField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            required={true}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        ) : field.type === 'percentage' ? (
          <PercentageField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            required={true}
            onChange={handleInputChange}
            disabled={(!isOnSale && field.name === 'salePercentage') || isLoading}
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
            disabled={isLoading}
          />
        );
      })}
      <BlueFormButton
        type="submit"
        label={isLoading ? 'Loading...' : 'add product'}
        fullWidth
        startIcon={isLoading ? <Spinner size={20} /> : null}
      />
    </Box>
  );
}
