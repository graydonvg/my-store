import { Box } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { PulseLoader } from 'react-spinners';

type Props = {
  isLoading: boolean;
};

export default function AddressLoader({ isLoading }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        minWidth: '108.16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        borderBottom: 0,
      }}>
      <PulseLoader
        loading={isLoading}
        color={colorPalette.typography}
        size={10}
      />
    </Box>
  );
}
