import { dropdownMenuItemStyles } from '@/lib/styles';
import { Tooltip, MenuItem } from '@mui/material';
import CustomButton from '../ui/CustomButton';

type LowerNavbarOptionMenuProps = {
  path: string;
  label: string;
};

export default function LowerNavbarOptionMenu({ path, label }: LowerNavbarOptionMenuProps) {
  return (
    <Tooltip
      arrow
      slotProps={{
        arrow: {
          sx: {
            color: 'dropdownMenu.background',
          },
        },
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        },
        tooltip: {
          sx: {
            padding: 1,
            backgroundColor: 'dropdownMenu.background',
            maxWidth: 220,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        },
      }}
      title={
        <>
          <MenuItem sx={dropdownMenuItemStyles}>T-Shirts</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Pants</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Shoes</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Hats</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Socks</MenuItem>
        </>
      }>
      <CustomButton
        textColor="lowerNavbar.text"
        hoverBackgroundColor="lowerNavbar.background"
        content={label}
      />
    </Tooltip>
  );
}
