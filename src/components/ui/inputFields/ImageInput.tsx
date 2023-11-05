import { Input, InputProps } from '@mui/material';

export default function ImageInput({ ...inputProps }: InputProps) {
  return (
    <Input
      inputProps={{ accept: 'image/*', multiple: true }}
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
      {...inputProps}
    />
  );
}
