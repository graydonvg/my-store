'use client';

import Link from 'next/link';
import { ListItemButton, ListItemText } from '@mui/material';
import { useAppDispatch } from '@/lib/redux/hooks';
import { resetAllProductData } from '@/lib/redux/productForm/productFormSlice';
import useColorPalette from '@/hooks/useColorPalette';
import { usePathname } from 'next/navigation';
import IconNavDrawerOption from './IconNavDrawerOption';

type Props = {
  path: string;
  label: string;
};

export default function ButtonWithLinkNavDrawerOption({ path, label }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const pathname = usePathname();
  const isSaleOption = label.toLowerCase() === 'sale';

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
            color: isSaleOption ? colorPalette.warning.dark : colorPalette.navBar.lower.text,
            width: 1,
            textDecoration: pathname === path ? 'underline' : 'none',
            textDecorationColor: isSaleOption ? colorPalette.warning.light : colorPalette.navBar.lower.text,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
          }}
        />
        <IconNavDrawerOption label={label} />
      </ListItemButton>
    </Link>
  );
}
