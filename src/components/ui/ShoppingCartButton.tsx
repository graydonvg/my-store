import { Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function ShoppingCartButton() {
  const color = useCustomColorPalette();
  return (
    <Box
      component="button"
      sx={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        paddingX: { xs: 0, md: 2 },
        paddingY: 1,
      }}>
      <ShoppingCartIcon
        aria-label="Shopping cart"
        sx={{ color: color.grey.light }}
      />
      <Box
        sx={{
          color: color.grey.light,
          backgroundColor: color.blue.dark,
          borderRadius: '50%',
          width: 20,
          height: 20,
          display: 'grid',
          placeContent: 'center',
          marginLeft: { xs: 1, md: 2 },
        }}>
        2
      </Box>
    </Box>
  );
}
