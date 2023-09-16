import { Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CustomButton from '@/components/ui/CustomButton';

export default function ShoppingCart() {
  return (
    <CustomButton>
      <ShoppingCartIcon
        aria-label="Shopping cart"
        sx={{ color: 'custom.grey.light' }}
      />
      <Box
        sx={{
          color: 'custom.grey.light',
          backgroundColor: 'custom.blue.dark',
          borderRadius: '50%',
          width: 20,
          height: 20,
          display: 'grid',
          placeContent: 'center',
          marginLeft: 2,
        }}>
        2
      </Box>
    </CustomButton>
  );
}
