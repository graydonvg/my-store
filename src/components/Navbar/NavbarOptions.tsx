import { navOptions } from '@/lib/utils';
import NavbarOptionMenu from './NavbarOptionMenu';
import Divider from '@mui/material/Divider';

export default function NavbarOptions() {
  const lastNavOption = navOptions.length - 1;
  return (
    <>
      {navOptions.map((option, index) => {
        return (
          <>
            <NavbarOptionMenu
              key={option.id}
              label={option.label}
              path={option.path}
            />
            {index !== lastNavOption ? (
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
            ) : null}
          </>
        );
      })}
    </>
  );
}
