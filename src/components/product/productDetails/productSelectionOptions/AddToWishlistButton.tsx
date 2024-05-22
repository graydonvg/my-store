import { Favorite } from '@mui/icons-material';
import { toast } from 'react-toastify';
import addItemToWishlist from '@/services/wishlist/add';
import { Product } from '@/types';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { setWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSlice';
import OutlinedButton from '@/components/ui/buttons/simple/OutlinedButton';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { selectWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSelectors';

type Props = {
  product: Product;
  size: string | null;
  setSize: Dispatch<SetStateAction<string | null>>;
  setQuantity: Dispatch<SetStateAction<number>>;
};

export default function AddToWishlistButton({ product, size, setSize, setQuantity }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const wishlistData = useAppSelector(selectWishlistData);
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
      setSize(null);
      setQuantity(1);
    } else {
      toast.error(message);
    }

    setIsAddingToWishlist(false);
  }

  return (
    <OutlinedButton
      onClick={addToWishlist}
      isLoading={isAddingToWishlist}
      fullWidth
      label={!isAddingToWishlist ? 'add to wishlist' : ''}
      color="secondary"
      startIcon={<Favorite sx={{ color: (theme) => theme.palette.secondary.main }} />}
    />
  );
}
