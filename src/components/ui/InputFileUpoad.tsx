import { useTheme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BlueFormButton from './Buttons/BlueFormButton';
import { Input } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function InputFileUpload() {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelColor = mode === 'dark' ? color.grey.dark : color.grey.light;

  return (
    <BlueFormButton
      sx={{ color: labelColor }}
      label={
        <>
          Upload file
          <Input
            type="file"
            sx={{
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              height: 1,
              overflow: 'hidden',
              position: 'absolute',
              bottom: 0,
              left: 0,
              whiteSpace: 'nowrap',
              width: 1,
            }}
          />
        </>
      }
      startIcon={<CloudUploadIcon sx={{ color: labelColor }} />}
      fullWidth={false}
      component="label"
    />
  );
}
