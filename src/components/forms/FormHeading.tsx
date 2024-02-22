import { Typography } from '@mui/material';

type Props = {
  text: string;
};

export default function FormHeading({ text }: Props) {
  return (
    <Typography
      component="h1"
      variant="h4">
      {text}
    </Typography>
  );
}
