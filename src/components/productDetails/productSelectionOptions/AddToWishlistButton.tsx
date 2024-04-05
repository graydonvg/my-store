import { Favorite } from '@mui/icons-material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { toast } from 'react-toastify';
import addItemToWishlist from '@/services/wishlist/add';
import { ProductType } from '@/types';
import { openDialog } from '@/lib/redux/slices/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  size: string | null;
  product: ProductType;
};

export default function AddToWishlistButton({ product, size }: Props) {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const router = useRouter();

  async function addToWishlist() {
    if (!userData) {
      dispatch(openDialog('signInDialog'));
      return;
    }

    if (!size) {
      toast.error('Select a size first.');
      return;
    }

    setIsAddingToWishlist(true);

    // check if item already added!!!

    const { success, message } = await addItemToWishlist({
      size,
      productId: product.productId,
      userId: userData.userId,
    });

    if (success === true) {
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
      disabled={isAddingToWishlist}
      isLoading={isAddingToWishlist}
      fullWidth
      label={!isAddingToWishlist ? 'add to wishlist' : ''}
      backgroundColor="warning"
      startIcon={<Favorite />}
    />
  );
}
