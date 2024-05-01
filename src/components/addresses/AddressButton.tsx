import { Button, useTheme } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
};

export default function AddressButton({ label, onClick }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Button
      onClick={onClick}
      variant="text"
      sx={{
        color: darkMode ? theme.palette.primary.light : theme.palette.primary.main,
        lineHeight: 1,
        fontWeight: 700,
        '@media (hover: hover)': {
          '&:hover': {
            textDecoration: 'underline',
            textDecorationThickness: 1,
            textUnderlineOffset: 2,
          },
        },
      }}>
      {label}
    </Button>
  );
}
