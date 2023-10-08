'use client';

import { Box, Typography, useTheme } from '@mui/material';
import InputFileUpload from '../ui/InputFileUpoad';
import ToggleButtons from '../ui/Buttons/ToggleButtons';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CustomTextField from '../ui/CustomTextField';
import { ChangeEvent, MouseEvent, useState } from 'react';
import SelectField from '../ui/SelectField';
import BlueFormButton from '../ui/Buttons/BlueFormButton';

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
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const isOnSale = formValues['onSale'] === 'Yes';

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  }

  function handleSelectSize(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, selectedSize: string) {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      size: selectedSize,
    }));
  }

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginTop: 4, marginBottom: { xs: 4, md: 'none' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InputFileUpload />
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
        ) : (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formValues[field.name as keyof typeof formValues]}
            required={true}
            onChange={handleInputChange}
            type={field.type === 'number' || field.type === 'percentage' ? 'number' : undefined}
            disabled={!isOnSale && field.name === 'salePercentage' ? true : false}
            InputProps={
              field.type === 'number'
                ? {
                    inputProps: {
                      min: 1,
                    },
                  }
                : field.type === 'percentage'
                ? {
                    inputProps: {
                      min: 1,
                      max: 100,
                    },
                  }
                : undefined
            }
            styles={
              field.type === 'number' || field.type === 'percentage'
                ? {
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      display: 'none',
                    },
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  }
                : undefined
            }
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
