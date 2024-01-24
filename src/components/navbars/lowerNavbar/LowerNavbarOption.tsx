'use client';

import { Box, Divider, ListItem, Typography } from '@mui/material';
import Link from 'next/link';
import useColorPalette from '@/hooks/useColorPalette';
import { resetAllProductData } from '@/lib/redux/productForm/productFormSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { usePathname, useSelectedLayoutSegments } from 'next/navigation';

type LowerNavbarOptionProps = {
  path: string;
  label: string;
  isLastNavOption: boolean;
};

export default function LowerNavbarOption({ path, label, isLastNavOption }: LowerNavbarOptionProps) {
  const colorPalette = useColorPalette();
  const dispatch = useAppDispatch();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const segments = useSelectedLayoutSegments();
  const segment = segments[1];
  let labelToUnderline;

  if (!isAdminView) {
    if (segment === undefined) {
      labelToUnderline = 'Home';
    } else if (segment.split('-').join(' ') === label.toLowerCase()) {
      labelToUnderline = label;
    }
  } else {
    if (segment === 'all-products') {
      labelToUnderline = 'Manage All Products';
    } else if (segment === 'add-product') {
      labelToUnderline = 'Add New Product';
    } else {
      return;
    }
  }

  function handleClearAddProductStoreData() {
    if (path === '/admin-view/add-product') {
      if (productFormData.productId) {
        dispatch(resetAllProductData());
      }
    }
  }

  return (
    <>
      <ListItem
        disablePadding
        disableGutters>
        <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', paddingX: 2, paddingY: 1 }}>
          <Typography
            component="span"
            sx={{
              textTransform: 'none',
              color: colorPalette.navBar.lower.text,
              textDecoration: label === labelToUnderline ? 'underline' : 'none',
              textDecorationColor: colorPalette.navBar.lower.text,
              textDecorationThickness: 1,
              textUnderlineOffset: 6,
              '&:hover': {
                color: colorPalette.typography,
                textDecoration: 'underline',
                textDecorationColor: colorPalette.typography,
                textDecorationThickness: 1,
                textUnderlineOffset: 6,
              },
            }}>
            <Link
              onClick={handleClearAddProductStoreData}
              href={path}>
              {label}
            </Link>
          </Typography>
        </Box>
      </ListItem>
      {!isLastNavOption ? (
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
        />
      ) : null}
    </>
  );
}
