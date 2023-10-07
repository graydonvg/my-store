'use client';

import { Box, Typography, useTheme } from '@mui/material';
import InputFileUpload from '../ui/InputFileUpoad';
import ToggleButtons from '../ui/Buttons/ToggleButtons';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CustomTextField from '../ui/CustomTextField';
import { ChangeEvent, useState } from 'react';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginTop: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InputFileUpload />
        <Typography sx={{ color: textColor }}>No file chosen</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: textColor }}>Available Sizes</Typography>
        <ToggleButtons
          buttons={toggleButtonOptions}
          groupAriaLabel="select size"
          labelAndBorderColor={labelAndBorderColor}
          selectedLabelColor={color.grey.light}
          selectedBackgroundColor={color.grey.dark}
          selectedBorderColor={color.grey.dark}
          hoverBackgroundColor={color.grey.dark}
        />
      </Box>
      {[{ label: 'Name', name: 'name', required: true }].map((field) => (
        <CustomTextField
          key={field.name}
          label="Name"
          name="name"
          value={formFields[field.name as keyof typeof formFields]}
          required={true}
          onChange={handleInputChange}
          borderColor={labelAndBorderColor}
          labelColor={labelAndBorderColor}
          focusedLabelColor={labelAndBorderColor}
        />
      ))}
    </Box>
  );
}
