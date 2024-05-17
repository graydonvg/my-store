import { Typography } from '@mui/material';
import UpperNavbarIconButton from '../../UpperNavbarIconButton';
import { Favorite } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function WishlistButton() {
  const router = useRouter();

  function navigateToWishlist() {
    router.push('/wishlist');
  }
  return (
    <UpperNavbarIconButton onClick={navigateToWishlist}>
      <Typography
        component="span"
        fontSize={16}
        sx={{ color: (theme) => theme.palette.custom.navbar.upper.text, marginLeft: 1 }}>
        Wishlist
      </Typography>
      <Favorite
        aria-label="Wishlist"
        sx={{ color: (theme) => theme.palette.grey[500], marginLeft: 1 }}
      />
    </UpperNavbarIconButton>
  );
}
