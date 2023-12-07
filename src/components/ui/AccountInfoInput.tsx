import { Box, TextField, useTheme } from '@mui/material';
import OutlinedButton from './buttons/OutlinedButton';
import ContainedButton from './buttons/ContainedButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ChangeEvent, MouseEvent } from 'react';

type AccountInfoInputProps = {
  textFieldData: {
    id: string;
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDownFunction: () => void;
  }[];
  disableSave: boolean;
  onSave: (event: MouseEvent<HTMLButtonElement> | undefined) => void;
  onCancel: (event: MouseEvent<HTMLButtonElement> | undefined) => void;
};

export default function AccountInfoInput({ textFieldData, disableSave, onSave, onCancel }: AccountInfoInputProps) {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const focusedColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.1 }}>
      {textFieldData.map((data) => (
        <TextField
          key={data.id}
          sx={{
            '& label.Mui-focused': {
              color: focusedColor,
            },
            '& .MuiOutlinedInput-input:hover': {
              cursor: 'pointer',
            },
            '& .MuiOutlinedInput-input:focus ': {
              cursor: 'auto',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: `1px solid ${focusedColor}`,
              },
              '&:hover fieldset': {
                border: `1px solid ${focusedColor}`,
              },
              '&.Mui-focused fieldset': {
                border: `1px solid ${focusedColor}`,
              },
            },
          }}
          fullWidth={true}
          label={data.label}
          name={data.name}
          type={data.type}
          value={data.value}
          onChange={data.onChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              data.onKeyDownFunction();
            }
          }}
        />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, paddingBottom: 2 }}>
        <ContainedButton
          label="save"
          disabled={disableSave}
          fullWidth={false}
          backgroundColor="blue"
          style={{ minWidth: '96px' }}
          onClick={onSave}
        />
        <OutlinedButton
          label="cancel"
          fullWidth={false}
          style={{ minWidth: '96px' }}
          onClick={onCancel}
        />
      </Box>
    </Box>
  );
}
