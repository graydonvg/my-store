'use client';

import { Box, Typography, useTheme } from '@mui/material';
import InputFileUpload from '../ui/InputFileUpoad';
import ToggleButtons from '../ui/ToggleButtons';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type AddNewProductFormProps = {};

export default function AddNewProductForm() {
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.grey.light : color.grey.dark;
  const labelAndBorderColor = mode === 'dark' ? color.grey.light : color.grey.medium;

  const toggleButtonOptions = [
    { label: 'XS', value: 'extra-small' },
    { label: 'S', value: 'small' },
    { label: 'M', value: 'medium' },
    { label: 'L', value: 'large' },
    { label: 'XL', value: 'extra-large' },
  ];

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
    </Box>
  );
}
