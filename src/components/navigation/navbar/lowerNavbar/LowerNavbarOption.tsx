'use client';

import { Divider, ListItem, MenuItem, Typography, useTheme } from '@mui/material';
import HoverDropdownMenu from '@/components/ui/HoverDropdownMenu';
import Link from 'next/link';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import { resetFormData, resetImageData, resetProductToUpdateId } from '@/lib/redux/addProduct/addProductSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

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
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? color.grey.medium : color.grey.light;
  const labelTextHoverColor = mode === 'light' ? color.grey.dark : 'white';
  const menuOffsetBoxBackgroundColor = mode === 'light' ? color.grey.light : color.grey.medium;

  function handleClearProductData() {
    if (path === '/admin-view/add-product') {
      dispatch(resetImageData());
      dispatch(resetFormData());
      dispatch(resetProductToUpdateId());
    }
  }

  return (
    <>
      <ListItem
        disablePadding
        disableGutters>
        <HoverDropdownMenu
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
                onClick={handleClearProductData}
                href={path}>
                {label}
              </Link>
            </Typography>
          }>
          {lowerNavbarMenuOptions.map((option, index) => renderMenuItem(option, index, color))}
        </HoverDropdownMenu>
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
