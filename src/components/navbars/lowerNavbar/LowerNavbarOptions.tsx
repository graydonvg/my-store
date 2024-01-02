import { accountNavOptions, adminNavOptions, navOptions } from '@/constants/navigation';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';

type AdminNavOptionsProps = {
  show: boolean;
};

function AdminNavOptions({ show }: AdminNavOptionsProps) {
  if (!show) return null;

  return (
    <>
      {adminNavOptions.map((option, index) => {
        const isLastNavOption = adminNavOptions.length - 1 === index;

        return (
          <LowerNavbarOption
            key={option.id}
            label={option.label}
            path={option.path}
            isLastNavOption={isLastNavOption}
          />
        );
      })}
    </>
  );
}

type ClientNavOptionsProps = {
  show: boolean;
};

function ClientNavOptions({ show }: ClientNavOptionsProps) {
  if (!show) return null;

  return (
    <>
      {navOptions.map((option, index) => {
        const isLastNavOption = navOptions.length - 1 === index;

        return (
          <LowerNavbarOption
            key={option.id}
            label={option.label}
            path={option.path}
            isLastNavOption={isLastNavOption}
          />
        );
      })}
    </>
  );
}

type AccountNavOptionsProps = {
  show: boolean;
};

function AccountNavOptions({ show }: AccountNavOptionsProps) {
  if (!show) return null;

  return (
    <>
      {accountNavOptions.map((option, index) => {
        const isLastNavOption = accountNavOptions.length - 1 === index;

        return (
          <LowerNavbarOption
            key={option.id}
            label={option.label}
            path={option.path}
            isLastNavOption={isLastNavOption}
          />
        );
      })}
    </>
  );
}

export default function LowerNavbarOptions() {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const isAccountView = pathname.includes('/account') || pathname.includes('/orders') || pathname.includes('/wishlist');

  return (
    <Box
      component="nav"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AdminNavOptions show={isAdminView} />
        <ClientNavOptions show={!isAdminView && !isAccountView} />
        <AccountNavOptions show={isAccountView} />
      </List>
    </Box>
  );
}
