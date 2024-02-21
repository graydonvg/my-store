import { Box, Divider, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { decrementQuantity, incrementQuantity } from '@/lib/redux/slices/productSelectionDetailsSlice';

export default function QuantityPickerProductDetails() {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state) => state.productSelectionDetails.quantity);

  function handleIncrementItemQuantity() {
    dispatch(incrementQuantity());
  }

  function handleDecrementItemQuantity() {
    dispatch(decrementQuantity());
  }

  return (
    <>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <Typography
          component="span"
          fontWeight={600}
          fontSize={14}
          sx={{ textTransform: 'uppercase' }}>
          Quantity
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '320px',
            flexShrink: 1,
          }}>
          <IconButton
            onClick={handleDecrementItemQuantity}
            sx={{
              color: 'inherit',
              height: '56px',
              aspectRatio: 3 / 2,
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'inherit',
              },
            }}>
            <Remove fontSize="small" />
          </IconButton>
          <Typography
            component="span"
            fontWeight={600}
            fontSize={16}
            sx={{ width: '4ch', textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton
            onClick={handleIncrementItemQuantity}
            sx={{
              color: 'inherit',
              height: '56px',
              aspectRatio: 3 / 2,
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
