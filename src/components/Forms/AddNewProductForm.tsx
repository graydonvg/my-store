'use client';

import { Box, Typography, useTheme } from '@mui/material';
import InputFileUpload from '../ui/InputFields/InputFileUpoad';
import ToggleButtons from '../ui/Buttons/ToggleButtons';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CustomTextField from '../ui/InputFields/CustomTextField';
import { ChangeEvent, MouseEvent, useState } from 'react';
import SelectField from '../ui/InputFields/SelectField';
import BlueFormButton from '../ui/Buttons/BlueFormButton';
import NumbertField from '../ui/InputFields/NumberField';
import PercentageField from '../ui/InputFields/PercentageField';
import { uploadImageToStorage } from '@/lib/firebase';
import { generateUniqueFileName } from '@/lib/utils';

type AddNewProductFormProps = {};

const toggleButtonOptions = [
  { label: 'XS', value: 'extra-small' },
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
  { label: 'XL', value: 'extra-large' },
];

const formFields = [
  { label: 'Category', name: 'category', required: true, type: 'select', options: ['Men', 'Women', 'kids'] },
  { label: 'Name', name: 'name', required: true },
  { label: 'Description', name: 'description', required: true },
  { label: 'Delivery info', name: 'deliveryInfo', required: true },
  { label: 'Price', name: 'price', type: 'number', required: true },
  { label: 'On sale', name: 'onSale', required: true, type: 'select', options: ['No', 'Yes'] },
  { label: 'Sale % (0 - 100)', name: 'salePercentage', type: 'percentage', required: true },
];

const defaultFormValues = {
  imageUrls: [''],
  size: '',
  category: '',
  name: '',
  description: '',
  deliveryInfo: '',
  price: undefined,
  onSale: 'No',
  salePercentage: undefined,
};

export default function AddNewProductForm() {
  const [formValues, setFormValues] = useState(defaultFormValues);
  // const [imageUrl, setImageUrl] = useState<string | null>(null);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const isOnSale = formValues['onSale'] === 'Yes';

  console.log(formValues);

  async function handleUploadImage(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) return;

    console.log(files);

    const imagesToUpload = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uniqueFileName = generateUniqueFileName(file.name);
      imagesToUpload.push({ file, uniqueFileName });
    }

    const imageUrlArray = await Promise.allSettled(
      imagesToUpload.map((image) => uploadImageToStorage(image.file, image.uniqueFileName))
    );

    const imageUrls = imageUrlArray.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Handle the rejection case if needed
        console.error('Image upload failed:', result.reason);
        return '';
      }
    });

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      imageUrls: imageUrls,
    }));
  }

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      size: selectedSize,
    }));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  }

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginTop: 4, marginBottom: { xs: 4, md: 'none' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InputFileUpload onChange={handleUploadImage} />
        <Typography sx={{ color: textColor }}>No file chosen</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes</Typography>
        <ToggleButtons
          aria-label="select size"
          selection={formValues.size}
          onChange={handleSelectSize}
          buttons={toggleButtonOptions}
        />
      </Box>
      {formFields.map((field) => {
        return field.type === 'select' ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            required={true}
            onChange={handleInputChange}
            options={field.options ?? []}
          />
        ) : field.type === 'number' ? (
          <NumbertField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formValues[field.name as keyof typeof formValues]}
            required={true}
            onChange={handleInputChange}
          />
        ) : field.type === 'percentage' ? (
          <PercentageField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formValues[field.name as keyof typeof formValues]}
            required={true}
            onChange={handleInputChange}
            disabled={!isOnSale && field.name === 'salePercentage' ? true : false}
          />
        ) : (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formValues[field.name as keyof typeof formValues]}
            required={true}
            onChange={handleInputChange}
          />
        );
      })}
      <BlueFormButton
        label="app product"
        fullWidth
      />
    </Box>
  );
}
