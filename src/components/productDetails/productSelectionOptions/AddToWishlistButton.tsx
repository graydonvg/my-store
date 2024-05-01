import { Favorite } from '@mui/icons-material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { toast } from 'react-toastify';
import addItemToWishlist from '@/services/wishlist/add';
import { ProductType } from '@/types';
import { openDialog } from '@/lib/redux/slices/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setWishlistData } from '@/lib/redux/slices/wishlistDataSlice';

type Props = {
  size: string | null;
  product: ProductType;
};

export default function AddToWishlistButton({ product, size }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const wishlistData = useAppSelector((state) => state.wishlist.wishlistData);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const itemExists = wishlistData.some((item) => item.productId === product.productId && item.size === size);

  async function addToWishlist() {
    if (!userData) {
      dispatch(openDialog('signInDialog'));
      return;
    }

    if (!size) {
      toast.error('Select a size first');
      return;
    }

    setIsAddingToWishlist(true);

    const { success, message } = await addItemToWishlist({
      size,
      productId: product.productId,
      userId: userData.userId,
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
    <ContainedButton
      onClick={addToWishlist}
      disabled={isAddingToWishlist || itemExists}
      isLoading={isAddingToWishlist}
      fullWidth
      label={!isAddingToWishlist ? 'add to wishlist' : ''}
      color="error"
      startIcon={<Favorite />}
    />
  );
}
