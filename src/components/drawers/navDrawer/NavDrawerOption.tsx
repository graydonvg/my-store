'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { ArrowForwardIos, Logout } from '@mui/icons-material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetAllProductData } from '@/lib/redux/productForm/productFormSlice';
import useColorPalette from '@/hooks/useColorPalette';
import { usePathname } from 'next/navigation';

type IconProps = {
  label: string | 'Sign Out';
};

function Icon({ label }: IconProps) {
  const colorPalette = useColorPalette();

  if (label === 'Sign Out') {
    return <Logout sx={{ color: colorPalette.navBar.lower.text }} />;
  } else {
    return <ArrowForwardIos sx={{ color: colorPalette.navBar.lower.text }} />;
  }
}

type ButtonWithLinkProps = {
  showButtonWithLink: boolean;
  path: string;
  label: string;
};

function ButtonWithLink({ showButtonWithLink, path, label }: ButtonWithLinkProps) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const pathname = usePathname();

  if (!showButtonWithLink) return null;

  function handleClearAddProductStoreData() {
    if (path === '/admin-view/add-product') {
      dispatch(resetAllProductData());
    }
  }

  return (
    <Link
      style={{ height: '100%', width: '100%' }}
      onClick={handleClearAddProductStoreData}
      tabIndex={-1}
      href={path}>
      <ListItemButton sx={{ height: '100%' }}>
        <ListItemText
          primary={label}
          sx={{
            color: colorPalette.navBar.lower.text,
            width: 1,
            textDecoration: pathname === path ? 'underline' : 'none',
            textDecorationColor: colorPalette.navBar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
          }}
        />
        <Icon label={label} />
      </ListItemButton>
    </Link>
  );
}

type ButtonNoLinkProps = {
  showButtonNoLink: boolean;
  path: string;
  label: string;
};

function ButtonNoLink({ showButtonNoLink, label }: ButtonNoLinkProps) {
  const colorPalette = useColorPalette();

  if (!showButtonNoLink) return null;

  return (
    <ListItemButton sx={{ width: 1, height: '100%' }}>
      <ListItemText
        primary={label}
        sx={{ color: colorPalette.navBar.lower.text }}
      />
      <Icon label={label} />
    </ListItemButton>
  );
}

type NavDrawerOptionProps = {
  onClick?: () => void;
  path?: string;
  label: string;
  bodyTextColor: string;
};

export default function NavDrawerOption({ onClick, path, label }: NavDrawerOptionProps) {
  return (
    <>
      <ListItem
        sx={{ height: '56px' }}
        disablePadding
        onClick={onClick}>
        <ButtonWithLink
          showButtonWithLink={!!path}
          label={label}
          path={path!}
        />
        <ButtonNoLink
          showButtonNoLink={!path}
          label={label}
          path={path!}
        />
      </ListItem>
      <Divider />
    </>
  );
}
