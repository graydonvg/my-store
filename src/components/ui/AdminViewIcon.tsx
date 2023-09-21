'use client';

import { AdminPanelSettings, Store } from '@mui/icons-material';

const iconSize = 'small';
const iconStyles = { color: 'custom.grey.light' };

type AdminViewIconProps = {
  isAdminView: boolean;
};

export function AdminViewIcon({ isAdminView }: AdminViewIconProps) {
  return (
    <>
      {isAdminView ? (
        <Store
          fontSize={iconSize}
          sx={iconStyles}
        />
      ) : (
        <AdminPanelSettings
          fontSize={iconSize}
          sx={iconStyles}
        />
      )}
    </>
  );
}
