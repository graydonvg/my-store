import { Box, Divider, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
};

export default function ProductDetailsQuantityPicker({ quantity, setQuantity }: Props) {
  function incrementItemQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function decrementItemQuantity() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
            onClick={decrementItemQuantity}
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
            onClick={incrementItemQuantity}
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
