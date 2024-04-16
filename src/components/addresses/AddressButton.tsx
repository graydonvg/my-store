import { Typography } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
};

export default function AddressButton({ label, onClick }: Props) {
  return (
    <Typography
      onClick={onClick}
      component="button"
      textTransform="uppercase"
      lineHeight={1}
      fontWeight={700}
      sx={(theme) => ({
        color: theme.palette.custom.primary.dark,
        '@media (hover: hover)': {
          '&:hover': {
            color: theme.palette.custom.primary.light,
            textDecoration: 'underline',
            textDecorationColor: theme.palette.custom.primary.light,
            textDecorationThickness: 1,
            textUnderlineOffset: 2,
            cursor: 'pointer',
          },
        },
      })}>
      {label}
    </Typography>
  );
}
