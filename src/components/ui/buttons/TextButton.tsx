import { Button, ButtonProps } from '@mui/material';

type Props = ButtonProps & {
  label: string;
  labelColor: string;
};

export default function TextButton({ label, labelColor, ...props }: Props) {
  return (
    <Button
      variant="text"
      sx={{
        height: 1,
        paddingX: { xs: 0, md: 2 },
        color: labelColor,
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
      {...props}>
      {label}
    </Button>
  );
}
