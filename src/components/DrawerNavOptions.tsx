import { adminNavOptions, navOptions } from '@/lib/utils';
import DrawerNavOption from './DrawerNavOption';
import Box from '@mui/material/Box';

type DrawerNavOptionsType = {
  user: {
    role: string;
  };
  isAuthUser: boolean;
};

export default function DrawerNavOptions({ user, isAuthUser }: DrawerNavOptionsType) {
  return (
    <Box sx={{ width: '100vw' }}>
      {user.role === 'admin'
        ? adminNavOptions
            .filter((option) => (isAuthUser ? option : !option.authRequired))
            .map((option) => (
              <DrawerNavOption
                key={option.id}
                label={option.label}
                path={option.path}
              />
            ))
        : navOptions
            .filter((option) => (isAuthUser ? option : !option.authRequired))
            .map((option) => (
              <DrawerNavOption
                key={option.id}
                label={option.label}
                path={option.path}
              />
            ))}
    </Box>
  );
}
