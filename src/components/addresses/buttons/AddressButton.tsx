import { Button } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
};

export default function AddressButton({ label, onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      variant="text"
      sx={(theme) => ({
        color: theme.palette.primary.main,
        lineHeight: 1,
        fontWeight: 700,
        ...(label === 'delete' && {
          color: theme.palette.secondary.main,
        }),
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            textDecorationThickness: 1,
            textUnderlineOffset: 2,
          },
        },
      })}>
      {label}
    </Button>
  );
}
