'use client';

import { AdminPanelSettings, Store } from '@mui/icons-material';

const iconSize = 'small';
const iconStyles = { color: 'custom.grey.light' };

type AdminViewToggleIconProps = {
  isAdminView: boolean;
};

export function AdminViewToggleIcon({ isAdminView }: AdminViewToggleIconProps) {
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
