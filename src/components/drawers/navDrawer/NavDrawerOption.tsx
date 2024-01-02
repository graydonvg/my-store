'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { ArrowForwardIos, Logout } from '@mui/icons-material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetAllProductData } from '@/lib/redux/productForm/productFormSlice';

type IconProps = {
  label: string;
  bodyTextColor: string;
};

function Icon({ label, bodyTextColor }: IconProps) {
  if (label === 'Sign Out') {
    return <Logout sx={{ color: bodyTextColor }} />;
  } else {
    return <ArrowForwardIos sx={{ color: bodyTextColor }} />;
  }
}

type ButtonWithLinkProps = {
  showButtonWithLink: boolean;
  path: string;
  label: string;
  bodyTextColor: string;
};

function ButtonWithLink({ showButtonWithLink, path, label, bodyTextColor }: ButtonWithLinkProps) {
  const dispatch = useAppDispatch();

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
          sx={{ color: bodyTextColor, width: 1 }}
        />
        <Icon
          label={label}
          bodyTextColor={bodyTextColor}
        />
      </ListItemButton>
    </Link>
  );
}

type ButtonNoLinkProps = {
  showButtonNoLink: boolean;
  path: string;
  label: string;
  bodyTextColor: string;
};

function ButtonNoLink({ showButtonNoLink, label, bodyTextColor }: ButtonNoLinkProps) {
  if (!showButtonNoLink) return null;

  return (
    <ListItemButton sx={{ width: 1, height: '100%' }}>
      <ListItemText
        primary={label}
        sx={{ color: bodyTextColor }}
      />
      <Icon
        label={label}
        bodyTextColor={bodyTextColor}
      />
    </ListItemButton>
  );
}

type NavDrawerOptionProps = {
  onClick?: () => void;
  path?: string;
  label: string;
  bodyTextColor: string;
};

export default function NavDrawerOption({ onClick, path, label, bodyTextColor }: NavDrawerOptionProps) {
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
          bodyTextColor={bodyTextColor}
        />
        <ButtonNoLink
          showButtonNoLink={!path}
          label={label}
          path={path!}
          bodyTextColor={bodyTextColor}
        />
      </ListItem>
      <Divider />
    </>
  );
}
