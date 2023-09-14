import { Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CustomButton from '../../ui/CustomButton';

type ShoppingCartProps = {};

export default function ShoppingCart() {
  return (
    <CustomButton
      hoverBackgroundColor="upperNavbar.background"
      paddingX={2}>
      <ShoppingCartIcon
        aria-label="Shopping cart"
        sx={{ color: 'upperNavbar.text' }}
      />
      <Box
        sx={{
          color: 'upperNavbar.text',
          backgroundColor: 'upperNavbar.secondaryIcon',
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
