import { Favorite } from '@mui/icons-material';
import ContainedButton from './ContainedButton';
import { toast } from 'react-toastify';

type Props = {};

export default function AddToWishlistButton() {
  function handleAddToWishlist() {
    // check if item already added!!!

    toast.info('Coming soon!');

    // if (!userData) {
    //   handleOpenSignInDialog();
    //   return;
    // }

    // if (!itemSize) {
    //   handleSelectSizeToast();
    //   return;
    // }
  }

  return (
    <ContainedButton
      onClick={handleAddToWishlist}
      fullWidth
      label="add to wishlist"
      backgroundColor="warning"
      startIcon={<Favorite />}
    />
  );
}
