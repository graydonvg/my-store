import useColorPalette from '@/hooks/useColorPalette';
import { Box } from '@mui/material';
import { PulseLoader } from 'react-spinners';

type Props = {
  isUpdatingCartItem: boolean;
};

export default function LoaderEditCartItemDrawer({ isUpdatingCartItem }: Props) {
  const colorPalette = useColorPalette();

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
        color={colorPalette.typography}
        loading={isUpdatingCartItem}
        size={30}
      />
    </Box>
  );
}
