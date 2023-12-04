import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { ButtonProps, IconButton } from '@mui/material';
import { ReactNode } from 'react';

type Props = ButtonProps & {
  children: ReactNode;
};

export default function UpperNavIconButton({ children, ...props }: Props) {
  const customColorPalette = useCustomColorPalette();
  return (
    <IconButton
      sx={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        paddingX: { xs: 0, md: 2 },
        borderRadius: 0,
        backgroundColor: customColorPalette.grey.dark,
        '&:hover': {
          backgroundColor: customColorPalette.grey.dark,
        },
      }}
      {...props}>
      {children}
    </IconButton>
  );
}
