import { Box, useTheme } from '@mui/material';
import { PulseLoader } from 'react-spinners';

type Props = {
  isUpdatingCartItem: boolean;
};

export default function LoaderEditCartItemDrawer({ isUpdatingCartItem }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        height: 1,
        width: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: (theme) => theme.zIndex.appBar + 2,
        backgroundColor: 'transparent',
      }}>
      <PulseLoader
        color={theme.palette.text.primary}
        loading={isUpdatingCartItem}
        size={30}
      />
    </Box>
  );
}
