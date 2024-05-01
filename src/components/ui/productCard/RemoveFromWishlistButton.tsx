import { Box, IconButton, useTheme } from '@mui/material';
import { Spinner } from '../progress/Spinner';
import { Close } from '@mui/icons-material';
import { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { deleteItemFromWishlist } from '@/services/wishlist/delete';

type Props = {
  wishlistItemId: string;
  isRemovingWishlistItem: boolean;
  setIsRemovingWishlistItem: Dispatch<SetStateAction<boolean>>;
};

export default function RemoveFromWishlistButton({
  wishlistItemId,
  isRemovingWishlistItem,
  setIsRemovingWishlistItem,
}: Props) {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    setIsRemovingWishlistItem(false);
  }, [wishlistItemId, setIsRemovingWishlistItem]);

  async function handleRemoveWishlistItem(event: MouseEvent) {
    event.preventDefault();

    setIsRemovingWishlistItem(true);

    const { success, message } = await deleteItemFromWishlist(wishlistItemId);

    if (success === true) {
      router.refresh();
      toast.success('Item removed from wishlist');
    } else {
      toast.error(message);
      setIsRemovingWishlistItem(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: '20px',
        height: '20px',
      }}>
      {!isRemovingWishlistItem ? (
        <IconButton
          onClick={handleRemoveWishlistItem}
          disableRipple
          disabled={isRemovingWishlistItem}
          sx={{
            position: 'relative',
            padding: 0,
            width: 1,
            height: 1,
            color: theme.palette.grey[600],
            stroke: theme.palette.grey[600],
            strokeWidth: 2,
            '@media (hover: hover)': {
              '&:hover': {
                color: theme.palette.error.main,
                stroke: theme.palette.error.main,
              },
            },
          }}>
          <Close fontSize="small" />
        </IconButton>
      ) : (
        <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
          <Spinner
            thickness={8}
            size={16}
            spinnerColor={theme.palette.grey[600]}
          />
        </Box>
      )}
    </Box>
  );
}
