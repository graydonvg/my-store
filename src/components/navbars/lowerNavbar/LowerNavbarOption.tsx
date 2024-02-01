'use client';

import { Box, Divider, ListItem, Typography } from '@mui/material';
import Link from 'next/link';
import useColorPalette from '@/hooks/useColorPalette';
import { resetAllProductData } from '@/lib/redux/productForm/productFormSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

type LowerNavbarOptionProps = {
  path: string;
  label: string;
  isLastNavOption: boolean;
  underline: boolean;
};

export default function LowerNavbarOption({ path, label, isLastNavOption, underline }: LowerNavbarOptionProps) {
  const colorPalette = useColorPalette();
  const dispatch = useAppDispatch();
  const isSaleOption = label.toLowerCase() === 'sale';
  const { productFormData } = useAppSelector((state) => state.productForm);

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
              color: isSaleOption ? colorPalette.warning.dark : colorPalette.navBar.lower.text,
              textDecoration: underline ? 'underline' : 'none',
              textDecorationColor: isSaleOption ? colorPalette.warning.light : colorPalette.navBar.lower.text,
              textDecorationThickness: 1,
              textUnderlineOffset: 6,
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
