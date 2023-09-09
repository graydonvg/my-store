import { adminNavOptions, navOptions } from '@/lib/utils';
import NavbarOption from './NavbarOption';

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
            <NavbarOption
              key={option.id}
              label={option.label}
              path={option.path}
            />
          ))
        : navOptions.map((option) => (
            <NavbarOption
              key={option.id}
              label={option.label}
              path={option.path}
            />
          ))}
    </>
  );
}
