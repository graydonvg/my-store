import { ListItem } from '@mui/material';
import LowerNavbarDropdownMenuItem from './LowerNavbarDropdownMenuItem';
import HoverDropdownMenu from '@/components/HoverDropdownMenu';

type LowerNavbarDropdownMenuProps = {
  path: string;
  label: string;
};

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

export default function LowerNavbarDropdownMenu({ path, label }: LowerNavbarDropdownMenuProps) {
  return (
    <ListItem disablePadding>
      <HoverDropdownMenu
        menuOffsetBoxHeight={'10.9px'}
        menuOffsetBoxBackgroundColor="lowerNavbar.background"
        btnTextColor="lowerNavbar.text"
        menuAnchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        menuTransformOrigin={{ vertical: 'top', horizontal: 'center' }}
        btnHoverBackgroundColor="lowerNavbar.background"
        btnLabel={label}>
        {lowerNavbarMenuOptions.map((item, index) => (
          <LowerNavbarDropdownMenuItem
            key={index}
            menuItemText={item}
          />
        ))}
      </HoverDropdownMenu>
    </ListItem>
  );
}
