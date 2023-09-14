import { Tooltip } from '@mui/material';
import CustomButton from '../../ui/CustomButton';
import LowerNavbarDropdownMenuItem from './LowerNavbarDropdownMenuItem';

type LowerNavbarDropdownMenuProps = {
  path: string;
  label: string;
};

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

export default function LowerNavbarDropdownMenu({ path, label }: LowerNavbarDropdownMenuProps) {
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
          {lowerNavbarMenuOptions.map((item, index) => (
            <LowerNavbarDropdownMenuItem
              key={index}
              menuItemText={item}
            />
          ))}
        </>
      }>
      <CustomButton
        textColor="lowerNavbar.text"
        hoverBackgroundColor="lowerNavbar.background">
        {label}
      </CustomButton>
    </Tooltip>
  );
}
