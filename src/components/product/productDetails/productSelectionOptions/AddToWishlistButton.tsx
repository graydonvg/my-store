import { Favorite } from '@mui/icons-material';
import { toast } from 'react-toastify';
import addItemToWishlist from '@/services/wishlist/add';
import { Product } from '@/types';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';
import OutlinedButton from '@/components/ui/buttons/simple/OutlinedButton';

type Props = {
  size: string | null;
  product: Product;
};

export default function AddToWishlistButton({ product, size }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const wishlistData = useAppSelector((state) => state.wishlist.wishlistData);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  async function addToWishlist() {
    if (!userData) {
      dispatch(openDialog('signInDialog'));
      return;
    }

    if (!size) {
      toast.error('Select a size first.');
      return;
    }

    const itemExists = wishlistData.some((item) => item.productId === product.productId && item.size === size);

    if (itemExists) {
      toast.info('Already added to wishlist');
      return;
    }

    setIsAddingToWishlist(true);

    const { success, message } = await addItemToWishlist({
      size,
      productId: product.productId,
    });

    if (success === true) {
      // dispatch new item to keep button disabled. refresh takes too long to check itemExists.
      dispatch(setWishlistData([...wishlistData, { size, productId: product.productId }]));
      router.refresh();
      toast.success('Added to wishlist');
    } else {
      toast.error(message);
    }

    setIsAddingToWishlist(false);
  }

  return (
    <OutlinedButton
      onClick={addToWishlist}
      disabled={isAddingToWishlist}
      isLoading={isAddingToWishlist}
      fullWidth
      label={!isAddingToWishlist ? 'add to wishlist' : ''}
      color="secondary"
      startIcon={<Favorite sx={{ color: (theme) => theme.palette.secondary.main }} />}
      sxStyles={{ minWidth: 'fit-content', flex: 1 }}
    />
  );
}
