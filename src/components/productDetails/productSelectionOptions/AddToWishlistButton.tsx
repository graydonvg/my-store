import { Favorite } from '@mui/icons-material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { toast } from 'react-toastify';

type Props = {};

export default function AddToWishlistButton() {
  function addToWishlist() {
    // check if item already added!!!

    toast.info('Coming soon!');

    // if (!userData) {
    //   dispatch(openDialog('signInDialog'));
    //   return;
    // }

    // if (!size) {
    //   toast.error('Select a size first.');
    //   return;
    // }
  }

  return (
    <ContainedButton
      onClick={addToWishlist}
      fullWidth
      label="add to wishlist"
      backgroundColor="warning"
      startIcon={<Favorite />}
    />
  );
}
