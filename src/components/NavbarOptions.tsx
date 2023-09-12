import { adminNavOptions, navOptions } from '@/lib/utils';
import NavbarMenu from './NavbarMenu';
import Divider from '@mui/material/Divider';

type NavbarOptionsType = {
  user: {
    role: string;
  };
};

export default function NavbarOptions({ user }: NavbarOptionsType) {
  const lastNavOption = navOptions.length - 1;
  return (
    <>
      {user.role === 'admin'
        ? adminNavOptions.map((option) => (
            <NavbarMenu
              key={option.id}
              label={option.label}
              path={option.path}
            />
          ))
        : navOptions.map((option, index) => {
            return (
              <>
                <NavbarMenu
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
