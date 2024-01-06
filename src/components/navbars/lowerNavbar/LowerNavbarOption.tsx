'use client';

import { Box, Divider, ListItem, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { resetAllProductData } from '@/lib/redux/productForm/productFormSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

type LowerNavbarOptionProps = {
  path: string;
  label: string;
  isLastNavOption: boolean;
};

export default function LowerNavbarOption({ path, label, isLastNavOption }: LowerNavbarOptionProps) {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { productFormData } = useAppSelector((state) => state.productForm);
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? customColorPalette.grey.medium : customColorPalette.grey.light;
  const labelTextHoverColor = mode === 'light' ? customColorPalette.grey.dark : 'white';

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
              color: labelTextColor,
              '&:hover': {
                color: labelTextHoverColor,
                textDecoration: 'underline',
                textDecorationColor: labelTextHoverColor,
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
