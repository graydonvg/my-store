import Link from 'next/link';
import Button from '@mui/material/Button';
import { navbarButtonStyles } from '@/lib/styles';

type NavbarOptionType = {
  path: string;
  label: string;
};

export default function NavbarOption({ path, label }: NavbarOptionType) {
  return (
    <Link
      tabIndex={-1}
      href={path}>
      <Button
        disableTouchRipple
        sx={navbarButtonStyles}>
        {label}
      </Button>
    </Link>
  );
}
