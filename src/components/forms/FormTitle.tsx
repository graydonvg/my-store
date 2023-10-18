import { Typography } from '@mui/material';

type FormTitleProps = {
  text: string;
};

export default function FormTitle({ text }: FormTitleProps) {
  return (
    <Typography
      component="h2"
      variant="h4">
      {text}
    </Typography>
  );
}
