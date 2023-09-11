import { adminNavOptions, navOptions } from '@/lib/utils';
import NavbarMenu from './NavbarMenu';

type NavbarOptionsType = {
  user: {
    role: string;
  };
};

export default function NavbarOptions({ user }: NavbarOptionsType) {
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
        : navOptions.map((option) => (
            <NavbarMenu
              key={option.id}
              label={option.label}
              path={option.path}
            />
          ))}
    </>
  );
}
