import { Box, IconButton } from '@mui/material';
import { Spinner } from '../../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import useColorPalette from '@/hooks/useColorPalette';
import { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react';
import { deleteItemFromCart } from '@/services/cart/delete';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CartItemType } from '@/types';

type Props = {
  item: CartItemType;
  isRemovingCartItem: boolean;
  setIsRemovingCartItem: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteButtonSmallCartItem({ item, isRemovingCartItem, setIsRemovingCartItem }: Props) {
  const router = useRouter();
  const colorPalette = useColorPalette();

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [item, setIsRemovingCartItem]);

  async function handleRemoveCartItem(event: MouseEvent) {
    event.stopPropagation();

    setIsRemovingCartItem(true);

    const { success, message } = await deleteItemFromCart(item.cartItemId);

    if (success === true) {
      router.refresh();
    } else {
      toast.error(message);
      setIsRemovingCartItem(false);
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'grid',
        placeItems: 'center',
        width: '20px',
        height: '20px',
      }}>
      {!isRemovingCartItem ? (
        <IconButton
          disabled={isRemovingCartItem}
          onClick={handleRemoveCartItem}
          sx={{
            padding: 0,
            width: 1,
            height: 1,
            color: colorPalette.typographyVariants.grey,
            stroke: colorPalette.typographyVariants.grey,
            strokeWidth: 1,
            '@media (hover: hover)': {
              '&:hover': {
                color: colorPalette.warning.dark,
                stroke: colorPalette.warning.dark,
              },
            },
          }}>
          <Close fontSize="small" />
        </IconButton>
      ) : (
        <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
          <Spinner
            thickness={6}
            size={14}
            spinnerColor={colorPalette.typographyVariants.grey}
          />
        </Box>
      )}
    </Box>
  );
}
