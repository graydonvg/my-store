import Link from 'next/link';
import Button from '@mui/material/Button';

type NavbarOptionType = {
  path: string;
  label: string;
};

export default function NavbarOption({ path, label }: NavbarOptionType) {
  return (
    <Link
      tabIndex={-1}
      href={path}>
      <Button sx={{ my: 2, display: 'block', color: 'navbar.text' }}>{label}</Button>
    </Link>
  );
}
