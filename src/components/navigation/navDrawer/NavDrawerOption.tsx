'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { ArrowForwardIos, Logout } from '@mui/icons-material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetFormData, resetImageData, resetProductToUpdateId } from '@/lib/redux/addProduct/addProductSlice';

type NavDrawerOptionProps = {
  onClick?: () => void;
  path?: string;
  label: string;
  bodyTextColor: string;
  drawerWidth: string;
};

function renderIcon(label: string, bodyTextColor: string) {
  if (label === 'Sign Out') {
    return <Logout sx={{ color: bodyTextColor }} />;
  } else {
    return <ArrowForwardIos sx={{ color: bodyTextColor }} />;
  }
}

export default function NavDrawerOption({ onClick, path, label, bodyTextColor, drawerWidth }: NavDrawerOptionProps) {
  const dispatch = useAppDispatch();

  function handleClearAddProductStoreData() {
    if (path === '/admin-view/add-product') {
      dispatch(resetImageData());
      dispatch(resetFormData());
      dispatch(resetProductToUpdateId());
    }
  }

  return (
    <>
      <ListItem
        sx={{ height: '56px' }}
        disablePadding
        onClick={onClick}>
        {path ? (
          <Link
            style={{ height: '100%' }}
            onClick={handleClearAddProductStoreData}
            tabIndex={-1}
            href={path}>
            <ListItemButton sx={{ width: drawerWidth, height: '100%' }}>
              <ListItemText
                primary={label}
                sx={{ color: bodyTextColor }}
              />
              {renderIcon(label, bodyTextColor)}
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ width: drawerWidth, height: '100%' }}>
            <ListItemText
              primary={label}
              sx={{ color: bodyTextColor }}
            />
            {renderIcon(label, bodyTextColor)}
          </ListItemButton>
        )}
      </ListItem>
      <Divider />
    </>
  );
}
