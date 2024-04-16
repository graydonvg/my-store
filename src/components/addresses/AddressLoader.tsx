import { Box, useTheme } from '@mui/material';
import { PulseLoader } from 'react-spinners';

type Props = {
  isLoading: boolean;
};

export default function AddressLoader({ isLoading }: Props) {
  const theme = useTheme();

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
        color={theme.palette.custom.typography}
        size={10}
      />
    </Box>
  );
}
