'use client';

import { Box, Typography, useTheme } from '@mui/material';
import InputFileUpload from '../ui/InputFileUpoad';
import ToggleButtons from '../ui/Buttons/ToggleButtons';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CustomTextField from '../ui/CustomTextField';
import { ChangeEvent, useState } from 'react';
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

const defaultFormFields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function AddNewProductForm() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const labelAndBorderColor = mode === 'dark' ? color.grey.light : color.grey.dark;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value,
    }));
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginTop: 4, marginBottom: { xs: 4, md: 'none' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InputFileUpload />
        <Typography sx={{ color: textColor }}>No file chosen</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes</Typography>
        <ToggleButtons
          aria-label="select size"
          buttons={toggleButtonOptions}
          labelAndBorderColor={labelAndBorderColor}
          hoverBorderColor={color.blue.dark}
          selectedLabelColor={color.grey.light}
          selectedBackgroundColor={color.grey.dark}
          selectedHoverBackgroundColor={color.grey.dark}
          selectedBorderColor={color.grey.dark}
        />
      </Box>
      {[
        { label: 'Category', name: 'category', required: true, type: 'select', options: ['Men', 'Women', 'kids'] },
        { label: 'Name', name: 'name', required: true },
        { label: 'Description', name: 'description', required: true },
        { label: 'Delivery info', name: 'delivery-info', required: true },
        { label: 'Price', name: 'price', required: true },
        { label: 'On sale', name: 'on-sale', required: true, type: 'select', options: ['No', 'Yes'] },
        { label: 'Price drop', name: 'price-drop', required: true },
      ].map((field) => {
        return field.type === 'select' ? (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formFields[field.name as keyof typeof formFields]}
            required={true}
            onChange={handleInputChange}
            borderColor={labelAndBorderColor}
            labelColor={labelAndBorderColor}
            focusedLabelColor={labelAndBorderColor}
            options={field.options}
          />
        ) : (
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formFields[field.name as keyof typeof formFields]}
            required={true}
            onChange={handleInputChange}
            borderColor={labelAndBorderColor}
            labelColor={labelAndBorderColor}
            focusedLabelColor={labelAndBorderColor}
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
