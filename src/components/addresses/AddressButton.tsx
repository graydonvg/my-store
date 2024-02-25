import { Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  label: string;
  onClick: () => void;
};

export default function AddressButton({ label, onClick }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Typography
      onClick={onClick}
      component="button"
      textTransform="uppercase"
      lineHeight={1}
      fontWeight={700}
      sx={{
        color: colorPalette.primary.dark,
        '@media (hover: hover)': {
          '&:hover': {
            color: colorPalette.primary.light,
            textDecoration: 'underline',
            textDecorationColor: colorPalette.primary.light,
            textDecorationThickness: 1,
            textUnderlineOffset: 2,
            cursor: 'pointer',
          },
        },
      }}>
      {label}
    </Typography>
  );
}
