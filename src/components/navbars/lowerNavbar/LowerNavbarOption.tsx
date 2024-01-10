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
};

export default function LowerNavbarOption({ path, label, isLastNavOption }: LowerNavbarOptionProps) {
  const colorPalette = useColorPalette();
  const dispatch = useAppDispatch();
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
              color: colorPalette.navBar.lower.text,
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
