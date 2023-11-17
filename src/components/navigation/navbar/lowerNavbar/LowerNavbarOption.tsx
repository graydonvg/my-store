'use client';

import { Box, Divider, ListItem, MenuItem, Typography, useTheme } from '@mui/material';
import HoverDropdownMenu from '@/components/ui/HoverDropdownMenu';
import Link from 'next/link';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import {
  resetAllProductData,
  resetFormData,
  resetImageData,
  resetProductToUpdateId,
} from '@/lib/redux/addProduct/addProductSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

type LowerNavbarOptionProps = {
  path: string;
  label: string;
  isLastNavOption: boolean;
};

function renderMenuItem(text: string, key: number, color: CustomColorPaletteReturnType) {
  return (
    <MenuItem
      key={key}
      disableRipple
      sx={{
        padding: 0,
        marginX: 2,
        marginY: '6px',
        cursor: 'default',
        color: color.grey.light,
        '&:hover': { backgroundColor: color.grey.dark, color: color.blue.light },
      }}>
      {/* make this a link. no need for cursor: 'pointer' */}
      {text}
    </MenuItem>
  );
}

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

export default function LowerNavbarOption({ path, label, isLastNavOption }: LowerNavbarOptionProps) {
  const theme = useTheme();
  const color = useCustomColorPalette();
  const dispatch = useAppDispatch();
  const { productToUpdateId } = useAppSelector((state) => state.addProduct);
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? color.grey.medium : color.grey.light;
  const labelTextHoverColor = mode === 'light' ? color.grey.dark : 'white';
  const menuOffsetBoxBackgroundColor = mode === 'light' ? color.grey.light : color.grey.medium;

  function handleClearAddProductStoreData() {
    if (path === '/admin-view/add-product') {
      if (productToUpdateId && productToUpdateId?.length > 0) {
        dispatch(resetAllProductData());
      }
    }
  }

  return (
    <>
      <ListItem
        disablePadding
        disableGutters>
        {/* <HoverDropdownMenu
          menuOffsetBoxHeight={'8px'}
          menuOffsetBoxBackgroundColor={menuOffsetBoxBackgroundColor}
          menuAnchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          menuTransformOrigin={{ vertical: 'top', horizontal: 'center' }}
          labelContent={
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
          }>
          {lowerNavbarMenuOptions.map((option, index) => renderMenuItem(option, index, color))}
        </HoverDropdownMenu> */}
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
