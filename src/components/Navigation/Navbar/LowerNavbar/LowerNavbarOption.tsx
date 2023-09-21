'use client';

import { Divider, ListItem, MenuItem, Typography, useTheme } from '@mui/material';
import HoverDropdownMenu from '@/components/ui/HoverDropdownMenu';

type LowerNavbarOptionProps = {
  path: string;
  label: string;
  isLastNavOption: boolean;
};

function renderMenuItem(text: string, key: number) {
  return (
    <MenuItem
      key={key}
      disableRipple
      sx={{
        padding: 0,
        marginX: 2,
        marginY: '6px',
        cursor: 'default',
        color: 'custom.grey.light',
        '&:hover': { backgroundColor: 'custom.grey.dark', color: 'custom.blue.light' },
      }}>
      {/* make this a link. no need for cursor: 'pointer' */}
      {text}
    </MenuItem>
  );
}

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

export default function LowerNavbarOption({ path, label, isLastNavOption }: LowerNavbarOptionProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';
  const menuOffsetBoxBackgroundColor = mode === 'light' ? 'custom.grey.light' : 'custom.grey.medium';

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
                  color: 'custom.grey.dark',
                  textDecoration: 'underline',
                  textDecorationColor: 'custom.grey.dark',
                  textDecorationThickness: 1,
                  textUnderlineOffset: 6,
                },
              }}>
              {label}
            </Typography>
          }>
          {lowerNavbarMenuOptions.map((option, index) => renderMenuItem(option, index))}
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
