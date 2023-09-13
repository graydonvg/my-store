import { Tooltip } from '@mui/material';
import CustomButton from '../ui/CustomButton';
import DropdownMenuItem from '../ui/DropdownMenuItem';

type LowerNavbarOptionMenuProps = {
  path: string;
  label: string;
};

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

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
          {lowerNavbarMenuOptions.map((option, index) => (
            <DropdownMenuItem
              key={index}
              showIcons={false}
              menuItemText={option}
            />
          ))}
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
